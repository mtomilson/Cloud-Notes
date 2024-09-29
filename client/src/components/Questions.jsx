import React from 'react';

const Questions = ({ canvasRef }) => {
    const saveCanvas = () => {
        const canvas = canvasRef.current;
        const image = canvas.toDataURL("image/png");
        console.log(image);
    };

    return (
        <div className="relative">
            <h1 className="absolute bottom-0 w-full z-50 bg-black bg-opacity-80 text-white text-center p-5 text-2xl font-bold m-0">
                QUESTIOSNTOENTSNTNSEOTNSITEOTN
            </h1>
            <button 
                className="absolute bottom-0 left-0 z-50 text-white text-left p-5 text-2xl font-bold m-0 w-1/10"
                onClick={saveCanvas}
            >
                CHECK
            </button>
        </div>
    );
};

export default Questions;
