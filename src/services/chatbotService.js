import axios from "axios";

const API_URL = "http://127.0.0.1:2704/api/ask";

const ChatbotService = {
  async getChatbotResponse(message) {
    try {
      // Gửi yêu cầu với đúng cấu trúc dữ liệu mà FastAPI mong đợi
      const response = await axios.post(API_URL, {
        question: message,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      throw error;
    }
  },
};

export default ChatbotService;
