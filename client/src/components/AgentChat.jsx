import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { firestore, auth } from '../firebase';
import { addDoc, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import ReactMarkdown from 'react-markdown';
import OpenModal from './OpenModal';
import Camera from './camera';

export default function AgentChat() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [files, setFiles] = useState([]);
  const [conversionResponse, setConversionResponse] = useState([]);
  const chatEndRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const messagesRef = collection(firestore, user.uid);
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
      await addDoc(collection(firestore, user.uid), {
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

      // Process the response
      const aiResponse = res.data.find((item) => item.generate)?.generate;
      setConversionResponse(aiResponse.draft);

      // Add AI response to Firestore
      await addDoc(collection(firestore, user.uid), {
        content: aiResponse.draft,
        sender: 'ai',
        timestamp: new Date(),
        userId: user.uid
      });
    } catch (error) {
      console.error("Error sending message: ", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="flex-grow overflow-y-auto p-4" style={{ maxHeight: '80vh' }}>
        <div className="space-y-4">
          {chatHistory.map((msg) => (
            <div key={msg.id} className={`p-4 rounded-lg ${msg.sender === 'user' ? 'bg-blue-100 ml-auto' : 'bg-white'} max-w-3/4 shadow-md`}>
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
      <form onSubmit={handleSubmit} className="p-4 bg-white shadow-lg">
        <div className="mb-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center mb-1 text-sm bg-gray-200 p-2 rounded">
              <span className="mr-2 truncate">{file.name}</span>
              <button 
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 ml-auto"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <label className="cursor-pointer bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition">
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              multiple
            />
            📎
          </label>
          <button
            type="button"
            onClick={handleOpenModal}
            className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition"
          >
            🔴
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition text-sm"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
      <div className='flex justify-center items-center'>
      <OpenModal open={openModal} handleClose={handleCloseModal} className='flex justify-center items-center'/>

      </div>
      {/* <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="camera-modal"
        aria-describedby="camera-modal-description"
      >
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white border-2 border-gray-300 rounded-lg shadow-xl p-4">
          <Camera />
        </Box>
      </Modal> */}
    </div>
  );
}