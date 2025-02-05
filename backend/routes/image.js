import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Description is required" });
  }

  try {
    console.log('Attempting to generate image with description:', description);
    
    // Clean and truncate the description
    const cleanDescription = description
      .replace(/[^\w\s,.!?-]/g, '') // Remove special characters
      .substring(0, 500); // Limit to 500 characters

    // First, create the image generation request
    const createResponse = await axios.post(
      'https://api.starryai.com/creations/',
      {
        prompt: cleanDescription,
        model: 'lyra',
        aspectRatio: 'square',
        highResolution: false,
        images: 1,
        steps: 20,
        initialImageMode: 'color',
        stylePreset: 'digital-art'
      },
      {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'X-API-Key': process.env.STARAI_API_KEY
        },
        timeout: 60000 // Increased timeout to 60 seconds
      }
    );

    if (!createResponse.data.id) {
      throw new Error('No creation ID received from API');
    }

    // Poll for the image status
    const imageUrl = await checkCreationStatus(createResponse.data.id);
    
    if (!imageUrl) {
      throw new Error('Failed to get image URL');
    }

    res.json({ image_url: imageUrl });
    
  } catch (error) {
    console.error('Image generation error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // Send a retry signal to the client
    res.status(500).json({ 
      error: "Image generation in progress", 
      details: error.message,
      retry: true,
      retryAfter: 5000 // Suggest retry after 5 seconds
    });
  }
});

async function checkCreationStatus(creationId) {
  const maxAttempts = 30; // Increased max attempts
  const delayMs = 3000; // Reduced delay between checks
  let lastStatus = '';
  
  const checkStatus = async (attempt) => {
    if (attempt >= maxAttempts) {
      throw new Error('Image generation still in progress');
    }

    try {
      const statusResponse = await axios.get(
        `https://api.starryai.com/creations/${creationId}`,
        {
          headers: {
            'accept': 'application/json',
            'X-API-Key': process.env.STARAI_API_KEY
          },
          timeout: 10000
        }
      );

      const currentStatus = statusResponse.data.status;
      if (currentStatus !== lastStatus) {
        console.log(`Status check attempt ${attempt + 1}: ${currentStatus}`);
        lastStatus = currentStatus;
      }

      if (currentStatus === 'completed' && statusResponse.data.images?.[0]?.url) {
        return statusResponse.data.images[0].url;
      }

      if (currentStatus === 'failed') {
        throw new Error('Image generation failed on API side');
      }

      await new Promise(resolve => setTimeout(resolve, delayMs));
      return checkStatus(attempt + 1);
    } catch (error) {
      if (attempt < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
        return checkStatus(attempt + 1);
      }
      throw error;
    }
  };

  return checkStatus(0);
}

export default router;
