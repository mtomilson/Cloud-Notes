import React, { useState, useEffect } from 'react';
import { signOut } from "firebase/auth";
import { auth, db } from './../firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [folders, setFolders] = useState([]);
    const [currentFolder, setCurrentFolder] = useState(null);

    useEffect(() => {
        fetchFoldersAndFiles();
    }, []);

    const fetchFoldersAndFiles = async () => {
        const userId = auth.currentUser.uid;
        const foldersQuery = query(collection(db, "folders"), where("userId", "==", userId));
        const foldersSnapshot = await getDocs(foldersQuery);
        const foldersData = foldersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFolders(foldersData);

        const filesQuery = query(collection(db, "files"), where("userId", "==", userId), where("folderId", "==", currentFolder || "root"));
        const filesSnapshot = await getDocs(filesQuery);
        const filesData = filesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFiles(filesData);
    };

    const handleLogout = () => {               
        signOut(auth).then(() => {
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
            console.error("Error signing out: ", error);
        });
    }

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
                uploadedAt: new Date()
            });
        }

        fetchFoldersAndFiles();
    }

    const handleCreateFolder = async () => {
        const folderName = prompt("Enter folder name:");
        if (folderName) {
            const userId = auth.currentUser.uid;
            await addDoc(collection(db, "folders"), {
                name: folderName,
                userId: userId,
                createdAt: new Date()
            });
            fetchFoldersAndFiles();
        }
    }

    const handleDeleteFile = async (fileId) => {
        await deleteDoc(doc(db, "files", fileId));
        fetchFoldersAndFiles();
    }

    const handleFolderClick = (folderId) => {
        setCurrentFolder(folderId);
    }

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white shadow-lg overflow-y-auto">
                <div className="p-4">
                    <h1 className="text-2xl font-bold">File Manager</h1>
                </div>
                <nav className="mt-5">
                    <ul>
                        <li className="p-2 hover:bg-gray-700 cursor-pointer" onClick={() => setCurrentFolder(null)}>
                            <span>All Files</span>
                        </li>
                        {folders.map(folder => (
                            <li key={folder.id} className="p-2 hover:bg-gray-700 cursor-pointer" onClick={() => handleFolderClick(folder.id)}>
                                <span>{folder.name}</span>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 bg-gray-100 overflow-auto">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-2xl font-semibold">Welcome Home</p>
                    <button 
                        onClick={handleLogout}
                        className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-200"
                    >
                        Logout
                    </button>
                </div>
                
                {/* File Upload and Create Folder Section */}
                <div className="mb-6 space-x-4">
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        multiple
                        accept=".pdf,.txt,.doc,.docx"
                        className="hidden"
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                        Upload Files
                    </label>
                    <button
                        onClick={handleCreateFolder}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
                    >
                        Create Folder
                    </button>
                </div>

                {/* File List */}
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-xl font-semibold mb-4">Your Files</h2>
                    {files.length === 0 ? (
                        <p>No files in this folder.</p>
                    ) : (
                        <ul>
                            {files.map((file) => (
                                <li key={file.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                    <span>{file.name}</span>
                                    <button
                                        onClick={() => handleDeleteFile(file.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Home;