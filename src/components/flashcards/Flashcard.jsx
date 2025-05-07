import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaSync, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Flashcard.css';

const Flashcard = ({ frontText, backText, hint, showButtons = false, onNext, onPrevious }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Custom gradient style
  const gradientStyle = {
    background: 'linear-gradient(135deg, #ff4e50 0%, #f9d423 100%)'
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flashcard-container">
        <div 
          className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}
          onClick={handleFlip}
        >
          {/* Front of card */}
          <div className="flashcard-face front">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">{frontText}</p>
              {hint && <p className="text-sm text-gray-500 mt-4 italic">{hint}</p>}
              <div className="mt-6 text-gray-400 text-sm">Click to flip</div>
            </div>
          </div>
          
          {/* Back of card */}
          <div className="flashcard-face back">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-medium mb-2 text-gray-900">{backText}</p>
              <div className="mt-6 text-gray-400 text-sm">Click to flip back</div>
            </div>
          </div>
        </div>
      </div>
      
      {showButtons && (
        <div className="flex justify-center gap-4 mt-8">
          {onPrevious && (
            <button 
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
                onPrevious();
              }}
            >
              <FaChevronLeft className="mr-2" /> Previous
            </button>
          )}
          
          <button 
            className="inline-flex items-center px-4 py-2 border border-orange-300 text-red-600 rounded-lg hover:bg-orange-50 transition"
            onClick={(e) => {
              e.stopPropagation();
              handleFlip();
            }}
          >
            <FaSync className="mr-2" /> Flip
          </button>
          
          {onNext && (
            <button 
              className="inline-flex items-center px-4 py-2 text-white rounded-lg transition shadow-sm"
              style={gradientStyle}
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
                onNext();
              }}
            >
              Next <FaChevronRight className="ml-2" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

Flashcard.propTypes = {
  frontText: PropTypes.string.isRequired,
  backText: PropTypes.string.isRequired,
  hint: PropTypes.string,
  showButtons: PropTypes.bool,
  onNext: PropTypes.func,
  onPrevious: PropTypes.func
};

export default Flashcard; 