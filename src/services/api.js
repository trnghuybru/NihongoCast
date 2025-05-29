import axios from "axios";

const API_URL = "/api";
const API_URL_TEST = "/api";
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
const api2 = axios.create({
  baseURL: API_URL_TEST,
  headers: {
    "Content-Type": "application/json",
  },
});
// Thêm token vào request header
api2.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// Handle API errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response);
    return Promise.reject(error);
  }
);

// Deck endpoints
export const deckApi = {
  // Get all decks
  getAllDecks: async () => {
    const response = await api.get("/decks");
    return response.data;
  },

  // Get a specific deck by ID
  getDeck: async (deckId) => {
    const response = await api.get(`/decks/${deckId}`);
    return response.data;
  },

  // Create a new deck
  createDeck: async (deckData) => {
    const response = await api.post("/decks", deckData);
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
    const response = await api.put(
      `/decks/${deckId}/cards/${cardId}`,
      cardData
    );
    return response.data;
  },

  // Delete a card
  deleteCard: async (deckId, cardId) => {
    const response = await api.delete(`/decks/${deckId}/cards/${cardId}`);
    return response.data;
  },
};
export const testService = {
  // Get all tests
  getAllTests: async () => {
    const response = await api2.get("/tests");
    return response.data;
  },

  // Get a single test
  getTest: async (id) => {
    console.log("Fetching test with ID:", id);
    const response = await api2.get(`/tests/${id}`);
    return response.data;
  },

  // Create a manual test
  createManualTest: async (test) => {
    const response = await api2.post("/tests/manual", test);
    return response.data;
  },

  // Create an AI-generated test
  createAITest: async (data) => {
    const response = await api2.post("/tests/ai", data);
    return response.data;
  },

  // Update a test
  updateTest: async (id, test) => {
    const response = await api2.put(`/tests/${id}`, test);
    return response.data;
  },

  // Delete a test
  deleteTest: async (id) => {
    const response = await api2.delete(`/tests/${id}`);
    return response.data;
  },

  // Publish a test
  publishTest: async (id) => {
    const response = await api2.post(`/tests/${id}/publish`);
    return response.data;
  },

  // Start a test
  startTest: async (id) => {
    const token = localStorage.getItem("accessToken");
    const response = await api2.post(
      `/tests/${id}/start`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  // Submit test results
  submitTestResult: async (resultId, answers) => {
    const response = await api2.post(`/test-results/${resultId}/submit`, {
      answers,
    });
    return response.data;
  },

  // Get test results for a user
  getUserTestResults: async (userId) => {
    const response = await api2.get(`/users/${userId}/test-results`);
    return response.data;
  },

  // Get test results for a test
  getTestResults: async (testId) => {
    const response = await api2.get(`/tests/${testId}/results`);
    return response.data;
  },
};

export default api;
