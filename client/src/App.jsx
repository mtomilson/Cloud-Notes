import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import Camera from './components/camera.jsx'
function App() {
  
  {'Example Flashcard Carousel'}
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
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<LandingPage />} />
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/signup" element={<Signup />} />
    //     <Route 
    //       path="/home" 
    //       element={
    //         <ProtectedRoute>
    //           <Home />
    //         </ProtectedRoute>
    //       } 
    //     />
    //   </Routes>
    // </Router>
    <>
    <Camera/>
    </>
  );
}

export default App;