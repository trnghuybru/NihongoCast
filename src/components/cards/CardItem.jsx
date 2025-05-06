import React from 'react';
import PropTypes from 'prop-types';
import { FaEdit, FaTrash } from 'react-icons/fa';

const CardItem = ({ card, onEdit, onDelete }) => {
  const { _id, japanese, vietnamese } = card;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition overflow-hidden">
      <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-grow flex flex-col md:flex-row md:items-center gap-x-6 gap-y-2">
          <div className="min-w-[120px]">
            <h3 className="text-xl font-bold text-gray-900">{japanese}</h3>
          </div>
          <div className="text-gray-700">
            {vietnamese}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition"
            onClick={() => onEdit(card)}
            title="Edit card"
          >
            <FaEdit className="w-4 h-4" />
          </button>
          <button 
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this card?')) {
                onDelete(_id);
              }
            }}
            title="Delete card"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

CardItem.propTypes = {
  card: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    japanese: PropTypes.string.isRequired,
    vietnamese: PropTypes.string.isRequired
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default CardItem; 