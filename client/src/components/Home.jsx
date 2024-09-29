import React, { useState, useEffect } from 'react';
import { signOut } from "firebase/auth";
import { auth, db } from './../firebase';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const fetchNotes = async () => {
            const notesCollection = collection(db, "notes");
            const notesSnapshot = await getDocs(notesCollection);
            const notesList = notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotes(notesList);
        };

        const user = auth.currentUser;
        if (user) {
            setUserEmail(user.email); // Get the user's email
        }

        fetchNotes();
    }, []);

    const handleLogout = () => {
        signOut(auth).then(() => {
            navigate("/");
            console.log("Signed out successfully");
        }).catch((error) => {
            console.error("Error signing out: ", error);
        });
    }

    const handleNoteClick = (note) => {
        setSelectedNote(note);
    }

    const handleFileUpload = async (event) => {
        const uploadedFiles = Array.from(event.target.files);
        const userId = auth.currentUser.uid;
        
        for (let file of uploadedFiles) {
            await addDoc(collection(db, "files"), {
                name: file.name,
                type: file.type,
                size: file.size,
                userId: userId,
                folderId: "root",
                uploadedAt: new Date()
            });
        }
    }

    return (
      <div className="flex h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-800 text-white shadow-lg flex flex-col">
              <div className="p-4">
                  <h1 className="text-2xl font-bold">File Manager</h1>
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
              <div className="p-4">
                  <input type="file" multiple onChange={handleFileUpload} className="hidden" id="fileUpload"/>
                  <label htmlFor="fileUpload" className="block p-2 bg-gray-700 hover:bg-gray-600 cursor-pointer text-center rounded">
                      Upload Files
                  </label>
              </div>
              <div className="p-4">
                  <button onClick={handleLogout} className="bg-red-500 bg-opacity-50 hover:bg-opacity-75 cursor-pointer w-full rounded p-2 text-white">
                      Logout
                  </button>
              </div>
          </aside>

          {/* Main Content */}
         <main className="flex-1 flex flex-col p-6 bg-custom-gradient">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl text-white font-semibold">Welcome Home {userEmail}</h1>
            </div>
            <div className="flex-grow bg-white rounded-lg p-6 relative">
                <div className="relative z-10">
                    {selectedNote ? (
                        <div>
                            <h2 className="text-xl font-bold">{selectedNote.name}</h2>
                            <p>{selectedNote.content}</p>
                        </div>
                    ) : (
                        <p>This is where your file management content will be displayed.</p>
                    )}
                </div>
            </div>
         </main>
      </div>
   );
}

export default Home;
