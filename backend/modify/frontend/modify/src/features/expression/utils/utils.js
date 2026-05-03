// Simplified stable mood detection
export const detectMood = (landmarks) => {
  if (!landmarks || landmarks.length === 0) return 'neutral';

  // Key points (normalized 0-1)
  const leftMouthCorner = landmarks[61];
  const rightMouthCorner = landmarks[291];
  const mouthTop = landmarks[13];
  const mouthBottom = landmarks[14];
  const leftEyeTop = landmarks[159];
  const leftEyeBottom = landmarks[145];
  const rightEyeTop = landmarks[386];
  const rightEyeBottom = landmarks[374];

  // Mouth curvature (smile/frown)
  const mouthCenterY = (leftMouthCorner.y + rightMouthCorner.y) / 2;
  const mouthHeightCenter = (mouthTop.y + mouthBottom.y) / 2;
  const curvature = mouthCenterY - mouthHeightCenter; // >0 smile, <0 frown

  // Mouth openness
  const mouthOpenness = mouthBottom.y - mouthTop.y;

  // Eye squint (smaller = squinted)
  const leftEyeOpen = leftEyeBottom.y - leftEyeTop.y;
  const rightEyeOpen = rightEyeBottom.y - rightEyeTop.y;
  const avgEyeOpen = (leftEyeOpen + rightEyeOpen) / 2;

  // Thresholds (tuned for reliability)
  if (curvature > 0.008) {
    return 'happy'; // Smile
  } else if (curvature < -0.008) {
    return 'sad'; // Frown
  } else if (mouthOpenness > 0.04) {
    return 'surprise'; // Open mouth
  } else if (avgEyeOpen < 0.025) {
    return 'angry'; // Squinted eyes
  }

  return 'neutral';
};

// Lightweight landmark drawing
export const drawLandmarks = (ctx, landmarks, mood) => {
  if (!landmarks) return;

  const colors = {
    happy: '#10B981',
    sad: '#3B82F6', 
    surprise: '#F59E0B',
    angry: '#EF4444',
    neutral: '#9CA3AF'
  };

  ctx.strokeStyle = colors[mood] || '#6B7280';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  // Face oval
  ctx.beginPath();
  ctx.arc(0.5, 0.5, 0.35, 0, Math.PI * 2);
  ctx.stroke();

  // Key points only (eyes, mouth, nose)
  const keyPoints = [33, 362, 1, 13, 14, 61, 291, 152];
  keyPoints.forEach(idx => {
    const pt = landmarks[idx];
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 0.015, 0, Math.PI * 2);
    ctx.fillStyle = colors[mood] + '80';
    ctx.fill();
    ctx.stroke();
  });
};

