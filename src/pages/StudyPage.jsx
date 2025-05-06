import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaTrophy, FaRedo, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Flashcard from '../components/flashcards/Flashcard';
import { deckApi } from '../services/api';

const StudyPage = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [studyStats, setStudyStats] = useState({
    totalCards: 0,
    studiedCards: 0
  });
  
  useEffect(() => {
    fetchDeck();
  }, [deckId]);
  
  const fetchDeck = async () => {
    try {
      setLoading(true);
      const data = await deckApi.getDeck(deckId);
      setDeck(data);
      
      if (data.cards && data.cards.length > 0) {
        setCards(data.cards);
        setStudyStats({
          totalCards: data.cards.length,
          studiedCards: 0
        });
      } else {
        setError('This deck has no cards to study. Add some cards first!');
      }
    } catch (err) {
      setError('Failed to load deck. Please try again later.');
      console.error('Error fetching deck:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setStudyStats(prev => ({
        ...prev,
        studiedCards: prev.studiedCards + 1
      }));
    } else {
      // Last card completed
      setCompleted(true);
      setStudyStats(prev => ({
        ...prev,
        studiedCards: prev.totalCards
      }));
    }
  };
  
  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setStudyStats(prev => ({
        ...prev,
        studiedCards: Math.max(0, prev.studiedCards - 1)
      }));
    }
  };
  
  const resetStudy = () => {
    setCurrentCardIndex(0);
    setCompleted(false);
    setStudyStats(prev => ({
      ...prev,
      studiedCards: 0
    }));
  };
  
  const progressPercentage = studyStats.totalCards > 0 
    ? Math.round((studyStats.studiedCards / studyStats.totalCards) * 100) 
    : 0;

  // Custom gradient style
  const gradientStyle = {
    background: 'linear-gradient(135deg, #ff4e50 0%, #f9d423 100%)'
  };

  const progressGradientStyle = {
    background: 'linear-gradient(to right, #ff4e50 0%, #f9d423 100%)',
    width: `${progressPercentage}%`
  };
  
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Link to="/decks" className="hover:text-red-600 transition">Decks</Link>
                <span className="mx-2">›</span>
                <span className="font-medium text-gray-900">Study Error</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Study Error</h1>
            </div>
            <Link 
              to="/decks" 
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <FaArrowLeft className="mr-2" /> Back to Decks
            </Link>
          </div>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
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
        </div>
      </div>
    );
  }
  
  if (completed) {
    return (
      <div className="bg-gray-50 min-h-screen pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Link to="/decks" className="hover:text-red-600 transition">Decks</Link>
                <span className="mx-2">›</span>
                <Link to={`/decks/${deckId}`} className="hover:text-red-600 transition">{deck.name}</Link>
                <span className="mx-2">›</span>
                <span className="font-medium text-gray-900">Study Completed</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Study Completed</h1>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 text-white rounded-full mb-6" style={gradientStyle}>
              <FaTrophy className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Congratulations!</h2>
            <p className="text-lg text-gray-600 mb-8">You've completed studying all cards in this deck.</p>
            
            <div className="flex justify-center gap-12 mb-10">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-1">{studyStats.totalCards}</div>
                <div className="text-sm text-gray-500">Total Cards</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-1">100%</div>
                <div className="text-sm text-gray-500">Completion</div>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                className="px-5 py-2.5 text-white rounded-lg shadow-md transition"
                style={gradientStyle}
                onClick={resetStudy}
              >
                Study Again
              </button>
              <Link 
                to={`/decks/${deckId}`} 
                className="px-5 py-2.5 border border-red-400 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                Return to Deck
              </Link>
              <Link 
                to="/decks" 
                className="px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition"
              >
                All Decks
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const currentCard = cards[currentCardIndex];
  
  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Link to="/decks" className="hover:text-red-600 transition">Decks</Link>
              <span className="mx-2">›</span>
              <Link to={`/decks/${deckId}`} className="hover:text-red-600 transition">{deck.name}</Link>
              <span className="mx-2">›</span>
              <span className="font-medium text-gray-900">Study</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Studying: {deck.name}</h1>
          </div>
          <Link 
            to={`/decks/${deckId}`} 
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <FaArrowLeft className="mr-2" /> Back to Deck
          </Link>
        </div>
        
        <div className="mb-8">
          <div className="bg-gray-200 h-3 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full"
              style={progressGradientStyle}
              aria-valuenow={progressPercentage}
              aria-valuemin="0" 
              aria-valuemax="100"
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <div>
              Card {currentCardIndex + 1} of {cards.length}
            </div>
            <div className="flex items-center">
              <FaCheck className="text-green-500 mr-1" /> {progressPercentage}% complete
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <Flashcard 
            frontText={currentCard.japanese}
            backText={currentCard.vietnamese}
            showButtons={true}
            onNext={handleNextCard}
            onPrevious={currentCardIndex > 0 ? handlePreviousCard : null}
          />
        </div>
        
        <div className="flex justify-center mt-6">
          <button 
            className="inline-flex items-center px-4 py-2 border border-orange-300 text-red-600 hover:bg-orange-50 rounded-lg transition"
            onClick={resetStudy}
          >
            <FaRedo className="mr-2" /> Reset Study
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyPage; 