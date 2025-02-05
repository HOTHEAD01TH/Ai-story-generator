import React from "react";

function StoryDisplay({ storyParts, currentPart, setCurrentPart }) {
  const currentStoryPart = storyParts[currentPart];

  const goToNextPart = () => {
    if (currentPart < storyParts.length - 1) {
      setCurrentPart(currentPart + 1);
    }
  };

  const goToPreviousPart = () => {
    if (currentPart > 0) {
      setCurrentPart(currentPart - 1);
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-800 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={goToPreviousPart}
          disabled={currentPart === 0}
          className={`px-4 py-2 rounded ${
            currentPart === 0 ? 'bg-gray-500' : 'bg-blue-500'
          }`}
        >
          Previous
        </button>
        <span className="text-gray-400">
          Part {currentPart + 1} of {storyParts.length}
        </span>
        <button 
          onClick={goToNextPart}
          disabled={currentPart === storyParts.length - 1}
          className={`px-4 py-2 rounded ${
            currentPart === storyParts.length - 1 ? 'bg-gray-500' : 'bg-blue-500'
          }`}
        >
          Next
        </button>
      </div>
      
      <div className="text-center">
        <p className="mt-2 text-lg">{currentStoryPart.text}</p>
        {currentStoryPart.imageUrl && (
          <img 
            src={currentStoryPart.imageUrl} 
            alt={`Part ${currentPart + 1}`}
            className="mt-4 rounded-lg mx-auto max-w-2xl"
          />
        )}
      </div>
    </div>
  );
}

export default StoryDisplay;
