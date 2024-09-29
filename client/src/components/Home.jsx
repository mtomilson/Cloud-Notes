import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from './../firebase';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import AgentChat from "./AgentChat";

const Home = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [userEmail, setUserEmail] = useState('');
    const [isChatVisible, setIsChatVisible] = useState(true); // State to toggle chat visibility

    // useEffect(() => {
    //     const fetchNotes = async () => {
    //         const notesCollection = collection(db, "notes");
    //         const notesSnapshot = await getDocs(notesCollection);
    //         const notesList = notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    //         setNotes(notesList);
    //     };

    //     const user = auth.currentUser;
    //     if (user) {
    //         setUserEmail(user.email); // Get the user's email
    //     }

    //     fetchNotes();
    // }, []);

    // const handleNoteClick = (note) => {
    //     setSelectedNote(note);
    // }

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
        const uploadedFiles = Array.from(event.target.files); // Get the uploaded files
        const userId = auth.currentUser.uid; // Get the current user's ID

        for (let file of uploadedFiles) {
            try {
                await addDoc(collection(db, "files"), {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    userId: userId,
                    uploadedAt: new Date()
                });
                console.log("File ${file.name} uploaded successfully.");
            } catch (error) {
                console.error("Error uploading file ${file.name}:", error);
            }
        }

        // Clear the input field
        event.target.value = ''; 
    };

    const toggleChatVisibility = () => {
        setIsChatVisible(prev => !prev);
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
                <div>
                    <button
                        onClick={handleFileUpload}
                        className="absolute inset-x-0 bottom-10 p-2 hover:bg-gray-700 cursor-pointer"
                    >
                        New File
                    </button>
                </div>
                <div>
                    <button
                        onClick={handleFileUpload}
                        className="absolute inset-x-0 bottom-20 p-2 hover:bg-gray-700 cursor-pointer"
                    >
                        Air Notes
                    </button>
                </div>

                <nav className="mt-5 flex-grow overflow-y-auto">
                    <ul>
                        {notes.map(note => (
                            <li 
                                key={note.id} 
                                className="p-2 hover:bg-gray-600 cursor-pointer"
                                onClick={() => handleNoteClick(note)}
                            >
                                {note.name}
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col p-6 bg-custom-gradient">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl text-white font-semibold">Dashboard</h1>
                </div>
                <div className="flex-grow bg-white rounded-lg p-6 relative">
                    <div className="relative z-10">
                        {/* Content related to file management would go here */}
                        <p>This is where your file management content will be displayed.</p>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-6">
                    <h1 className="text-2xl text-white font-semibold">AI Assistant</h1>
                    <button
                        onClick={toggleChatVisibility}
                        className="bg-gray-600 text-white p-2 rounded hover:bg-gray-500 transition"
                    >
                        {isChatVisible ? 'Minimize' : 'Chat'}
                    </button>
                </div>
                {/* Chatbox Container */}
                {isChatVisible && (
                    <div className="mt-6 p-4 border-t border-gray-300 bg-gray-100 rounded-lg">
                        <AgentChat />
                    </div>
                )}

                {/* Footer Section */}
                <footer className="mt-4 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} hackumbc picture lol.</p>
                </footer>
            </main>
        </div>
    );
};

export default Home;