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
    return "¡Puedo ayudarte a crear imágenes increíbles! Prueba prompts como 'un atardecer sobre montañas en estilo acuarela' o pregúntame sobre diferentes estilos artísticos.";
  } else if (path.includes('/upload')) {
    return "¡Sube tus imágenes aquí y te ayudaré a mejorarlas! Puedo sugerir las mejores opciones de mejora para tus fotos.";
  } else if (path.includes('/recognize')) {
    return "¡Puedo analizar tus imágenes y decirte qué hay en ellas! Sube una imagen y identificaré objetos, escenas y más.";
  } else if (path.includes('/extract')) {
    return "¡Puedo extraer texto de tus imágenes! Sube documentos, capturas de pantalla o fotos con texto y las convertiré a texto editable.";
  } else if (path.includes('/gallery')) {
    return "¡Aquí está tu galería personal! Puedo ayudarte a organizar, buscar y gestionar todas tus imágenes.";
  } else {
    return "¡Bienvenido a AI Image Studio Pro! Estoy aquí para ayudarte con generación de imágenes, mejora, reconocimiento y extracción de texto. ¿Qué te gustaría hacer?";
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
