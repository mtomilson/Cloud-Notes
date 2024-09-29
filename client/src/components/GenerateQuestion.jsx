import React, { useState, useEffect } from "react";
import axios from "axios";
import useFirebaseData from "./useFirebaseData";
import { firestore, auth } from "../firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import ReactMarkdown from 'react-markdown';

export default function GenerateQuestion() {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [question, setQuestion] = useState(""); // Store question separately
  const [answer, setAnswer] = useState("");     // Store answer separately

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const fetchLatestNotes = async () => {
    if (!currentUser) return null;

    const notesRef = collection(firestore, currentUser.uid);
    const q = query(notesRef, orderBy("timestamp", "desc"), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const latestNote = querySnapshot.docs[0].data();
      return latestNote.draft; // Assuming 'draft' contains the note content
    }
    return null;
  };

  const generateProblems = async () => {
    setLoading(true);
    try {
      const latestNotes = await fetchLatestNotes();
      if (!latestNotes) {
        console.log("No notes found");
        return;
      }

      const res = await axios.post(
        "http://localhost:8080/api/generate-problems",
        { notes: latestNotes },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res);
      setQuestion(res.data.problems.question);
      setAnswer(res.data.problems.answer);
      console.log(answer);
      console.log(question)
    } catch (error) {
      console.error("Error generating problems:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-md">
      <h2 className="text-lg font-semibold mb-2 text-gray-800">Practice Problems</h2>
      <button
        onClick={generateProblems}
        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition mb-4"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Problems'}
      </button>
      {/* <div className="space-y-4">
        {problems.map((problem, index) => (
          <div key={index} className="border border-gray-200 rounded p-3">
            <ReactMarkdown className="text-gray-800">{problem}</ReactMarkdown>
          </div>
        ))}
      </div> */}
      {question}
      {answer}
    </div>
  );
}