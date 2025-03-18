require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json({ limit: "100mb" }));

// Ensure uploads directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// File upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Read the CSV file content
  const fileContent = fs.readFileSync(req.file.path, "utf-8");
  res.json({
    filename: req.file.filename,
    content: fileContent,
  });
});

// API Route to communicate with ChatGPT
app.post("/chat", async (req, res) => {
  const defaultMessage = `
You are a data visualization expert. Analyze the CSV data and create a chart based on the user's requirements. 
Return a JavaScript code snippet that uses Chart.js to create the visualization. The code should be ready to run in a browser.
Important notes
id of the chart is myChart when you create the chart
Labels must not have more than 25 characters in one line, forEach label if there is more than 25 characters, trim to next line, this ensures text is never displayed diagonally or overlapping.


`;
  const userMessage = req.body.message
    ? `${defaultMessage} ${req.body.message}`
    : defaultMessage;
  const images = req.body.images || [];
  const csvData = req.body.csvData || [];

  console.log("Received user message:", userMessage);
  console.log("Received images count:", images.length);
  console.log("Received CSV data count:", csvData.length);

  // Structure message correctly to send multiple images and CSV data
  let messages = [
    {
      role: "user",
      content: [{ type: "text", text: userMessage }],
    },
  ];

  // Append each image as a separate entry in the content array
  images.forEach((image) => {
    if (image.startsWith("data:image/")) {
      messages[0].content.push({
        type: "image_url",
        image_url: { url: image },
      });
    }
  });

  // Append CSV data as text
  csvData.forEach((csv) => {
    messages[0].content.push({
      type: "text",
      text: `CSV Data:\n${csv}`,
    });
  });

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: messages,
        max_tokens: 5000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("OpenAI API Response:", response.data);

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error(
      "Error communicating with OpenAI:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ reply: "Error connecting to ChatGPT." });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
