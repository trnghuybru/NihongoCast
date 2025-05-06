import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaSortAmountDown, FaBoxOpen } from 'react-icons/fa';
import DeckCard from '../components/decks/DeckCard';
import { deckApi } from '../services/api';
// import '../styles/index.scss';
const DecksPage = () => {
  console.log("DecksPage loaded")
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  
  useEffect(() => {
    fetchDecks();
  }, []);
  
  const fetchDecks = async () => {
    try {
      setLoading(true);
      const data = await deckApi.getAllDecks();
      console.log('Fetched decks:', data);
      setDecks(data);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching decks:', err);
      setError('Failed to load decks. Please try again later.');
      console.error('Error fetching decks:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteDeck = async (deckId) => {
    try {
      await deckApi.deleteDeck(deckId);
      setDecks(decks.filter(deck => deck._id !== deckId));
    } catch (err) {
      setError('Failed to delete deck. Please try again.');
      console.error('Error deleting deck:', err);
    }
  };
  
  const filteredDecks = decks.filter(deck => 
    deck.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    deck.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const sortedDecks = [...filteredDecks].sort((a, b) => {
    if (sortOption === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOption === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortOption === 'name-asc') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'name-desc') {
      return b.name.localeCompare(a.name);
    } else if (sortOption === 'cards-most') {
      return (b.cards?.length || 0) - (a.cards?.length || 0);
    } else if (sortOption === 'cards-least') {
      return (a.cards?.length || 0) - (b.cards?.length || 0);
    }
    return 0;
  });

  // Custom gradient style
  const gradientStyle = {
    background: 'linear-gradient(135deg, #ff4e50 0%, #f9d423 100%)'
  };
  
  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Flashcard Decks</h1>
            <p className="text-gray-600 max-w-2xl">
              Create and manage your flashcard decks for effective Japanese language learning.
            </p>
          </div>
          <Link 
            to="/decks/new" 
            className="mt-4 md:mt-0 inline-flex items-center px-5 py-2.5 text-white rounded-lg shadow-md transition duration-300 transform hover:-translate-y-1"
            style={gradientStyle}
          >
            <FaPlus className="mr-2" /> Create Deck
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search decks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 block w-full rounded-lg border border-gray-200 bg-white py-2.5 px-4 text-gray-700 focus:border-red-400 focus:ring-2 focus:ring-orange-200 outline-none transition"
            />
          </div>
          
          <div className="relative min-w-[180px]">
            <div 
              className="flex justify-between items-center w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300"
              onClick={() => document.getElementById('sort-dropdown').classList.toggle('hidden')}
            >
              <span className="block truncate">Sort: {sortOption.replace('-', ' ')}</span>
              <FaSortAmountDown className="ml-2 text-gray-400" />
            </div>
            <div 
              id="sort-dropdown" 
              className="hidden absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden"
            >
              {[
                { value: 'newest', label: 'Newest' },
                { value: 'oldest', label: 'Oldest' },
                { value: 'name-asc', label: 'Name (A-Z)' },
                { value: 'name-desc', label: 'Name (Z-A)' },
                { value: 'cards-most', label: 'Most cards' },
                { value: 'cards-least', label: 'Least cards' }
              ].map(option => (
                <div 
                  key={option.value}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-50 ${sortOption === option.value ? 'bg-orange-50 text-red-600 font-medium' : 'text-gray-700'}`}
                  onClick={() => {
                    setSortOption(option.value);
                    document.getElementById('sort-dropdown').classList.add('hidden');
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : error ? (
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
        ) : sortedDecks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-gray-50 p-6 rounded-full mb-6 text-gray-400">
              <FaBoxOpen className="w-16 h-16" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No decks found</h3>
            <p className="text-gray-600 text-center max-w-md mb-8">
              {searchQuery ? 
                `No decks match your search "${searchQuery}". Try a different search term or clear the search.` : 
                "You don't have any flashcard decks yet. Create your first deck to get started!"}
            </p>
            <Link 
              to="/decks/new"
              className="inline-flex items-center px-5 py-2.5 text-white rounded-lg shadow-md transition duration-300"
              style={gradientStyle}
            >
              <FaPlus className="mr-2" /> Create Your First Deck
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedDecks.map(deck => (
              <DeckCard 
                key={deck._id} 
                deck={deck} 
                onDelete={handleDeleteDeck} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DecksPage; 