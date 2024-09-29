import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, firestore } from './../firebase';
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import AgentChat from "./AgentChat";

const Home = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const fetchNotes = async () => {
            const notesCollection = collection(firestore, "notes");
            const notesSnapshot = await getDocs(notesCollection);
            const notesList = notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotes(notesList);
        };

        const user = auth.currentUser;
        if (user) {
            setUserEmail(user.email);
        }

        fetchNotes();
    }, []);

    const handleNoteClick = (note) => {
        setSelectedNote(note);
    }

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

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white p-6">
                <h1 className="text-2xl font-bold mb-6">File Manager</h1>
                <nav className="flex-grow overflow-y-auto mb-6">
                    <ul>
                        {notes.map(note => (
                            <li 
                                key={note.id} 
                                className="p-2 hover:bg-gray-700 cursor-pointer rounded"
                                onClick={() => handleNoteClick(note)}
                            >
                                {note.name}
                            </li>
                        ))}
                    </ul>
                </nav>
                <button
                    onClick={handleLogout}
                    className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col p-6">
                <div className="flex-1 flex flex-col">
                    <h1 className="text-2xl font-semibold mb-4">AI Assistant</h1>
                    <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                        <div className="flex-1 overflow-y-auto p-4">
                            <AgentChat />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-4 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} hackumbc picture lol.</p>
                </footer>
            </main>
        </div>
    );
};

export default Home;