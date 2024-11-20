import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => (
  <nav className="bg-royal-blue bg-opacity-80 fixed w-full z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center">
            <span className="ml-2 text-2xl font-bold text-beige">Cloud Notes</span>
          </Link>
        </div>
        <div className="flex items-center">
          <Link to="/login">
            <button className="mr-4 text-white">Login</button>
          </Link>
          <Link to="/signup">
            <button className="text-white">Sign Up</button>
          </Link>
        </div>
      </div>
    </div>
  </nav>
);

const FeatureCard = ({ title, description, icon }) => (
  <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-6 transform transition duration-500 hover:scale-105">
    <div className="text-sea-green mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-deep-purple mb-2">{title}</h3>
    <p className="text-forest-green">{description}</p>
  </div>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-custom-gradient">
      <NavBar />
      <main className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="pt-4 text-4xl sm:text-5xl font-extrabold text-beige mb-4">
              Welcome to Cloud Notes
            </h1>
            <p className="text-xl text-sand">
              Elevate your note-taking experience with our cloud-based solution
            </p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="Seamless Sync"
              description="Access your notes from any device, anytime. Changes sync instantly across all platforms."
              icon={<svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" /></svg>}
            />
            <FeatureCard 
              title="Smart Organization"
              description="Our AI helps categorize and tag your notes automatically, making retrieval a breeze."
              icon={<svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/></svg>}
            />
            <FeatureCard 
              title="Collaborative Workspaces"
              description="Share notes and collaborate in real-time with team members or study groups."
              icon={<svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/></svg>}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            <FeatureCard 
              title="Rich Media Support"
              description="Embed images, audio, and video directly into your notes for comprehensive documentation."
              icon={<svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>}
            />
            <FeatureCard 
              title="Powerful Search"
              description="Find any note instantly with our advanced search capabilities, including OCR for images."
              icon={<svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>}
            />
            <FeatureCard 
              title="Secure Encryption"
              description="Your notes are protected with end-to-end encryption, ensuring your data remains private."
              icon={<svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>}
            />
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/signup">
              <button className="bg-royal-blue text-lg px-8 py-3 text-white rounded-lg hover:bg-opacity-90 transition duration-300">
                Start Your Free Trial
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;