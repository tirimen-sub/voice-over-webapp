// src/utils/bubble.js
export default function generateBubbleStyle(text) {
  const baseFontSize = 14;
  const length       = text.length;
  const diameter     = Math.min(200, Math.max(50, length * baseFontSize + 20));

  // 画面幅に対する横位置 (10% ~ 90%)
  const leftPercent = 10 + Math.random() * 80;

  // 流れ落ちる時間 (秒)
  const fallDuration = 8 + Math.random() * 4; // 8〜12秒

  // 揺れの周期 (秒) と幅 (px)
  const swayDuration    = 2 + Math.random() * 2;   // 2〜4秒
  const swayAmplitudePx = 10 + Math.random() * 20; // 10〜30px

  return {
    width:            `${diameter}px`,
    height:           `${diameter}px`,
    fontSize:         `${baseFontSize}px`,
    top:              `-150px`,                       // 常に画面上外からスタート
    left:             `${leftPercent}%`,
    // CSS 変数に揺れ幅をセット
    '--sway-amplitude': `${swayAmplitudePx}px`,
    // floatDown（1回で画面下まで）＋sway（無限ループ）
    animation: `floatDown ${fallDuration}s linear 0s 1 both,  
                sway      ${swayDuration}s ease-in-out 0s infinite both`,
  };
}