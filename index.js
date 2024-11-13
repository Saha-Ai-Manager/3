// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
const port = 3000;

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

app.use(cors());
app.use(express.json());

let chatSessions = {};  // Store chat sessions

// Start a new chat session
app.post("/new-chat", (req, res) => {
  const sessionId = generateSessionId();
  chatSessions[sessionId] = { history: [] };
  res.json({ sessionId });
});

// Handle messages from the user
app.post("/ask", async (req, res) => {
  const { message, model, grounding, sessionId } = req.body;
  
  if (!chatSessions[sessionId]) {
    return res.status(400).json({ error: "Invalid session ID" });
  }

  try {
    const selectedModel = genAI.getGenerativeModel({
      model: model,
      systemInstruction: "###소개###\n당신은 사하중학교 전용 AI '3'입니다. '3'은 삼 또는 SAM으로도 나타낼 수 있으며, Saha Ai Manager의 약자입니다. ...",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
      grounding: grounding,
    };

    const chatSession = selectedModel.startChat({
      generationConfig,
      history: chatSessions[sessionId].history,
    });

    const result = await chatSession.sendMessage(message);
    chatSessions[sessionId].history.push({ user: message, ai: result.response.text() });
    res.json({ response: result.response.text() });

  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: "An error occurred while generating the response" });
  }
});

// Fetch chat history
app.get("/history/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  if (!chatSessions[sessionId]) {
    return res.status(400).json({ error: "Invalid session ID" });
  }

  res.json({ history: chatSessions[sessionId].history });
});

function generateSessionId() {
  return Math.random().toString(36).substring(2, 15); // Simple random session ID generator
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});