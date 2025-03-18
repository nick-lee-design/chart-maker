import React from "react";
import ReactMarkdown from "react-markdown";
import "./ChatBox.css";

const ChatBox = ({ messages }) => {
  const extractChartCode = (htmlCode) => {
    // Extract the script content between <script> tags
    const scriptMatch = htmlCode.match(/<script>([\s\S]*?)<\/script>/);
    if (scriptMatch) {
      return scriptMatch[1].trim();
    }
    return null;
  };

  const parseMessage = (text) => {
    try {
      // Try to parse the message as JSON
      const parsed = JSON.parse(text);
      return {
        chartCode: extractChartCode(parsed.chartCode),
        explanation: parsed.explanation,
      };
    } catch (e) {
      // If not JSON, return as regular text
      return {
        chartCode: null,
        explanation: text,
      };
    }
  };

  return (
    <div className="chat-box" id="chatBox">
      {messages.map((msg, index) => {
        const parsed = parseMessage(msg.text);
        return (
          <div key={index} className={`chat-message ${msg.sender}-message`}>
            {parsed.chartCode && (
              <div className="code-section">
                <pre className="code-block">
                  <code>{parsed.chartCode}</code>
                </pre>
              </div>
            )}
            <div className="message-content">
              <ReactMarkdown>{parsed.explanation}</ReactMarkdown>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatBox;
