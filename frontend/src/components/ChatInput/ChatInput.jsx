import React, { useState } from "react";
import "./ChatInput.css";
import Button from "@mui/material/Button";

const ChatInput = ({ userInput, setUserInput, setFileInput, sendMessage }) => {
  const [fileCount, setFileCount] = useState(0);

  const handleFileChange = (e) => {
    const files = e.target.files;
    setFileInput(files);
    setFileCount(files.length);
  };

  return (
    <div className="chat-input-container">
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Type a message..."
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />

      {/* Hidden file input */}
      <input
        type="file"
        id="fileUpload"
        onChange={handleFileChange}
        multiple
        accept="image/*,.csv"
        hidden
      />

      {/* Upload Button with File Count */}
      <label htmlFor="fileUpload" className="upload-button">
        Upload Files {fileCount > 0 && `(${fileCount})`}
      </label>

      <button onClick={sendMessage}>Generate Report</button>
    </div>
  );
};

export default ChatInput;
