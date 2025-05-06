import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlay, FaEdit, FaClock, FaRegStickyNote } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const DeckCard = ({ deck, onDelete }) => {
  const { _id, name, description, cards = [], createdAt } = deck;
  
  const formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  const cardCount = Array.isArray(cards) ? cards.length : 0;

  // Custom gradient style
  const gradientStyle = {
    background: 'linear-gradient(135deg, #ff4e50 0%, #f9d423 100%)'
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition duration-300 flex flex-col h-full group">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-red-600 transition">{name}</h3>
          <div className="text-xs text-gray-500 flex items-center">
            <FaClock className="mr-1" /> {formattedDate}
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3 text-sm">{description}</p>
        
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-red-600">
            <FaRegStickyNote className="mr-1" /> {cardCount} {cardCount === 1 ? 'card' : 'cards'}
          </div>
        </div>
      </div>
      
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <Link 
            to={`/decks/${_id}/study`} 
            className="inline-flex items-center px-3 py-1.5 text-white text-sm rounded-md transition shadow-sm"
            style={gradientStyle}
          >
            <FaPlay className="mr-1 text-xs" /> Study
          </Link>
          <div className="flex space-x-2">
            <Link 
              to={`/decks/${_id}`} 
              className="inline-flex items-center p-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition"
            >
              <FaEdit className="w-3.5 h-3.5" />
            </Link>
            <button 
              className="inline-flex items-center p-1.5 border border-gray-300 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-md transition"
              onClick={(e) => {
                e.preventDefault();
                if (window.confirm('Are you sure you want to delete this deck?')) {
                  onDelete(_id);
                }
              }}
            >
              <FaTrash className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

DeckCard.propTypes = {
  deck: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    cards: PropTypes.array,
    createdAt: PropTypes.string.isRequired
  }).isRequired,
  onDelete: PropTypes.func.isRequired
};

export default DeckCard;