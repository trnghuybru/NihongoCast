import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBook, FaSadTear } from 'react-icons/fa';

const NotFoundPage = () => {
  // Custom gradient style
  const gradientStyle = {
    background: 'linear-gradient(135deg, #ff4e50 0%, #f9d423 100%)'
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-20 flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 text-white rounded-full shadow-lg" style={gradientStyle}>
            <FaSadTear className="w-12 h-12" />
          </div>
        </div>
        
        <h1 className="text-8xl font-bold text-red-600 mb-2">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/" 
            className="inline-flex items-center px-5 py-3 text-white rounded-lg shadow-md transition"
            style={gradientStyle}
          >
            <FaHome className="mr-2" /> Go Home
          </Link>
          <Link 
            to="/decks" 
            className="inline-flex items-center px-5 py-3 border border-red-400 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <FaBook className="mr-2" /> View Decks
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 