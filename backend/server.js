require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = 3000;

// Configure file storage
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// API Route to handle messages and file uploads
app.post("/chat", upload.array("images", 5), async (req, res) => {
  const userMessage = req.body.message;

  // Get uploaded image URLs
  const imageUrls = req.files.map(
    (file) => `http://localhost:3000/uploads/${file.filename}`
  );

  try {
    // Send only text to OpenAI
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extract AI response
    const reply =
      response.data.choices?.[0]?.message?.content || "No response from AI";

    // Send AI response + image URLs back to frontend
    res.json({ reply, imageUrls });
  } catch (error) {
    console.error(
      "Error communicating with OpenAI:",
      error.response?.data || error.message
    );
    res.status(500).json({ reply: "Error connecting to ChatGPT.", imageUrls });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
