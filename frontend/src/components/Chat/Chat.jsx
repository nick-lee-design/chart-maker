import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./Chat.css";

const Chat = () => {
  const [userInput, setUserInput] = useState("");
  const [fileInput, setFileInput] = useState([]);
  const [messages, setMessages] = useState([]); // State to store messages

  const appendMessage = (text, sender) => {
    setMessages((prev) => [...prev, { text, sender }]);
  };

  const sendMessage = async () => {
    if (!userInput && fileInput.length === 0) {
      console.log("No input provided!");
      return;
    }

    appendMessage(userInput, "user"); // Display user message in chat

    const formData = {
      message: userInput,
      images: [],
    };

    // ✅ Process all selected images
    if (fileInput.length > 0) {
      const imagePromises = Array.from(fileInput).map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
        });
      });

      formData.images = await Promise.all(imagePromises); // ✅ Read all images asynchronously
    }

    await sendRequest(formData);
    setUserInput(""); // Reset input after sending
    setFileInput([]); // Reset file input
  };

  const sendRequest = async (formData) => {
    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      appendMessage(data.reply, "bot"); // Display bot's response in chat
    } catch (error) {
      console.error("Error:", error);
      appendMessage("Error connecting to server.", "bot");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box" id="chatBox">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}-message`}>
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <input
          type="file"
          onChange={(e) => setFileInput(e.target.files)}
          multiple
          accept="image/*"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
