import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useFirebaseData from './useFirebaseData';
import { firestore, auth } from '../firebase';
import { addDoc, collection } from "firebase/firestore";

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
        await addDoc(collectionRef, {tset: "test"});
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
    <>
      <div className='border border-black p-4'>
        <h1 className='bg-red-500 text-white p-2'>Hello</h1>
        <form onSubmit={handleSubmit} className='border border-black text-black mt-4 p-2'>
          <input
            type="text"
            value={task}
            onChange={handleInputChange}
            placeholder='Enter Notes or Question here'
            className='border border-gray-300 p-2 rounded w-full'
          />
        </form>
        {response}
        <ul>
          {data.map((item, index) => (
            <li key={index}>{item.draft}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
