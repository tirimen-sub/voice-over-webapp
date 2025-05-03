// src/utils/bubble.js
export function generateBubbleStyle(text) {
  const baseFontSize = 14;
  const length = text.length;
  const diameter = Math.min(200, 20 + length * 2);
  const fontSize = Math.max(10, Math.min(18, baseFontSize + length * 0.2));

  // ランダム位置・アニメーション時間など
  const top = 20 + Math.random() * 60;
  const left = 10 + Math.random() * 80;
  const duration = 4 + Math.random() * 6;

  return {
    width: `${diameter}px`,
    height: `${diameter}px`,
    fontSize: `${fontSize}px`,
    top: `${top}%`,
    left: `${left}%`,
    animationDuration: `${duration}s`
  };
}
