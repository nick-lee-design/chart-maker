import React, { useState } from 'react';
import axios from 'axios';
import './Chat.css';  // Correct path for the CSS file within the same directory

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    const formData = new FormData();
    formData.append('message', input);
    const files = document.getElementById("fileInput").files;
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const response = await axios.post('http://localhost:3000/chat', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Assuming the server responds with the message and any image URLs
      setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: response.data.reply }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: 'Error connecting to server.' }]);
    }
    setInput(''); // Clear input after sending
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <input id="fileInput" type="file" multiple accept="image/*" />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;