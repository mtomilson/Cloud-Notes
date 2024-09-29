import React, { useEffect, useState } from "react";
import { useQuestionContext } from "./QuestionContext";
import axios from "axios";

const Questions = ({ canvasRef }) => {
  const { question, answer } = useQuestionContext();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    console.log("GOAL QUESTION: " + question);
    console.log("GOAL ANSWER: " + answer);
  }, []);

  const checkWork = async () => {
    setHidden(!hidden);
  };
  

  return (
    <div>
      <h1
        style={{
          position: "absolute",
          // bottom: '0',
          width: "100%",
          zIndex: 9999, // Ensure it's on top
          backgroundColor: "rgba(0, 0, 0, 0.8)", // Semi-transparent background
          color: "white", // White text for contrast
          textAlign: "center", // Center the text
          padding: "20px", // Padding for spacing
          fontSize: "24px", // Adjust font size
          fontWeight: "bold", // Bold text
          margin: "0", // Remove default margin
        }}
      >
        {hidden? question : answer}
      </h1>

      <button 
        style={{
          position: 'fixed',  // Keep the button stuck to the bottom of the viewport
          top: '0',        // Align at the bottom
          left: '180px',          // Align to the left side
          zIndex: 9999,       // Make sure it's above other elements
          backgroundColor: '#000',  // Example background color
          color: 'white',     // White text for contrast
          textAlign: 'center',
          padding: '10px 20px', // Padding to make the button look good
          fontSize: '18px',   // Adjust font size for readability
          fontWeight: 'bold',
          margin: '0',
          border: 'none',     // Remove default button borders
          borderRadius: '5px', // Optional: round the button corners
          cursor: 'pointer',
        }} 
        onClick={checkWork}
      >
        CHECK
      </button>
    </div>
  );
};

export default Questions;
