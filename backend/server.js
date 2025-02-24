require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "100mb" })); // ✅ Allow large images in base64

// API Route to communicate with ChatGPT
app.post("/chat", async (req, res) => {
  const defaultMessage =
    "You are a market researcher. Analyse these images using semiotics and provide the emergent trends.";
  const userMessage = req.body.message
    ? `${defaultMessage} ${req.body.message}`
    : defaultMessage;
  const images = req.body.images || [];

  console.log("Received user message:", userMessage);
  console.log("Received images count:", images.length);

  // ✅ Structure message correctly to send multiple images
  let messages = [
    {
      role: "user",
      content: [{ type: "text", text: userMessage }],
    },
  ];

  // ✅ Append each image as a separate entry in the content array
  images.forEach((image) => {
    messages[0].content.push({
      type: "image_url",
      image_url: { url: image },
    });
  });

  //-----------------------------------
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o", // ✅ Updated to gpt-4o
        messages: messages,
        max_tokens: 500,
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
