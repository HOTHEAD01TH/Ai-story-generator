import React, { useState } from "react";
import axios from "axios";

function StoryForm({ addStoryPart, setCurrentPart }) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const generateImage = async (description, retryCount = 0) => {
    try {
      const imageRes = await axios.post("http://localhost:5000/api/image", {
        description: description.substring(0, 700)
      });
      return imageRes.data.image_url;
    } catch (err) {
      if (err.response?.data?.retry && retryCount < 3) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, err.response.data.retryAfter || 5000));
        return generateImage(description, retryCount + 1);
      }
      throw err;
    }
  };

  const generateStory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setProgress(0);
      
      // First, get the story
      const res = await axios.post("http://localhost:5000/api/story", { prompt });
      
      // Clean and process the story parts
      const rawParts = res.data.story.split('\n\n');
      const storyParts = rawParts
        .map(part => part.trim())
        .filter(part => part.length > 0)
        .map(part => part.replace(/^\*\*.*?\*\*\s*/, '').trim())
        .filter(part => part.length > 0);

      // Generate each part with its image sequentially
      for (let i = 0; i < storyParts.length; i++) {
        const part = storyParts[i];
        setProgress((i + 1) / storyParts.length * 100);
        
        // Add the story part first without image
        addStoryPart(part, null);
        setCurrentPart(i); // Show the current part being processed
        
        try {
          // Generate image with retry logic
          const imageUrl = await generateImage(part);
          
          // Update the part with the image
          addStoryPart(part, imageUrl, i);
          
          // Small delay before moving to next part
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (imageErr) {
          console.error('Image generation failed for part:', part, imageErr);
          // Keep the story part without an image
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate story');
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="text-center w-full max-w-3xl">
      <input
        type="text"
        placeholder="Enter your story idea..."
        className="p-2 rounded bg-gray-800 border border-gray-600 text-white w-3/4"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button 
        onClick={generateStory} 
        disabled={isLoading}
        className={`ml-4 px-4 py-2 rounded ${
          isLoading ? 'bg-blue-300' : 'bg-blue-500'
        }`}
      >
        {isLoading ? `Generating (${Math.round(progress)}%)` : 'Generate'}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {isLoading && progress > 0 && (
        <div className="mt-4">
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StoryForm;
