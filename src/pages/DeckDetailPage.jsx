import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaPlay, FaPlus, FaArrowLeft, FaTrash, FaEdit, FaBoxOpen, FaFileImport } from 'react-icons/fa';
import { deckApi } from '../services/api';
import CardItem from '../components/cards/CardItem';

const DeckDetailPage = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('cards');
  
  // Form states for adding/editing cards
  const [showCardForm, setShowCardForm] = useState(false);
  const [showBulkImportForm, setShowBulkImportForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [formData, setFormData] = useState({
    japanese: '',
    vietnamese: ''
  });
  const [bulkImportText, setBulkImportText] = useState('');
  
  useEffect(() => {
    fetchDeck();
  }, [deckId]);
  
  const fetchDeck = async () => {
    try {
      setLoading(true);
      const data = await deckApi.getDeck(deckId);
      setDeck(data);
      setCards(data.cards || []);
      setError(null);
    } catch (err) {
      setError('Failed to load deck. Please try again later.');
      console.error('Error fetching deck:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteDeck = async () => {
    if (window.confirm('Are you sure you want to delete this deck? This action cannot be undone.')) {
      try {
        await deckApi.deleteDeck(deckId);
        navigate('/decks');
      } catch (err) {
        setError('Failed to delete deck. Please try again.');
        console.error('Error deleting deck:', err);
      }
    }
  };
  
  const handleDeleteCard = async (cardId) => {
    try {
      await deckApi.deleteCard(deckId, cardId);
      setCards(cards.filter(card => card._id !== cardId));
    } catch (err) {
      setError('Failed to delete card. Please try again.');
      console.error('Error deleting card:', err);
    }
  };
  
  const handleEditCard = (card) => {
    setEditingCard(card);
    setFormData({
      japanese: card.japanese,
      vietnamese: card.vietnamese
    });
    setShowCardForm(true);
    setShowBulkImportForm(false);
  };
  
  const handleAddNewCard = () => {
    setEditingCard(null);
    setFormData({
      japanese: '',
      vietnamese: ''
    });
    setShowCardForm(true);
    setShowBulkImportForm(false);
  };

  const handleBulkImport = () => {
    setShowCardForm(false);
    setShowBulkImportForm(true);
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleBulkTextChange = (e) => {
    setBulkImportText(e.target.value);
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCard) {
        // Update existing card
        await deckApi.updateCard(deckId, editingCard._id, formData);
        setCards(cards.map(card => 
          card._id === editingCard._id ? { ...card, ...formData } : card
        ));
      } else {
        // Add new card
        const newCard = await deckApi.addCard(deckId, formData);
        setCards([...cards, newCard]);
      }
      
      // Reset form
      setShowCardForm(false);
      setEditingCard(null);
      setFormData({
        japanese: '',
        vietnamese: ''
      });
    } catch (err) {
      setError(`Failed to ${editingCard ? 'update' : 'add'} card. Please try again.`);
      console.error(`Error ${editingCard ? 'updating' : 'adding'} card:`, err);
    }
  };

  const handleBulkImportSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Process bulk import text (format: "japanese \ vietnamese")
      const lines = bulkImportText.split('\n').filter(line => line.trim() !== '');
      
      const newCards = [];
      
      for (const line of lines) {
        if (line.includes('\\')) {
          const [japanese, vietnamese] = line.split('\\').map(part => part.trim());
          
          if (japanese && vietnamese) {
            // Add card to API
            const newCard = await deckApi.addCard(deckId, { japanese, vietnamese });
            newCards.push(newCard);
          }
        }
      }
      
      // Update the card list with new cards
      setCards([...cards, ...newCards]);
      
      // Reset form
      setShowBulkImportForm(false);
      setBulkImportText('');
      
      if (newCards.length > 0) {
        // Show success message
        alert(`Successfully imported ${newCards.length} cards.`);
      } else {
        alert('No valid cards found to import. Please use the format "japanese \\ vietnamese" with one card per line.');
      }
    } catch (err) {
      setError(`Failed to import cards. Please try again.`);
      console.error(`Error importing cards:`, err);
    }
  };

  // Custom gradient style
  const gradientStyle = {
    background: 'linear-gradient(135deg, #ff4e50 0%, #f9d423 100%)'
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
          <Link 
            to="/decks" 
            className="inline-flex items-center text-red-600 hover:text-red-800 font-medium"
          >
            <FaArrowLeft className="mr-2" /> Back to Decks
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Link to="/decks" className="hover:text-red-600 transition">Decks</Link>
            <span className="mx-2">›</span>
            <span className="font-medium text-gray-900">{deck.name}</span>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{deck.name}</h1>
              <div className="flex items-center text-gray-500 mb-3">
                <span className="inline-flex items-center bg-orange-100 text-red-600 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">
                  {cards.length} cards
                </span>
              </div>
              <p className="text-gray-600 max-w-2xl">{deck.description}</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/decks/${deckId}/study`}
                className="inline-flex items-center px-5 py-2.5 text-white rounded-lg shadow-md transition duration-300"
                style={gradientStyle}
              >
                <FaPlay className="mr-2" /> Study Deck
              </Link>
              <button 
                className="inline-flex items-center px-5 py-2.5 bg-white border border-gray-300 text-red-600 hover:text-white hover:bg-red-600 hover:border-red-600 rounded-lg shadow-sm transition duration-300"
                onClick={handleDeleteDeck}
              >
                <FaTrash className="mr-2" /> Delete Deck
              </button>
            </div>
          </div>
        </div>
        
        <div className="mb-6 border-b border-gray-200">
          <div className="flex -mb-px">
            <button
              className={`px-6 py-3 font-medium text-sm border-b-2 ${
                activeTab === 'cards' 
                  ? 'border-red-600 text-red-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('cards')}
            >
              Cards
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm border-b-2 ${
                activeTab === 'settings' 
                  ? 'border-red-600 text-red-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>
        </div>
        
        <div className="tab-content">
          {activeTab === 'cards' && (
            <div className="cards-tab">
              <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
                <h2 className="text-xl font-semibold text-gray-800">Flashcards</h2>
                <div className="flex flex-wrap gap-3">
                  <button 
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-red-600 rounded-lg transition"
                    onClick={handleAddNewCard}
                  >
                    <FaPlus className="mr-2" /> Add Card
                  </button>
                  <button 
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-red-600 rounded-lg transition"
                    onClick={handleBulkImport}
                  >
                    <FaFileImport className="mr-2" /> Bulk Import
                  </button>
                </div>
              </div>
              
              {showCardForm && (
                <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {editingCard ? 'Edit Card' : 'Add New Card'}
                  </h3>
                  <form onSubmit={handleFormSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Japanese
                        </label>
                        <input
                          type="text"
                          name="japanese"
                          value={formData.japanese}
                          onChange={handleFormChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-orange-200 focus:border-red-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vietnamese
                        </label>
                        <input
                          type="text"
                          name="vietnamese"
                          value={formData.vietnamese}
                          onChange={handleFormChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-orange-200 focus:border-red-400"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg"
                        onClick={() => setShowCardForm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-white rounded-lg shadow-sm"
                        style={gradientStyle}
                      >
                        {editingCard ? 'Update Card' : 'Add Card'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {showBulkImportForm && (
                <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Bulk Import Cards
                  </h3>
                  <form onSubmit={handleBulkImportSubmit}>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Enter cards (one per line, format: "Japanese \ Vietnamese")
                      </label>
                      <textarea
                        value={bulkImportText}
                        onChange={handleBulkTextChange}
                        rows="8"
                        placeholder="ありがとう \ Cảm ơn&#10;おはよう \ Chào buổi sáng&#10;こんにちは \ Xin chào"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-orange-200 focus:border-red-400 font-mono"
                        required
                      ></textarea>
                      <p className="mt-2 text-sm text-gray-500">
                        Each line should contain one Japanese term and its Vietnamese translation, separated by a backslash (\).
                      </p>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg"
                        onClick={() => setShowBulkImportForm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-white rounded-lg shadow-sm"
                        style={gradientStyle}
                      >
                        Import Cards
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {cards.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
                  <div className="text-gray-400 mb-4">
                    <FaBoxOpen className="mx-auto h-12 w-12" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No cards in this deck</h3>
                  <p className="text-gray-600 mb-6">
                    Add some cards to start studying with this deck.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      className="inline-flex items-center px-4 py-2 text-white rounded-lg transition shadow-sm"
                      style={gradientStyle}
                      onClick={handleAddNewCard}
                    >
                      <FaPlus className="mr-2" /> Add Card
                    </button>
                    <button
                      className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-red-600 rounded-lg transition"
                      onClick={handleBulkImport}
                    >
                      <FaFileImport className="mr-2" /> Bulk Import
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {cards.map(card => (
                    <CardItem 
                      key={card._id} 
                      card={card} 
                      onEdit={() => handleEditCard(card)} 
                      onDelete={() => handleDeleteCard(card._id)} 
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="settings-tab">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Deck Settings</h2>
                
                <form>
                  <div className="mb-6">
                    <label htmlFor="deckName" className="block text-sm font-medium text-gray-700 mb-1">
                      Deck Name
                    </label>
                    <input
                      type="text"
                      id="deckName"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-orange-200 focus:border-red-400"
                      defaultValue={deck.name}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="deckDescription" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="deckDescription"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-orange-200 focus:border-red-400"
                      rows="4"
                      defaultValue={deck.description}
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-white rounded-lg shadow-sm transition"
                      style={gradientStyle}
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeckDetailPage; 