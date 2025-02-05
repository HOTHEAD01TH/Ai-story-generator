import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    console.log('Attempting to generate story with prompt:', prompt);
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `Create a story about ${prompt}. Break it into 3-4 distinct parts, with each part separated by two newlines. Make each part descriptive enough to generate an image from.`
          }]
        }]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const generatedText = response.data.candidates[0].content.parts[0].text;
    res.json({ story: generatedText });
    
  } catch (error) {
    console.error('Story generation error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: "Story generation failed.", 
      details: error.response?.data || error.message 
    });
  }
});

export default router;
