import React from "react";
import ResponseBlock from "../ResponseBlock/ResponseBlock";
import CodeBlock from "../CodeBlock/CodeBlock";
import ChartBlock from "../ChartBlock/ChartBlock";
import "./ChatBox.css";

const ChatBox = ({ messages }) => {
  const extractChartCode = (htmlCode) => {
    console.log("Extracting code from:", htmlCode);
    // Extract the script content between <script> tags
    const scriptMatch = htmlCode.match(/<script>([\s\S]*?)<\/script>/);
    if (scriptMatch) {
      const extractedCode = scriptMatch[1].trim();
      console.log("Extracted code:", extractedCode);
      return extractedCode;
    }
    return null;
  };

  const parseMessage = (text) => {
    console.log("Parsing message:", text);
    try {
      // Try to parse the message as JSON
      const parsed = JSON.parse(text);
      console.log("Parsed JSON:", parsed);
      return {
        chartCode: extractChartCode(parsed.chartCode),
        explanation: parsed.explanation,
      };
    } catch (e) {
      console.log("Not JSON, trying HTML extraction");
      // If not JSON, try to separate HTML from text
      const htmlMatch = text.match(/<!DOCTYPE html>[\s\S]*?<\/html>/);
      if (htmlMatch) {
        const htmlPart = htmlMatch[0];
        const textPart = text.replace(htmlPart, "").trim();
        console.log("Found HTML part:", htmlPart);
        return {
          chartCode: extractChartCode(htmlPart),
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
        console.log("Final parsed result:", parsed);
        return (
          <div key={index} className={`chat-message ${msg.sender}-message`}>
            <div className="message-layout">
              <ResponseBlock explanation={parsed.explanation} />
              {parsed.chartCode && (
                <>
                  <CodeBlock code={parsed.chartCode} />
                  <ChartBlock code={parsed.chartCode} />
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatBox;
