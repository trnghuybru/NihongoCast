import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Handle API errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response);
    return Promise.reject(error);
  }
);

// Deck endpoints
export const deckApi = {
  // Get all decks
  getAllDecks: async () => {
    const response = await api.get('/decks');
    return response.data;
  },
  
  // Get a specific deck by ID
  getDeck: async (deckId) => {
    const response = await api.get(`/decks/${deckId}`);
    return response.data;
  },
  
  // Create a new deck
  createDeck: async (deckData) => {
    const response = await api.post('/decks', deckData);
    return response.data;
  },
  
  // Delete a deck
  deleteDeck: async (deckId) => {
    const response = await api.delete(`/decks/${deckId}`);
    return response.data;
  },
  
  // Add a card to a deck
  addCard: async (deckId, cardData) => {
    const response = await api.post(`/decks/${deckId}/cards`, cardData);
    return response.data;
  },
  
  // Update a card
  updateCard: async (deckId, cardId, cardData) => {
    const response = await api.put(`/decks/${deckId}/cards/${cardId}`, cardData);
    return response.data;
  },
  
  // Delete a card
  deleteCard: async (deckId, cardId) => {
    const response = await api.delete(`/decks/${deckId}/cards/${cardId}`);
    return response.data;
  }
};

export default api; 