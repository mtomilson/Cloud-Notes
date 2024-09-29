from dotenv import load_dotenv
from langgraph.graph import StateGraph, END
from typing import TypedDict, List, Annotated
from langgraph.checkpoint.sqlite import SqliteSaver
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_openai import ChatOpenAI
from pydantic import BaseModel
from tavily import TavilyClient
from flask import Flask, jsonify, request
from flask_cors import CORS
from openai import OpenAI
import json
import os
import operator
import sqlite3
import uuid
from werkzeug.utils import secure_filename
import PyPDF2
import docx
import speech_recognition as sr
from pydub import AudioSegment


# Initialize dotenv to load environment variables
_ = load_dotenv()

# Configure a uuid for each conversation
thread = {"configurable": {"thread_id": uuid.uuid4()}}

# OpenAI Api Key
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Represents the state of an agent in the system, storing its current task, plan, draft, and other key attributes
class AgentState(TypedDict):
    task: str
    lnode: str
    plan: str
    draft: str
    critique: str
    content: List[str]
    queries: List[str]
    revision_number: int
    max_revisions: int
    count: Annotated[int, operator.add]

# Represents a set of search queries to be used for gather information or generating research results
class Queries(BaseModel):
    queries: List[str]

"""
The response class initializes and manages the ensemble of agents in the system.
It sets up the StateGraph, defines nodes for planning, research, generation, and reflection,
and serves as the main entry point for interacting with the agent-based workflow.
This class also handles prompts, communicates with external APIs (like Tavily), 
and orchestrates the flow between different nodes based on the agent's state.
"""

class response():
    def __init__(self):
        # Agent LLM Model
        self.model = ChatOpenAI(model = "gpt-4o-mini", temperature=0)

        # Agent Node Prompts
        self.PLAN_PROMPT = ("""
                            You are an expert academic assistant tasked with creating a high-level outline for a new set of notes. Use the existing study notes and provided\
                            topics to guide the structure of the new notes. Your outline should serve as a foundation to build a more comprehensive version, incorporating the\
                            current content while suggesting areas for further elaboration and expansion, maintaining a focus on the original subject matter
                            """)
        
        self.WRITER_PROMPT = ("""
                            You are a skilled academic assistant tasked with writing excellent notes.\
                            Your goal is to improve and refine the user's study notes and initial outline by\
                            adding detailed explanations, breaking down complex concepts, and suggesting relevant examples.\
                            Ensure that the notes are clear, concise, and easy to understand, while maintaining a focus on\
                            the original subject matter. Utilize all the information provided below as needed and return any content in markdown.
                              
                            ------
                            {content}
                            """)
        
        self.RESEARCH_PLAN_PROMPT = ("""
                                    You are a researcher charged with providing information that can be used when creating\
                                    notes for the following topics. Generate a list of search queries that will gather any relevant\
                                    information. Only generate 2 queries max.
                                    """)

        self.REFLECTION_PROMPT = ("""
                                You are a teacher grading notes based on accuracy, comprehensiveness, and structure.\
                                Generate critique and recommendations for the user's notes.
                                """)

        self.RESEARCH_CRITIQUE_PROMPT = ("""
                                        You are a researcher charged with providing information that can be used when making\
                                        any requested revisions (as outlined below). Generate a list of search queries that will\
                                        gather any relevant information. Only generate 2 queries max.
                                        """)
        
        # Tavily API Call
        self.tavily = TavilyClient(api_key = os.environ["TAVILY_API_KEY"])

        # Construct Agent Node
        builder = StateGraph(AgentState)
        builder.add_node("planner", self.plan_node)
        builder.add_node("research_plan", self.research_plan_node)
        builder.add_node("generate", self.generation_node)
        builder.add_node("reflect", self.reflection_node)
        builder.add_node("research_critique", self.research_critique_node)

        # Agent Graph Entry Point
        builder.set_entry_point("planner")

        # Agent Graph Exit Point (conditional)
        builder.add_conditional_edges(
            "generate", 
            self.should_continue, 
            {END: END, "reflect": "reflect"}
        )

        # Construct Agent State Graph (linkage)
        builder.add_edge("planner", "research_plan")
        builder.add_edge("research_plan", "generate")
        builder.add_edge("reflect", "research_critique")
        builder.add_edge("research_critique", "generate")

        # Used to store threads in local state memory
        memory = SqliteSaver(conn=sqlite3.connect(":memory:", check_same_thread = False))
        self.graph = builder.compile(
            checkpointer = memory,
            # interrupt_after=['planner', 'generate', 'reflect', 'research_plan', 'research_critique']
        )
        
    # Planning Agent
    def plan_node(self, state: AgentState):
        messages = [
            SystemMessage(content = self.PLAN_PROMPT),
            HumanMessage(content = state['task'])
        ]
        response = self.model.invoke(messages)
        return {"plan": response.content,
                "lnode": "planner",
                "count": 1,
        }
    
    # Research Agent
    def research_plan_node(self, state: AgentState):
        queries = self.model.with_structured_output(Queries).invoke([
            SystemMessage(content = self.RESEARCH_PLAN_PROMPT),
            HumanMessage(content = state['task'])
        ])
        content = [] # add to content
        for q in queries.queries:
            response = self.tavily.search(query=q, max_results=2)
            for r in response['results']:
                content.append(r['content'])
        return {"content": content,
                "queries": queries.queries,
                "lnode": "research_plan",
                "count": 1,
        }
    
    # Generation Agent
    def generation_node(self, state: AgentState):
        content = "\n\n".join(state['content'] or [])
        user_message = HumanMessage(
            content=f"{state['task']}\n\nHere is my plan:\n\n{state['plan']}")
        messages = [
            SystemMessage(
                content=self.WRITER_PROMPT.format(content = content)
            ),
            user_message
        ]
        response = self.model.invoke(messages)
        return {"draft": response.content,
                "revision_number": state.get("revision_number", 1) + 1,
                "lnode": "generate",
                "count": 1,
        }
    
    # Reflection Agent
    def reflection_node(self, state: AgentState):
        messages = [
            SystemMessage(content = self.REFLECTION_PROMPT),
            HumanMessage(content = state['draft'])
        ]
        response = self.model.invoke(messages)
        return {"critique": response.content,
                "lnode": "reflect",
                "count": 1,
        }
    
    # Research Critique Agent
    def research_critique_node(self, state: AgentState):
        queries = self.model.with_structured_output(Queries).invoke([
            SystemMessage(content = self.RESEARCH_CRITIQUE_PROMPT),
            HumanMessage(content = state['critique'])
        ])
        content = []
        for q in queries.queries:
            response = self.tavily.search(query=q, max_results=2)
            for r in response['results']:
                content.append(r['content'])
        queries.queries.clear()
        return {"content": content,
                "lnode": "research_critique",
                "count": 1,
        }

    # Checks if the agent should continue processing based on the current revision number
    def should_continue(self, state):
        if state['revision_number'] > state['max_revisions']:
            return END
        return "reflect" 

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173", "supports_credentials": True}})

response_instance = response()
UPLOAD_FOLDER = 'temp_uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def extract_text_from_pdf(file_path):
    with open(file_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
    return text

def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text

def extract_text_from_audio(file_path):
    r = sr.Recognizer()
    
    # Convert audio to WAV format
    audio = AudioSegment.from_file(file_path)
    wav_path = file_path + ".wav"
    audio.export(wav_path, format="wav")
    
    with sr.AudioFile(wav_path) as source:
        audio_data = r.record(source)
        text = r.recognize_google(audio_data)
    
    os.remove(wav_path)  # Clean up temporary WAV file
    return text

@app.route("/api/convert-files", methods=['POST'])
def convert_files():
    if 'file0' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    files = request.files.to_dict(flat=False)
    converted_texts = []

    for file_key in files:
        file = files[file_key][0]
        if file.filename == '':
            continue
        
        if file:
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            
            try:
                if file.content_type == 'application/pdf':
                    text = extract_text_from_pdf(file_path)
                elif file.content_type in ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']:
                    text = extract_text_from_docx(file_path)
                elif file.content_type.startswith('audio/'):
                    text = extract_text_from_audio(file_path)
                else:
                    with open(file_path, 'r') as f:
                        text = f.read()
                
                converted_texts.append(f"[Content of {filename}]:\n{text}")
            except Exception as e:
                print(f"[Error processing {filename}]: {str(e)}")
            finally:
                os.remove(file_path)  # Clean up the uploaded file

    return jsonify(converted_texts)

@app.route("/api/note-response", methods=['GET', 'POST'])
def get_noyr_response():
    task = 'Generate notes for me in linear alg'

    print(request.data)
    if request.method == 'POST':
        input = request.data.decode('utf-8')
        task = json.loads(input)["task"]

    result = []
    for s in response_instance.graph.stream({
    'task': task,
    'max_revisions': 2,
    'revision_number': 1,
    }, thread):
        print(s)
        result.append(s)
        answer = jsonify(result)
        print(answer)
    return answer

@app.route("/api/generate-problems", methods=['GET','POST'])
def generate_problems():
    notes = request.json.get('notes')
    
    problems = generate_problems_from_notes(notes)
    
    return jsonify({"problems": problems})

def generate_problems_from_notes(notes):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a teacher providing a student with additional practice problems based on their study notes."},
            {
                "role": "user",
                "content": f"Based on these notes: '{notes}', generate one practice problem. For the problem, provide only final the answer. Format it like this: 'Question: <question_text> Solution: <solution_text>'"
            }
        ]
    )
    
    # Get the response content
    content = completion.choices[0].message.content
    print("DEBUG: Model response content:", content)  # Add debug logging

    # Check if the response has the expected format
    if "Question:" in content and "Solution:" in content:
        # Split into question and answer parts
        question_part, answer_part = content.split("Solution:", 1)
        question = question_part.replace("Question:", "").strip()
        answer = answer_part.strip()
        print(f"DEBUG: Extracted question: {question}")
        print(f"DEBUG: Extracted answer: {answer}")
        return {"question": question, "answer": answer}
    else:
        # Handle unexpected response format
        print("ERROR: Response does not contain expected 'Question' and 'Solution' format.")
        return {"question": "Unable to generate question", "answer": "Unable to generate answer due to unexpected response format."}



if __name__ == "__main__":
    app.run(debug=True, port=8080)

