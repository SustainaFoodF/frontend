import React, { useState, useRef, useEffect } from 'react';
import { chatWithGemini } from '../services/gemini.service';


const GeminiChat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setInput('');

    const { response, error } = await chatWithGemini(input);

    setMessages(prev => [...prev, {
      text: error || response,
      isUser: false
    }]);
    setIsLoading(false);
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle" onClick={toggleChatbot} aria-label="Ouvrir/fermer chatbot">
        {isOpen ? '❌' : '💬'}
      </button>

      {isOpen && (
        <div className="chatbot-box">
          <div className="chatbot-header">SustainaBot 🌱</div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chatbot-message ${msg.isUser ? 'user' : 'bot'} gemini-message`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tape ton message..."
              aria-label="Saisir un message"
            />
            <button type="submit" disabled={isLoading} aria-label="Envoyer le message">
              {isLoading ? '...' : 'Envoyer'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GeminiChat;
