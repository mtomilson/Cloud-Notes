import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from './../firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  const handleFileUpload = async (event) => {
    const uploadedFiles = Array.from(event.target.files);
    const userId = auth.currentUser.uid;


    for (let file of uploadedFiles) {
      // Here you would typically upload the file to storage
      // For this example, we'll just add metadata to Firestore
      await addDoc(collection(db, "files"), {
        name: file.name,
        type: file.type,
        size: file.size,
        userId: userId,
        folderId: currentFolder || "root",
        uploadedAt: new Date(),
      });
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="relative w-64 bg-gray-800 text-white shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold">File Manager</h1>
        </div>

        <div className="logButton">
          <button
            onClick={handleLogout}
            className="absolute inset-x-0 bottom-0 p-2 hover:bg-gray-700 cursor-pointer"
          >
            Logout
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="absolute inset-x-0 bottom-10 p-2 hover:bg-gray-700 cursor-pointer"
        >
          New File
        </button>


        <nav className="mt-5">
          <ul>
            <li className="p-2 hover:bg-gray-700 cursor-pointer">
              <span>My Notes</span>
            </li>
            <li className="p-2 hover:bg-gray-700 cursor-pointer">
              <span>Recent</span>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 bg-custom-gradient">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl text-white font-semibold">Dashboard</h1>
        </div>
        <div className="flex-grow bg-white rounded-lg p-6 relative">
          <div className=""></div>
          <div className="relative z-10">
            {/* Content related to file management would go here */}
            <p>This is where your file management content will be displayed.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
