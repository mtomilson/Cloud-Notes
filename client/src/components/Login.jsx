import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { NavLink, useNavigate } from 'react-router-dom';
import GoogleSignInButton from './GoogleSignInButton';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            navigate("/home")
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
        });
    }

    return(
            <main className="flex bg-custom-gradient items-center justify-center min-h-screen">  
                <section className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                    <div>                                            
                        <p className="text-2xl font-bold text-center text-deep-purple mb-6"> Implement App </p>       
                        <form>                                              
                            <div className="mb-4">
                                <label htmlFor="email-address" className="block text-sm font-medium text-deep-purple"   >
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"                                    
                                    required                                                                                
                                    placeholder="Email address"
                                    onChange={(e)=>setEmail(e.target.value)}
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
                                    required                                                                                
                                    placeholder="Password"
                                    onChange={(e)=>setPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-neon-pink focus:border-neon-pink sm:text-sm"
                                />
                            </div>

                            <div className="mb-4">
                                <button onClick={onLogin} className="w-full py-2 px-4 bg-deep-purple text-white font-bold rounded-md hover:bg-neon-pink focus:outline-none focus:bg-neon-pink">      
                                    Login                                                                  
                                </button>
                            </div>                               
                        </form>
                        
                        <div className="flex items-center justify-center">
                            <GoogleSignInButton />
                        </div>
                        

                        <p className="p-4 flex items-center justify-center text-sm text-center text-deep-purple">
                            No account yet? {' '}
                            <NavLink to="/signup" className="font-medium text-neon-pink hover:text-deep-purple">
                            <p>&nbsp;Sign up</p>
                            </NavLink>
                        </p>
                    </div>
                </section>
            </main>
    )
}

export default Login;