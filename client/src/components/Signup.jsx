import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import GoogleSignInButton from '../components/GoogleSignInButton';

const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                navigate("/login");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
    }

    return (
        <main className="flex bg-custom-gradient items-center justify-center min-h-screen">
            <section className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <div>
                    <h1 className="text-2xl font-bold text-center text-deep-purple mb-6"> Cloud Notes</h1> 
                    <form onSubmit={onSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email-address" className="block text-sm font-medium text-deep-purple">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Email address"
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-neon-pink focus:border-neon-pink sm:text-sm"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-deep-purple">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Password"
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-neon-pink focus:border-neon-pink sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-green-purple-gradient text-white font-bold rounded-md hover:bg-pink-purple-gradient focus:outline-none focus:bg-blue-pink-gradient"
                            >
                                Sign up
                            </button>
                        </div>
                        
                    </form>

                    <div className="flex items-center justify-center">
                        <GoogleSignInButton />
                    </div>

                    <p className="p-4 flex items-center justify-center text-sm text-center text-deep-purple">
                        Already have an account?{' '}
                        <NavLink to="/login" className="font-medium text-neon-pink hover:text-deep-purple">
                        &nbsp;Sign in
                        </NavLink>
                    </p>
                </div>
            </section>
        </main>
    );
}

export default Signup;
