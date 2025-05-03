// src/utils/bubble.js
export default function generateBubbleStyle(text) {
  const baseFontSize = 14;
  const length = text.length;
  const diameter = Math.min(
    200,
    Math.max(50, length * baseFontSize + 20)
    );

  // ランダム位置・アニメーション時間など
  const top = 20 + Math.random() * 60;
  const left = 10 + Math.random() * 80;
  const duration = 4 + Math.random() * 6;

  return {
    width: `${diameter}px`,
    height: `${diameter}px`,
    fontSize: `${baseFontSize}px`,
    top: `${top}%`,
    left: `${left}%`,
    animationDuration: `${duration}s`
  };
}
