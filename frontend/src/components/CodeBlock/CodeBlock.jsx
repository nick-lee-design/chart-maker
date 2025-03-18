import React from "react";
import "./CodeBlock.css";

const CodeBlock = ({ code }) => {
  return (
    <div className="code-section">
      <pre className="code-block">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
