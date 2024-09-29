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
        <div className="flex bg-custom-gradient h-full w-full flex flex-col">
            {/* Title */}
            <header className="flex justify-between items-center p-4 text-white shadow-md">
                <h1 className="text-3xl font-semibold">Cloud Notes</h1>
                <img src="./hackUMBCTextShadow.png" alt="Logo" className="h-12" /> {/* Replace with your image path */}
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col p-10">
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                        <div className="flex-1 overflow-y-auto p-4">
                            <AgentChat />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="flex justify-between items-center mt-4 text-gray-500">
                    <img src="./hackLogo24.png" alt="Logo" className="h-8" /> {/* Replace with your image path */}
                    <button 
                        onClick={handleLogout} 
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </footer>
            </main>
        </div>
    );
};

export default Home;
