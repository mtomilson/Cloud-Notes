import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { firestore, auth } from '../firebase';
import { addDoc, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import ReactMarkdown from 'react-markdown';

export default function AgentChat() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [files, setFiles] = useState([]);
  const [conversionResponse, setConversionResponse] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const messagesRef = collection(firestore, 'messages');
      const q = query(
        messagesRef,
        orderBy("timestamp", "asc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChatHistory(messages);
      });

      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && files.length === 0) return;

    setLoading(true);

    try {
      const user = auth.currentUser;
      
      let combinedMessage = message;

      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file, index) => {
          formData.append(`file${index}`, file);
        });

        const fileConversionResponse = await axios.post(
          "http://localhost:8080/api/convert-files",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        combinedMessage += "\n\n" + fileConversionResponse.data.join("\n\n");
      }

      setMessage("");
      setFiles([]);

      // Add user message to Firestore
      await addDoc(collection(firestore, 'messages'), {
        content: message,
        sender: 'user',
        timestamp: new Date(),
        userId: user.uid
      });

      // Send message to backend
      const res = await axios.post(
        "http://localhost:8080/api/note-response",
        { task: combinedMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log(res.data);

      // Process the response
      const aiResponse = res.data.find((item) => item.generate)?.generate;
      setConversionResponse(aiResponse.draft);

      // Add AI response to Firestore
      await addDoc(collection(firestore, 'messages'), {
        content: aiResponse.draft,
        sender: 'ai',
        timestamp: new Date(),
        userId: user.uid
      });

      if (currentUser && currentUser.uid) {
        const collectionRef = collection(firestore, currentUser.uid);
        await addDoc(collectionRef, {
            draft: generateResult.draft,
            task: task,
            timestamp: new Date()
          });
      } else {
        console.log("User is not authenticated or UID is not available");
      }
    } catch (error) {
      console.error("Error sending message: ", error);
    } finally {
      setLoading(false);
    }
  };

  // const processServerResponse = (data) => {
  //   let responseContent = "";

  //   if (data.generate && data.generate.draft) {
  //     responseContent += data.generate.draft;
  //   }

  //   if (data.reflect && data.reflect.critique) {
  //     responseContent += "\n\n### AI Reflection:\n" + data.reflect.critique;
  //   }

  //   if (data.research_plan && data.research_plan.content) {
  //     responseContent += "\n\n### Research Notes:\n" + data.research_plan.content.join("\n");
  //   }

  //   return responseContent;
  // };

  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const validFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'audio/*'];
    
    const filteredFiles = selectedFiles.filter(file => 
      validFileTypes.some(type => file.type.match(type))
    );
    
    if (filteredFiles.length > 5) {
      alert("You can only upload a maximum of 5 files.");
      setFiles(filteredFiles.slice(0, 5));
    } else {
      setFiles(prevFiles => [...prevFiles, ...filteredFiles].slice(0, 5));
    }
  };

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto" style={{ maxHeight: '80vh' }}> {/* Set max height */}
        <div className="space-y-4 p-4">
          {chatHistory.map((msg) => (
            <div key={msg.id} className={`p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'} max-w-3/4`}>
              {typeof msg.content === 'string' ? (
                <ReactMarkdown className="text-sm text-gray-800">{msg.content}</ReactMarkdown>
              ) : (
                <div className="text-sm text-gray-800">Invalid message format</div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
        <div className="mb-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center mb-1 text-sm">
              <span className="mr-2">{file.name}</span>
              <button 
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                {/* You can add an icon or text here */}
                🗑️
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <label className="cursor-pointer bg-gray-200 p-2 border border-gray-300 hover:bg-gray-300 transition">
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              multiple
            />
            📎
          </label>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 transition text-sm"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}