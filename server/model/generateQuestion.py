from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a teacher providing a student with additional practice problems. The current question is prove or disprove that 8 divides 56."},
        {
            "role": "user",
            "content": "Generate a similar practice problem and provide a detailed explanation on how to solve it."
        }
    ]
)

print(completion.choices[0].message.content)