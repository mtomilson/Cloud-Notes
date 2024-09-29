import React, { useState } from 'react';

const Flashcard = ({ question, answer }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className={`flashcard-container w-64 h-40 perspective-1000 cursor-pointer ${
        isFlipped ? 'flipped' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flashcard relative w-full h-full transition-transform duration-500 transform-style-preserve-3d">
        <div className="front absolute w-full h-full bg-white border border-gray-300 rounded-lg shadow-md flex items-center justify-center p-4 backface-hidden">
          <p className="text-center">{question}</p>
        </div>
        <div className="back absolute w-full h-full bg-blue-100 border border-blue-300 rounded-lg shadow-md flex items-center justify-center p-4 backface-hidden transform rotate-y-180">
          <p className="text-center">{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;