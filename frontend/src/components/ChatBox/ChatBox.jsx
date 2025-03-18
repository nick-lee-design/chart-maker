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
      // If not JSON, try to separate HTML from text
      const htmlMatch = text.match(/<!DOCTYPE html>[\s\S]*?<\/html>/);
      if (htmlMatch) {
        const htmlPart = htmlMatch[0];
        const textPart = text.replace(htmlPart, "").trim();
        return {
          chartCode: htmlPart,
          explanation: textPart,
        };
      }
      // If no HTML found, return as regular text
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
            <div className="message-layout">
              <div className="explanation-section">
                <ReactMarkdown>{parsed.explanation}</ReactMarkdown>
              </div>
              {parsed.chartCode && (
                <div className="code-section">
                  <pre className="code-block">
                    <code>{parsed.chartCode}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatBox;
