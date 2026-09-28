const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Test route
router.get("/", (req, res) => {
  res.json({
    message: "AI FAQ route is working"
  });
});

// Generate FAQ using Gemini
router.post("/generate-faq", authMiddleware, async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({
        message: "Topic is required"
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `Generate one FAQ about ${topic}.
Return a clear question and answer.
Format:
Question: ...
Answer: ...`
    });

    res.json({
      message: "FAQ generated successfully",
      topic,
      result: response.text
    });

  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      message: "Failed to generate FAQ"
    });
  }
});

module.exports = router;