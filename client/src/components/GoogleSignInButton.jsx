import React from 'react';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';

const GoogleSignInButton = () => {
    const navigate = useNavigate();

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            // Redirect to home page after successful sign-in
            navigate('/home');
        } catch (error) {
            console.error("Error signing in with Google", error);
        }
    };

    return (
        <button
            onClick={signInWithGoogle}
            className="flex items-center justify-center w-full px-4 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
        >
            <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10 5.52 0 10-4.48 10-10S17.52 2 12 2zm3 17.28h-1.94c-.18 0-.35-.03-.51-.08-.46-.12-.87-.35-1.22-.65-.33-.28-.55-.64-.67-1.02-.05-.15-.09-.3-.11-.45h5.42c.04.17.08.34.08.51 0 .27-.02.54-.06.79-.06.35-.19.67-.38.97-.3.49-.75.86-1.29 1.08-.54.22-1.14.35-1.77.35-.62 0-1.21-.13-1.77-.35-.55-.22-1.02-.59-1.29-1.08-.19-.3-.32-.62-.38-.97-.05-.26-.07-.53-.07-.79 0-.26.04-.51.09-.76.06-.25.17-.49.31-.71.18-.25.4-.47.67-.66.26-.18.54-.33.85-.43.31-.1.66-.17 1.02-.17h3.12V12h-3.11c-.35 0-.69.07-1.02.17-.31.1-.58.25-.85.43-.26.19-.49.41-.67.66-.14.22-.25.46-.31.71-.06.25-.09.51-.09.76 0 .26.02.53.07.79.06.35.19.67.38.97.27.49.74.86 1.29 1.08.55.22 1.14.35 1.77.35.63 0 1.22-.13 1.77-.35.55-.22 1.02-.59 1.29-1.08.19-.3.32-.62.38-.97.06-.26.06-.53.06-.79 0-.17-.03-.34-.08-.51H12v2.28h1.94c.04.15.07.3.09.45.12.38.34.74.67 1.02.35.3.76.53 1.22.65.16.05.33.08.51.08h1.94v-2.28z"
                    fill="currentColor"
                />
            </svg>
            Sign in with Google
        </button>
    );
};

export default GoogleSignInButton;