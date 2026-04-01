// Face metrics
export const getFaceMetrics = (landmarks) => {

  const mouthWidth = Math.abs(landmarks[61].x - landmarks[291].x);
  const mouthHeight = Math.abs(landmarks[13].y - landmarks[14].y);

  const leftMouthCorner = landmarks[61].y;
  const rightMouthCorner = landmarks[291].y;
  const mouthCenter = landmarks[13].y;

  const eyebrowLeft = Math.abs(landmarks[159].y - landmarks[145].y);
  const eyebrowRight = Math.abs(landmarks[386].y - landmarks[374].y);

  return {
    mouthWidth,
    mouthHeight,
    leftMouthCorner,
    rightMouthCorner,
    mouthCenter,
    eyebrowLeft,
    eyebrowRight
  };
};



// Detect Mood
export const detectMood = (landmarks) => {

  const m = getFaceMetrics(landmarks);

  if (m.mouthWidth > 0.08 && m.mouthHeight > 0.025) {
    return "happy";
  }

  if (m.mouthHeight > 0.05) {
    return "surprised";
  }

  if (
    m.leftMouthCorner > m.mouthCenter &&
    m.rightMouthCorner > m.mouthCenter &&
    (m.eyebrowLeft > 0.004 || m.eyebrowRight > 0.004)
  ) {
    return "sad";
  }

  return "neutral";
};



// Draw landmarks
export const drawLandmarks = (ctx, landmarks) => {

  ctx.fillStyle = "lime";

  landmarks.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x * 640, point.y * 480, 2, 0, 2 * Math.PI);
    ctx.fill();
  });

};