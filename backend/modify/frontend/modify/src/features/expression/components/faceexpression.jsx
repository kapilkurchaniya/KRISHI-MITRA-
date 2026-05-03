import React, { useEffect, useRef, useState, useCallback } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { detectMood, drawLandmarks } from "../utils/utils";
import './FaceExpression.scss';
import '../shared/styles/global.scss';

const FaceExpression = ({ onDetect }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceMeshRef = useRef(null);
  const cameraRef = useRef(null);
  const [mood, setMood] = useState("neutral");
  const [cameraActive, setCameraActive] = useState(false);
  const [noFace, setNoFace] = useState(false);

  const handleCameraToggle = useCallback(() => {
    const active = !cameraActive;
    setCameraActive(active);
    setMood("neutral");
    setNoFace(false);
  }, [cameraActive]);

  const onResults = useCallback((results) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const video = videoRef.current;
    if (!video) return;

    // Clear canvas
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mirror draw video
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    if (results.multiFaceLandmarks && results.multiFaceLandmarks[0]) {
      const landmarks = results.multiFaceLandmarks[0];
      const detectedMood = detectMood(landmarks);
      setMood(detectedMood);
      setNoFace(false);
      
      if (onDetect) {
        onDetect(detectedMood);
      }
      
      // Draw landmarks
      drawLandmarks(ctx, landmarks, detectedMood);
    } else {
      setNoFace(true);
      setMood('neutral');
    }

    ctx.restore();
  }, [onDetect]);

  useEffect(() => {
    if (!cameraActive) {
      // Cleanup
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }
      if (faceMeshRef.current) {
        faceMeshRef.current.close();
        faceMeshRef.current = null;
      }
      return;
    }

    // Wait for FaceMesh to load
    const loadFaceMesh = async () => {
      if (!window.FaceMesh) {
        setTimeout(loadFaceMesh, 100);
        return;
      }

      // Initialize once
      const faceMesh = new window.FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        selfieMode: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      faceMesh.onResults(onResults);
      faceMeshRef.current = faceMesh;
      
      // Start camera after init
      startCamera();
    };

    const startCamera = () => {
      navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480, facingMode: 'user' } 
      }).then(stream => {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          const canvas = canvasRef.current;
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          
          // Camera with continuous frame sending
          const camera = new Camera(videoRef.current, {
            onFrame: () => {
              if (faceMeshRef.current && videoRef.current.readyState === 4) {
                faceMeshRef.current.send({ image: videoRef.current });
              }
            }
          });
          camera.start();
          cameraRef.current = camera;
        };
      }).catch(err => {
        console.error('Camera error:', err);
        setCameraActive(false);
      });
    };

    loadFaceMesh();

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (faceMeshRef.current) {
        faceMeshRef.current.close();
      }
    };
  }, [cameraActive, onResults]);

  return (
    <div className="face-detector">
      <div className="detector-header">
        <div className="fox-mood-display">
          🦊 
          <span className={`mood-display ${mood}`}>
            {noFace ? 'No face detected' : mood.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="camera-container">
        <video ref={videoRef} playsInline className="hidden" />
        <canvas ref={canvasRef} className="camera-canvas" />
        {noFace && <div className="no-face">👀 Looking for face...</div>}
      </div>

      <div className="control-buttons">
        <button 
          className={`btn-camera ${cameraActive ? 'active' : ''}`}
          onClick={handleCameraToggle}
        >
          {cameraActive ? '🛑 Stop Camera' : '🎭 Start Detection'}
        </button>
      </div>
    </div>
  );
};

export default FaceExpression;

