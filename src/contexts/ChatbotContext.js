import React, { createContext, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ChatbotContext = createContext();

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

export const ChatbotProvider = ({ children }) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const location = useLocation();

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  const closeChatbot = () => {
    setIsChatbotOpen(false);
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, {
      ...message,
      id: Date.now(),
      timestamp: new Date().toISOString()
    }]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const getContextualHelp = () => {
    const path = location.pathname;
    
    if (path.includes('/generate')) {
      return "I can help you create amazing images! Try prompts like 'a sunset over mountains in watercolor style' or ask me about different art styles.";
    } else if (path.includes('/upload')) {
      return "Upload your images here and I'll help you enhance them! I can suggest the best enhancement options for your photos.";
    } else if (path.includes('/recognize')) {
      return "I can analyze your images and tell you what's in them! Upload an image and I'll identify objects, scenes, and more.";
    } else if (path.includes('/extract')) {
      return "I can extract text from your images! Upload documents, screenshots, or photos with text and I'll convert them to editable text.";
    } else if (path.includes('/gallery')) {
      return "Here's your personal gallery! I can help you organize, search, and manage all your images.";
    } else {
      return "Welcome to AI Image Studio Pro! I'm here to help you with image generation, enhancement, recognition, and text extraction. What would you like to do?";
    }
  };

  const value = {
    isChatbotOpen,
    messages,
    toggleChatbot,
    closeChatbot,
    addMessage,
    clearMessages,
    getContextualHelp
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};
