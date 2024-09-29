import React, { useEffect, useRef, useState } from 'react';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import eraser from '../assets/eraser.jpeg';

const App = () => {
  const videoRef = useRef(null);
  const detectorRef = useRef(null);
  const canvasRef = useRef(null);
  const eraserRef = useRef(null); // Ref for eraser image

  let previousPoint = null; // Track the previous point for continuous drawing

  // Debug log for when erasing state changes
  

  useEffect(() => {
    const startCamera = async () => {
      try {
        // Start video stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1400, height: 800 },
        });
        videoRef.current.srcObject = stream;

        // Load the hand detector model with MediaPipe runtime
        const model = handPoseDetection.SupportedModels.MediaPipeHands;
        const detectorConfig = {
          runtime: 'mediapipe', // Use mediapipe runtime for better performance
          solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands', // Load MediaPipe WASM
          modelType: 'full', // Use 'full' for accuracy or 'lite' for performance
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

  // Detect hands and update drawing
  const detectHands = async () => {
    const video = videoRef.current;
    const detector = detectorRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Ensure the canvas and video dimensions are the same
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
    
    ctx.setTransform(1, 0, 0, 1, 0, 0); 
    if (detector && video.readyState === 4) {
      const hands = await detector.estimateHands(video, {
        flipHorizontal: true,
      });

      if (hands.length > 0 && hands[0].keypoints) {
        const hand = hands[hands.length - 1];
        const middleFingerTip = hand.keypoints[12]; // Get the middle finger tip

        // Only turn on erasing mode if you hover over the eraser (don't reset to false)
        // checkErasing(middleFingerTip);

        console.log(hand)

        // Detect if the hand is curled
        const drawing = isDrawing(hand); 
        console.log("Drawing: " + drawing+ " " + hand)


        const erasing = isErasing(hand);
        console.log("Erasing: " + erasing+ " " + hand)


        // Draw or erase depending on the current state
        drawLine(ctx, middleFingerTip, drawing, erasing);
      }
    }

    // Request the next frame to continue hand detection
    requestAnimationFrame(detectHands);
  };

  const isDrawing = (hand) => {
    let distance = Math.abs(hand.keypoints[12].x - hand.keypoints[8].x);
    
    return (distance < 35) && (hand.keypoints[16].y > hand.keypoints[14].y);
  };
  
  const isErasing = (hand) => {
    let distance1 = Math.abs(hand.keypoints[12].x - hand.keypoints[8].x);
    let distance2 = Math.abs(hand.keypoints[16].x - hand.keypoints[12].x)
    return distance1 < 40 && distance2 < 35 && (hand.keypoints[16].y < hand.keypoints[14].y)

  }


  // // Check if middle finger is over the eraser (Only set to true, no reset to false)
  // const checkErasing = (middleFingerTip) => {
  //   const eraserElement = eraserRef.current;
  //   if (eraserElement) {
  //     const rect = eraserElement.getBoundingClientRect();
  //     const fingerX = middleFingerTip.x;
  //     const fingerY = middleFingerTip.y;

  //     // If the finger is over the eraser, permanently switch to erasing mode
  //     if (fingerX >= rect.left && fingerX <= rect.right && fingerY >= rect.top && fingerY <= rect.bottom) {
  //      return true
  //     }
  //     else {
  //       return false
  //     }
  //   }
  // };

  const saveCanvas = () => {
    const canvas = canvasRef.current
    const image = canvas.toDataURL("image/png")
    console.log(image)

  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  const drawLine = (ctx, point, drawing, erasing) => {
    if (!isNaN(point.x) && !isNaN(point.y)) {
      if (previousPoint) {
        // console.log("erasing:", erasing, "drawing: ", drawing)
        if (erasing) {
          console.log("ERASING MODE ACTIVE");
          ctx.globalCompositeOperation = 'destination-out'; // Erasing mode
          ctx.lineWidth = 60; // Larger eraser size
          ctx.lineCap = 'round'; // Make the ends of the lines smooth for both drawing and erasing
          ctx.beginPath();
          ctx.moveTo(previousPoint.x, previousPoint.y); // Move to the previous point
          ctx.lineTo(point.x, point.y); // Draw or erase a line to the current point
          ctx.stroke();
        } else if(drawing) {
          console.log("Drawing mode");
          ctx.globalCompositeOperation = 'source-over'; // Drawing mode
          ctx.strokeStyle = 'red'; // Set the stroke color
          ctx.lineWidth = 5; // Set the line thickness
          ctx.lineCap = 'round'; // Make the ends of the lines smooth for both drawing and erasing
          ctx.beginPath();
          ctx.moveTo(previousPoint.x, previousPoint.y); // Move to the previous point
          ctx.lineTo(point.x, point.y); // Draw or erase a line to the current point
          ctx.stroke();
        }
        
      }

      // Update the previous point to the current fingertip's position
      previousPoint = {
        x: point.x,
        y: point.y
      };
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {/* Wrapper to center both the video and canvas */}
      <div style={{ position: 'relative' }}>
        {/* Video feed */}
        <video
          ref={videoRef}
          autoPlay
          style={{
            width: '100%',
            height: 'auto',
            transform: 'scaleX(-1)', // Mirror the video feed
          }}
        />

        {/* Canvas for drawing */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none', // Ensure only drawing happens, not interaction
          }}
        />
      </div>

      {/* Buttons */}
      <button onClick={saveCanvas} style={{ position: 'absolute', top: '30px', left: '400px', zIndex: 9999 }}>SAVE</button>
      <button onClick={clearCanvas} style={{ position: 'absolute', top: '30px', left: '700px', zIndex: 9999 }}>CLEAR</button>
    </div>
  );
};

export default App;
