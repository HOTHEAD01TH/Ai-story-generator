import React, { useState } from "react"; // ✅ Import React
import StoryForm from "./components/storyform";
import StoryDisplay from "./components/storydisplay";
import ImageDisplay from "./components/imagedisplay";

function App() {
  const [storyParts, setStoryParts] = useState([]);
  const [currentPart, setCurrentPart] = useState(0);

  const addStoryPart = (text, imageUrl = null, index = null) => {
    setStoryParts(prev => {
      if (index !== null) {
        // Update existing part
        const newParts = [...prev];
        newParts[index] = { text, imageUrl };
        return newParts;
      } else {
        // Add new part
        return [...prev, { text, imageUrl }];
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-6">
        AI Story & Image Generator 🚀
      </h1>
      <StoryForm 
        addStoryPart={addStoryPart} 
        setCurrentPart={setCurrentPart}
      />
      {storyParts.length > 0 && (
        <div className="w-full max-w-3xl">
          <StoryDisplay 
            storyParts={storyParts}
            currentPart={currentPart}
            setCurrentPart={setCurrentPart}
          />
        </div>
      )}
    </div>
  );
}

export default App;
