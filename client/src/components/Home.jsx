import React from 'react';
import {  signOut } from "firebase/auth";
import {auth} from './../firebase';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleLogout = () => {               
        signOut(auth).then(() => {
        // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
        // An error happened.
        });
    }

    return (
      <div className="flex h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-800 text-white shadow-lg">
              <div className="p-4">
                  <h1 className="text-2xl font-bold">File Manager</h1>
              </div>
              <nav className="mt-5">
                  <ul>
                      <li className="p-2 hover:bg-gray-700 cursor-pointer">
                          <span>My Files</span>
                      </li>
                      <li className="p-2 hover:bg-gray-700 cursor-pointer">
                          <span>Shared with Me</span>
                      </li>
                      <li className="p-2 hover:bg-gray-700 cursor-pointer">
                          <span>Recent</span>
                      </li>
                      <li className="p-2 hover:bg-gray-700 cursor-pointer">
                          <span>Trash</span>
                      </li>
                  </ul>
              </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-gray-100">
              <div className="flex justify-between items-center mb-4">
                  <p className="text-2xl font-semibold">Welcome Home</p>
                  <button 
                      onClick={handleLogout}
                      className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-200"
                  >
                      Logout
                  </button>
              </div>
              <div>
                  {/* Content related to file management would go here */}
                  <p>This is where your file management content will be displayed.</p>
              </div>
          </main>
      </div>
   );
}

export default Home;