import React, { useState, useRef, useEffect } from 'react';
import { useChatbot } from '../contexts/ChatbotContext';
import './Chatbot.css';

const CHAT_ENDPOINT = 'https://dqmj2hhndg.execute-api.us-west-2.amazonaws.com/dev/chat';

const Chatbot = () => {
  const { isChatbotOpen, closeChatbot, messages, addMessage, getContextualHelp } = useChatbot();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isChatbotOpen && messages.length === 0) {
      addMessage({ role: 'assistant', content: getContextualHelp() });
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChatbotOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input.trim() };
    addMessage(userMessage);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages.filter(m => m.role === 'user' || m.role === 'assistant'), userMessage]
  .map(m => ({ role: m.role, content: m.content }));
console.log('Sending to Claude:', JSON.stringify(history));
      const response = await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
  messages: history,
  systemPrompt: "You are an AI assistant integrated into AI Image Studio Pro. Always initiate the conversation in Spanish with a formal and polite introduction. Continue the interaction in Spanish unless the user initiates a language change. You help users with 4 specific features: 1) Generate Images - create images from text descriptions using Amazon Titan, 2) Image Recognition - analyze and identify objects in uploaded images using Amazon Rekognition, 3) Text Extraction OCR - extract text from images using Amazon Textract, 4) Gallery - view and manage all generated images. Always give specific, actionable help related to these features. Be concise and friendly. If asked about topics unrelated to AI Image Studio Pro or image processing, politely decline and redirect the user to the app features you can help with."
})
      });

      const data = await response.json();
      if (data.success) {
        addMessage({ role: 'assistant', content: data.message });
      } else {
        addMessage({ role: 'assistant', content: 'Sorry, I had an error. Please try again.' });
      }
    } catch (error) {
      addMessage({ role: 'assistant', content: 'Connection error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isChatbotOpen) return null;

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-title">
          <span>🤖</span>
          <span>AI Assistant</span>
        </div>
        <button className="chatbot-close" onClick={closeChatbot}>✕</button>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role}`}>
            <div className="message-bubble">{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-bubble typing">...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me anything..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}>
          ➤
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
