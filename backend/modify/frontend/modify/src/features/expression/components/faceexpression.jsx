import React, { useEffect, useRef, useState } from "react";
import { Camera } from "@mediapipe/camera_utils";

import {
  detectMood,
  drawLandmarks
} from "../utils/utils";

const FaceExpression = ({ onDetect }) => {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const faceMeshRef = useRef(null);

  const [mood, setMood] = useState("Click detect");
  const [cameraOn, setCameraOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastDetectedMood, setLastDetectedMood] = useState(null);

  useEffect(() => {
    if (!window.FaceMesh) return;

    const handleResults = (results) => {
      setLoading(false);

      const ctx = canvasRef.current.getContext("2d");

      // ✅ Clear canvas
      ctx.clearRect(0, 0, 640, 480);

      // ✅ FIX: Flip canvas (remove mirror effect)
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(results.image, -640, 0, 640, 480);

      if (!results.multiFaceLandmarks) {
        ctx.restore();
        setMood("No face detected");
        return;
      }

      const landmarks = results.multiFaceLandmarks[0];

      const detectedMood = detectMood(landmarks);
      setMood(detectedMood);

      // Send mood to parent only if it changed
      if (onDetect && detectedMood !== lastDetectedMood) {
        setLastDetectedMood(detectedMood);
        onDetect(detectedMood);
      }

      // Draw landmarks (still flipped correctly)
      drawLandmarks(ctx, landmarks);

      ctx.restore();
    };

    const faceMesh = new window.FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      selfieMode: true, // keep true for better tracking
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(handleResults);
    faceMeshRef.current = faceMesh;

    if (cameraOn) {
      cameraRef.current = new Camera(videoRef.current, {
        onFrame: async () => {
          const ctx = canvasRef.current.getContext("2d");

          // ✅ Live camera preview (fixed mirror)
          ctx.save();
          ctx.scale(-1, 1);
          ctx.drawImage(videoRef.current, -640, 0, 640, 480);
          ctx.restore();
        },
        width: 640,
        height: 480,
      });

      cameraRef.current.start();
    } else {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    }

    return () => {
      if (cameraRef.current) cameraRef.current.stop();
    };

  }, [cameraOn, onDetect]);

  // ✅ Detect button
  const handleDetect = async () => {
    if (!faceMeshRef.current || !videoRef.current) return;

    setLoading(true);
    setMood("Detecting...");

    await faceMeshRef.current.send({
      image: videoRef.current
    });

    // Note: onDetect will be called in handleResults
  };
  

  return (
    <div style={{ textAlign: "center" }}>

      <h2>AI Face Expression Detector</h2>

      <video ref={videoRef} playsInline style={{ display: "none" }} />

      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{
          border: "2px solid black",
          borderRadius: "10px"
        }}
      />

      <h1>{mood}</h1>

      {/* Camera Button */}
      <button
        onClick={() => setCameraOn(!cameraOn)}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          marginTop: "10px",
          cursor: "pointer"
        }}
      >
        {cameraOn ? "Stop Camera" : "Start Camera"}
      </button>

      <br />
      

      {/* Detect Button */}
      <button
        onClick={handleDetect}
        disabled={!cameraOn || loading}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          marginTop: "10px",
          cursor: !cameraOn ? "not-allowed" : "pointer",
          opacity: !cameraOn ? 0.5 : 1
        }}
      >
        {loading ? "Detecting..." : "Detect Mood"}
      </button>

    </div>
  );
};

export default FaceExpression;