import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "./ChartBlock.css";

const ChartBlock = ({ code }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (code && chartRef.current) {
      console.log("ChartBlock received code:", code);

      // Clear previous content and destroy existing chart
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      chartRef.current.innerHTML = "";

      // Create a canvas element for the chart
      const canvas = document.createElement("canvas");
      canvas.id = "myChart"; // Match the ID expected by the chart code
      chartRef.current.appendChild(canvas);

      // Execute the script
      try {
        // Create a new Function to execute the code in a clean scope
        // Only pass Chart as a parameter since ctx is declared in the code
        const executeCode = new Function("Chart", code);
        executeCode(Chart);
      } catch (error) {
        console.error("Error executing chart code:", error);
        console.error("Code that caused error:", code);
        // Display error message in the chart container
        chartRef.current.innerHTML = `<div style="color: red; padding: 10px;">Error rendering chart: ${error.message}</div>`;
      }

      // Cleanup function
      return () => {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
        if (chartRef.current) {
          chartRef.current.innerHTML = "";
        }
      };
    }
  }, [code]);

  return (
    <div className="chart-section">
      <div ref={chartRef} className="chart-container"></div>
    </div>
  );
};

export default ChartBlock;
