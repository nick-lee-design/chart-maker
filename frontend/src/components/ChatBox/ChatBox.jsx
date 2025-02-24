import React from "react";
import ReactMarkdown from "react-markdown";
import "./ChatBox.css";

const ChatBox = ({ messages }) => {
  return (
    <div className="chat-box" id="chatBox">
      {messages.map((msg, index) => (
        <div key={index} className={`chat-message ${msg.sender}-message`}>
          <ReactMarkdown>{msg.text}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
