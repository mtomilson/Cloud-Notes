import React, { useEffect, useState } from "react";
import { useQuestionContext } from "./QuestionContext";
import axios from "axios";

const Questions = ({ canvasRef }) => {

  const [hidden, setHidden] = useState(true);
  const {question,answer} = useQuestionContext();

    const checkAnswer = async () => {
        setHidden(!hidden);
    };

    return (
        <div className="relative">
            <h1 className="absolute bottom-0 w-full z-50 bg-black bg-opacity-80 text-white text-center p-5 text-2xl font-bold m-0">
                {hidden ? "Q: " + question : "A: " + answer}
                <button 
                className="absolute bottom-0 left-0 z-50 text-white text-left p-2 text-2xl font-bold m-0 w-1/10"
                onClick={checkAnswer}
            >
                CHECK
            </button>
            </h1>
            
        </div>
    );

};

export default Questions;
