import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useFirebaseData from './useFirebaseData';
import { firestore, auth } from '../firebase';
import { addDoc, collection } from "firebase/firestore";
import ReactMarkdown from 'react-markdown'

export default function AgentChat() {
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState("");
  const [response, setResponse] = useState([]);
  const data = useFirebaseData();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const handleInputChange = (e) => {
    setTask(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse([]);
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/note-response",
        { task },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const generateResult = res.data.find((item) => item.generate)?.generate;
      console.log("Data received: ", generateResult);
      setResponse(generateResult.draft);

      if (currentUser && currentUser.uid) {
        const collectionRef = collection(firestore, currentUser.uid);
        await addDoc(collectionRef, { test: "test" });
      } else {
        console.log("User is not authenticated or UID is not available");
      }
    } catch (error) {
      console.error("Error sending request to server: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-md">
      <h1 className="text-lg font-semibold mb-2 text-gray-800">Chat with Agent</h1>
      <form onSubmit={handleSubmit} className="flex items-center mb-2">
        <input
          type="text"
          value={task}
          onChange={handleInputChange}
          placeholder='Enter your question here'
          className='border border-gray-300 p-2 rounded flex-grow mr-2'
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
      <div className="h-48 overflow-y-auto border border-gray-300 rounded-lg p-2 mb-2 bg-gray-50">
        {response && <ReactMarkdown className="text-gray-800">{response}</ReactMarkdown>}
        <ul>
          {data.map((item, index) => (
            <li key={index} className="text-gray-700">{item.draft}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
