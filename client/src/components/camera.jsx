import React, { useEffect, useRef, useState } from 'react';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import Questions from './Questions.jsx'; // Import Questions component
import '@tensorflow/tfjs-backend-webgl';
import eraser from '../assets/eraser.jpeg';

const App = () => {
  const videoRef = useRef(null);
  const detectorRef = useRef(null);
  const canvasRef = useRef(null);

  const [question, setQuestion] = useState("What is your favorite color?"); // State to manage question

  let previousPoint = null;

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1400, height: 800 },
        });
        videoRef.current.srcObject = stream;

        const model = handPoseDetection.SupportedModels.MediaPipeHands;
        const detectorConfig = {
          runtime: 'mediapipe',
          solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
          modelType: 'full',
        };
        const detector = await handPoseDetection.createDetector(model, detectorConfig);
        detectorRef.current = detector;

        detectHands(); // Start hand detection loop
      } catch (err) {
        console.error('Error accessing the camera:', err);
      }
    };

    startCamera();
  }, []);

  const detectHands = async () => {
    const video = videoRef.current;
    const detector = detectorRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (detector && video.readyState === 4) {
      const hands = await detector.estimateHands(video, { flipHorizontal: true });

      if (hands.length > 0 && hands[0].keypoints) {
        const hand = hands[hands.length - 1];
        const middleFingerTip = hand.keypoints[12]; // Get middle finger tip

        const drawing = isDrawing(hand);
        const erasing = isErasing(hand);
        drawLine(ctx, middleFingerTip, drawing, erasing);
      }
    }

    requestAnimationFrame(detectHands);
  };

  
  
  const isDrawing = (hand) => {
    let distance = Math.abs(hand.keypoints[12].x - hand.keypoints[8].x);
    return distance < 35 && hand.keypoints[16].y > hand.keypoints[14].y;
  };

  const isErasing = (hand) => {
    let distance1 = Math.abs(hand.keypoints[12].x - hand.keypoints[8].x);
    let distance2 = Math.abs(hand.keypoints[16].x - hand.keypoints[12].x);
    return distance1 < 40 && distance2 < 35 && hand.keypoints[16].y < hand.keypoints[14].y;
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");
    console.log(image);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const drawLine = (ctx, point, drawing, erasing) => {
    if (!isNaN(point.x) && !isNaN(point.y)) {
      if (previousPoint) {
        if (erasing) {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.lineWidth = 60;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(previousPoint.x, previousPoint.y);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        } else if (drawing) {
          ctx.globalCompositeOperation = 'source-over';
          ctx.strokeStyle = 'red';
          ctx.lineWidth = 5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(previousPoint.x, previousPoint.y);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        }
      }
      previousPoint = { x: point.x, y: point.y };
    }
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      {/* Video and Canvas */}
      <div style={{ position: 'relative', width: '100%' }}>
        <video
          ref={videoRef}
          autoPlay
          style={{
            width: '100%',
            height: 'auto',
            transform: 'scaleX(-1)', // Mirror video
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none', // Only allow drawing
          }}
        />
      </div>

      {/* Questions Component */}
      <Questions canvasRef={canvasRef} />

      {/* Buttons */}
      <button onClick={saveCanvas} style={{ position: 'absolute', top: '30px', left: '400px', zIndex: 9999 }}>SAVE</button>
      <button onClick={clearCanvas} style={{
          position: 'fixed',  // Keep the button stuck to the bottom of the viewport
          top: '0',        // Align at the bottom
          left: '295px',          // Align to the left side
          zIndex: 9999,       // Make sure it's above other elements
          backgroundColor: '#000',  // Example background color
          color: 'white',     // White text for contrast
          textAlign: 'center',
          padding: '10px 20px', // Padding to make the button look good
          fontSize: '18px',   // Adjust font size for readability
          fontWeight: 'bold',
          margin: '0',
          border: 'none',     // Remove default button borders
          borderRadius: '5px', // Optional: round the button corners
          cursor: 'pointer',
        }} >CLEAR</button>
    </div>
  );
};

export default App;
