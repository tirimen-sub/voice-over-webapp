// src/utils/bubble.js
export default function generateBubbleStyle(text) {
  const baseFontSize   = 14;
  const diameter       = Math.min(200, Math.max(50, text.length * baseFontSize + 20));
  const leftPercent    = 10 + Math.random() * 80;
  const fallDuration   = 8 + Math.random() * 4;   // 8～12秒
  const swayDuration   = 2 + Math.random() * 2;   // 2～4秒
  const swayAmplitude  = 10 + Math.random() * 20; // 10～30px

  return {
    width:              `${diameter}px`,
    height:             `${diameter}px`,
    fontSize:           `${baseFontSize}px`,
    top:                `-200px`,              // スタート位置
    left:               `${leftPercent}%`,
    '--sway-amplitude': `${swayAmplitude}px`,
    /* 
      floatDown は top のアニメーション、
      sway は transform のアニメーション
    */
    animation: `
      floatDown ${fallDuration}s linear 0s 1 both,
      sway      ${swayDuration}s ease-in-out 0s infinite both
    `
  };
}