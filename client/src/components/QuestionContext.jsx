import React, { createContext, useState, useContext } from "react";

// Create the context
const QuestionContext = createContext();

// Create a provider component
export function QuestionProvider({ children }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // Function to update question and answer together
  const setQuestionAndAnswer = (newQuestion, newAnswer) => {
    setQuestion(newQuestion);
    setAnswer(newAnswer);
  };

  return (
    <QuestionContext.Provider value={{ question, answer, setQuestionAndAnswer }}>
      {children}
    </QuestionContext.Provider>
  );
}

// Custom hook to use the QuestionContext
export const useQuestionContext = () => useContext(QuestionContext);
