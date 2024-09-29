import React from 'react';

const Questions = ({ canvasRef }) => {
    const saveCanvas = () => {
        const canvas = canvasRef.current;
        const image = canvas.toDataURL("image/png");
        console.log(image);
      };
    
  return (
    <div>
    <h1
      style={{
        position: 'absolute',
        bottom: '0',
        width: '100%',
        zIndex: 9999, // Ensure it's on top
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent background
        color: 'white', // White text for contrast
        textAlign: 'center', // Center the text
        padding: '20px', // Padding for spacing
        fontSize: '24px', // Adjust font size
        fontWeight: 'bold', // Bold text
        margin: '0', // Remove default margin
      }}
    >
      QUESTIOSNTOENTSNTNSEOTNSITEOTN
    </h1>
    
     <button style={{
        position: 'absolute',
        bottom: '0',
        width: '10%',
        zIndex: 9999,
        color: 'white', // White text for contrast
        textAlign: 'left', // Center the text
        padding: '20px', // Padding for spacing
        fontSize: '24px', // Adjust font size
        fontWeight: 'bold', // Bold text
        margin: '0', }} onClick={saveCanvas}>
      CHECK
     </button>
    </div>
    
  );
};

export default Questions;
