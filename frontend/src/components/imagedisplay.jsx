import React from "react";

function ImageDisplay({ image }) {
    if (!image) return null;
  
    return (
      <div className="mt-6 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-2">AI Generated Illustration</h2>
        <img src={image} alt="Generated Scene" className="rounded-lg shadow-lg w-2/3" />
        <a href={image} download className="mt-4 bg-purple-500 px-4 py-2 rounded-lg hover:bg-purple-700 transition">
          Download Image
        </a>
      </div>
    );
  }
  
  export default ImageDisplay;
  