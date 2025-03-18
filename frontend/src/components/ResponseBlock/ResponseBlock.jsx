import React from "react";
import ReactMarkdown from "react-markdown";
import "./ResponseBlock.css";

const ResponseBlock = ({ explanation }) => {
  return (
    <div className="explanation-section">
      <ReactMarkdown>{explanation}</ReactMarkdown>
    </div>
  );
};

export default ResponseBlock;
