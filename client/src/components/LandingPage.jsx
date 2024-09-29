import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => (
  <nav className="bg-royal-blue bg-opacity-80 fixed w-full z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center">
            <span className="ml-2 text-2xl font-bold text-beige">Implement</span>
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
  <div className="bg-light-gray bg-opacity-80 rounded-lg shadow-lg p-6 transform transition duration-500 hover:scale-105">
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
              Welcome to Implement
            </h1>
            <p className="text-xl text-sand">
              Boost your productivity with our futuristic task management solution
            </p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="Smart Task Prioritization"
              description="Our AI-powered system helps you focus on what matters most."
              icon={<svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>}
            />
            <FeatureCard 
              title="Collaborative Workspaces"
              description="Seamlessly work with your team in real-time, boosting efficiency."
              icon={<svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/></svg>}
            />
            <FeatureCard 
              title="Eco-Friendly Analytics"
              description="Track your productivity while minimizing your carbon footprint."
              icon={<svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>}
            />
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
            <FeatureCard 
              title="Smart Task Prioritization"
              description="Our AI-powered system helps you focus on what matters most."
              icon={<svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>}
            />
            <FeatureCard 
              title="Collaborative Workspaces"
              description="Seamlessly work with your team in real-time, boosting efficiency."
              icon={<svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/></svg>}
            />
            <FeatureCard 
              title="Eco-Friendly Analytics"
              description="Track your productivity while minimizing your carbon footprint."
              icon={<svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>}
            />
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/signup">
              <button className="bg-royal-blue text-lg px-8 py-3 text-white">
                Get Started Now
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;