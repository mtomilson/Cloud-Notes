import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Flashcard = ({ question, answer }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className={`flashcard-container w-full h-full perspective-1000 cursor-pointer ${
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

const FlashcardCarousel = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const goToPrevious = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? flashcards.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === flashcards.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleTransitionEnd = () => {
    setDirection(0);
  };

  return (
    <div className="relative w-64 h-40">
      <div className="overflow-hidden w-full h-full">
        <div 
          className="relative w-full h-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(${direction * 100}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {[-1, 0, 1].map((offset) => {
            const index = (currentIndex + offset + flashcards.length) % flashcards.length;
            return (
              <div
                key={index}
                className="absolute top-0 w-full h-full transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(${(offset - direction) * 100}%)` }}
              >
                <Flashcard
                  question={flashcards[index].question}
                  answer={flashcards[index].answer}
                />
              </div>
            );
          })}
        </div>
      </div>
      <button
        onClick={goToPrevious}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-12 p-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-12 p-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        <ChevronRight size={24} />
      </button>
      <div className="absolute bottom-0 left-0 right-0 flex justify-center -mb-8">
        <p className="text-sm text-gray-500">
          {currentIndex + 1} / {flashcards.length}
        </p>
      </div>
    </div>
  );
};

export default FlashcardCarousel;