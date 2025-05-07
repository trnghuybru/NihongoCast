import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSave, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { deckApi } from '../services/api';

const CreateDeckPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const newDeck = await deckApi.createDeck(formData);
      navigate(`/decks/${newDeck._id}`);
    } catch (err) {
      setError('Failed to create deck. Please try again.');
      console.error('Error creating deck:', err);
      setLoading(false);
    }
  };

  // Custom gradient style
  const gradientStyle = {
    background: 'linear-gradient(135deg, #ff4e50 0%, #f9d423 100%)'
  };
  
  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/decks" className="hover:text-red-600 transition">Decks</Link>
          <span className="mx-2">›</span>
          <span className="font-medium text-gray-900">Create New Deck</span>
        </div>
        
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden max-w-3xl mx-auto">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h1 className="text-xl font-bold text-gray-800">Create New Deck</h1>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Deck Name
                </label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter deck name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-orange-200 focus:border-red-400"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Choose a descriptive name for your flashcard deck.
                </p>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea 
                  id="description" 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter deck description"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-orange-200 focus:border-red-400"
                  required
                ></textarea>
                <p className="mt-1 text-sm text-gray-500">
                  Describe what this deck is for and what kind of flashcards it will contain.
                </p>
              </div>
              
              <div className="flex justify-between items-center pt-4">
                <Link 
                  to="/decks" 
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition"
                >
                  <FaArrowLeft className="mr-2" /> Cancel
                </Link>
                <button 
                  type="submit" 
                  className="inline-flex items-center px-5 py-2.5 text-white rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={gradientStyle}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" /> Create Deck
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDeckPage; 