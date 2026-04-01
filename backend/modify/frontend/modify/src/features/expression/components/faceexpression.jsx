import React, { useEffect, useRef, useState } from "react";
import { Camera } from "@mediapipe/camera_utils";

import {
  detectMood,
  drawLandmarks
} from "../utils/utils";

const FaceExpression = () => {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);

  const [mood, setMood] = useState("Detecting...");
  const [cameraOn, setCameraOn] = useState(false);

  useEffect(() => {

    if (!window.FaceMesh) return;

    const handleResults = (results) => {

      if (!results.multiFaceLandmarks) return;

      const landmarks = results.multiFaceLandmarks[0];

      const detectedMood = detectMood(landmarks);
      setMood(detectedMood);

      const ctx = canvasRef.current.getContext("2d");

      ctx.clearRect(0, 0, 640, 480);
      ctx.drawImage(results.image, 0, 0, 640, 480);

      drawLandmarks(ctx, landmarks);
    };

    const faceMesh = new window.FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      selfieMode: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(handleResults);

    if (cameraOn) {

      cameraRef.current = new Camera(videoRef.current, {
        onFrame: async () => {
          await faceMesh.send({ image: videoRef.current });
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

  }, [cameraOn]);

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

    </div>
  );
};

export default FaceExpression;