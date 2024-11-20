import React, { useState, useEffect } from "react";
import axios from "axios";
import { firestore, auth } from "../firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { useQuestionContext } from "./QuestionContext";

export default function GenerateQuestion() {
  const { question, answer, setQuestionAndAnswer } = useQuestionContext();
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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
      return latestNote.content; // Assuming 'draft' contains the note content
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

      console.log("Question:", res.data.problems.question, "Answer:", res.data.problems.answer);
      setQuestionAndAnswer(res.data.problems.question, res.data.problems.answer);
    } catch (error) {
      console.error("Error generating problems:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={generateProblems}
        className="bg-green-500 text-white p-3 rounded hover:bg-green-600 transition mb-4"
        disabled={loading}
        style={{position: 'absolute', zIndex: '9999',}}
      >
        {loading ? "Generating..." : "Generate Problems"}
      </button>
    </div>
  );
}
