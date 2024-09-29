import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import AgentChat from './components/AgentChat';
import GenerateQuestion from './components/GenerateQuestion';
import Questions from './components/Questions.jsx';
// import FlashcardCarousel from './components/FlashcardCarousel.jsx';


function App() {
  
  // {'Example Flashcard Carousel'}

  // const flashcards = [
  //   { question: "What is the capital of France?", answer: "Paris" },
  //   { question: "What is 2 + 2?", answer: "4" },
  //   { question: "Who wrote 'Romeo and Juliet'?", answer: "William Shakespeare" },
  // ];

  // return (
  //   <div className="App flex justify-center items-center h-screen">
  //     <FlashcardCarousel flashcards={flashcards} />
  //   </div>
  // );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              {/* <Home /> */}
              {/* <AgentChat />
              <GenerateQuestion /> */}
              <Home/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
