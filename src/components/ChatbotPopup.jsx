import React, { useState, useEffect, useRef } from "react";
import { Send, Paperclip, Book, Info, BookOpen } from "lucide-react";
import ChatbotService from "../services/chatbotService";

function ChatbotPopup({ subtitle, onClose }) {
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const popupRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (subtitle && subtitle.text) {
      setChatHistory([]);
      setChatMessage("");
      setLoading(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
      const initialQuestion = `Giải thích: "${subtitle.text}"`;
      handleInitialQuestion(initialQuestion);
    }
  }, [subtitle]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleInitialQuestion = async (question) => {
    const userMessage = {
      sender: "user",
      text: question,
      time: formatTime(new Date()),
    };
    setChatHistory([userMessage]);
    setLoading(true);
    try {
      const response = await ChatbotService.getChatbotResponse(question);
      if (response) {
        const botMessage = {
          sender: "bot",
          interaction: response.interaction || null,
          rawData: response.response || null,
          time: formatTime(new Date()),
        };
        setChatHistory((prevHistory) => [...prevHistory, botMessage]);
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      const errorMessage = {
        sender: "bot",
        text: "Đã xảy ra lỗi khi xử lý yêu cầu của bạn.",
        time: formatTime(new Date()),
      };
      setChatHistory((prevHistory) => [...prevHistory, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (chatMessage.trim()) {
      const userMessage = {
        sender: "user",
        text: chatMessage,
        time: formatTime(new Date()),
      };
      setChatHistory((prevHistory) => [...prevHistory, userMessage]);
      setChatMessage("");
      setLoading(true);
      try {
        const response = await ChatbotService.getChatbotResponse(chatMessage);
        if (response) {
          const botMessage = {
            sender: "bot",
            interaction: response.interaction || null,
            rawData: response.response || null,
            time: formatTime(new Date()),
          };
          setChatHistory((prevHistory) => [...prevHistory, botMessage]);
        }
      } catch (error) {
        console.error("Lỗi khi gửi tin nhắn:", error);
        const errorMessage = {
          sender: "bot",
          text: "Đã xảy ra lỗi khi xử lý yêu cầu của bạn.",
          time: formatTime(new Date()),
        };
        setChatHistory((prevHistory) => [...prevHistory, errorMessage]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const BotMessageContent = ({ data }) => {
    if (!data || data.text) {
      return (
        <p className="text-sm">{data?.text || "Không thể xử lý dữ liệu."}</p>
      );
    }
    const { interaction, rawData } = data;
    const { translation, vocabulary, grammar, notes } = rawData || {};
    return (
      <div className="space-y-3 text-sm">
        {interaction && (
          <div className="font-medium text-gray-800">{interaction}</div>
        )}
        {translation && (
          <div className="font-medium text-blue-800 bg-blue-50 p-3 rounded-md border border-blue-100">
            <span className="font-semibold">Bản dịch:</span>
            <br />
            {translation}
          </div>
        )}
        {vocabulary && vocabulary.length > 0 && (
          <div className="bg-white border border-gray-300 rounded-md overflow-hidden">
            <div className="bg-green-100 p-2 font-medium flex items-center border-b border-green-200 text-green-800">
              <Book size={16} className="mr-2" />
              <span>Từ vựng</span>
            </div>
            <div className="divide-y divide-gray-300">
              {vocabulary.map((item, index) => (
                <div key={index} className="p-2 hover:bg-gray-50">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-800">
                      {item.word}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {item.level}
                    </span>
                  </div>
                  <div className="mt-1 text-gray-600">
                    <span className="text-xs italic mr-2 text-gray-500">
                      {item.type}
                    </span>
                    {item.meaning}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {grammar && grammar.length > 0 && (
          <div className="bg-white border border-gray-300 rounded-md overflow-hidden">
            <div className="bg-purple-100 p-2 font-medium flex items-center border-b border-purple-200 text-purple-800">
              <BookOpen size={16} className="mr-2" />
              <span>Ngữ pháp</span>
            </div>
            <div className="divide-y divide-gray-300">
              {grammar.map((item, index) => (
                <div key={index} className="p-2 hover:bg-gray-50">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-800">
                      {item.pattern}
                    </span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {item.level}
                    </span>
                  </div>
                  <div className="mt-1 text-gray-600">{item.explanation}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {notes && (
          <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 flex">
            <Info
              size={16}
              className="text-yellow-600 mr-2 flex-shrink-0 mt-1"
            />
            <div className="text-yellow-800">{notes}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={popupRef}
      className="fixed bottom-20 right-10 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden w-96 z-50 flex flex-col"
      style={{ maxHeight: "80vh" }}
    >
      <div className="gradient-bg text-white p-3 flex justify-between items-center">
        <h3 className="font-medium text-sm">Trợ giảng Podcast</h3>
        <button
          className="text-white hover:text-gray-200 transition-colors"
          onClick={onClose}
        >
          ✖
        </button>
      </div>
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-3 bg-gray-50"
        style={{ minHeight: "300px", maxHeight: "calc(80vh - 110px)" }}
      >
        {chatHistory.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-400">
            <p>Đang tải...</p>
          </div>
        ) : (
          chatHistory.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              {message.sender === "bot" && (
                <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-2 flex-shrink-0">
                  AI
                </div>
              )}
              <div
                className={`${
                  message.sender === "user"
                    ? "bg-red-500 text-white p-3"
                    : "bg-white border border-gray-200 p-3"
                } rounded-lg shadow-sm max-w-[80%]`}
              >
                {message.sender === "user" ? (
                  <>
                    <p className="text-sm">{message.text}</p>
                    <span className="text-xs text-blue-100 mt-1 block">
                      {message.time}
                    </span>
                  </>
                ) : (
                  <>
                    <BotMessageContent data={message} />
                    <span className="text-xs text-gray-500 mt-2 block">
                      {message.time}
                    </span>
                  </>
                )}
              </div>
              {message.sender === "user" && (
                <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-white ml-2 flex-shrink-0">
                  <span className="text-xs">Bạn</span>
                </div>
              )}
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-2 flex-shrink-0">
              AI
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%] border border-gray-200">
              <div className="flex space-x-2">
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "600ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-gray-200 p-2 bg-white flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập câu hỏi..."
          className="flex-1 p-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 text-sm"
          disabled={loading}
        />
        <button
          className={`ml-2 text-white p-2 rounded-full flex items-center justify-center ${
            loading || !chatMessage.trim()
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 transition-colors"
          }`}
          onClick={handleSendMessage}
          disabled={loading || !chatMessage.trim()}
        >
          <Send size={16} />
        </button>
        <button
          className="ml-1 text-gray-500 p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
          disabled={loading}
        >
          <Paperclip size={16} />
        </button>
      </div>
    </div>
  );
}

export default ChatbotPopup;
