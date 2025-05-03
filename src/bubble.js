export default function generateBubbleStyle(text) {
  const baseFontSize   = 14;
  const diameter       = Math.min(200, Math.max(50, text.length * baseFontSize + 20));
  const isMobile = 
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 600px)').matches;
  
  const mobileScale = 0.6;
  const Newdiameter = isMobile
    ? diameter * mobileScale
    : diameter;

  const fontSize = isMobile
    ? baseFontSize * isMobile
    : baseFontSize;

  // 横位置は 0～100% の間でランダム
  const leftPercent    = Math.random() * 100;
  // 落下にかける時間をランダムかつ長めに（例：15～30秒）
  const fallDuration   = 15 + Math.random() * 15;   // 15秒～30秒
  // 揺れの周期と振幅
  const swayDuration   = 3 + Math.random() * 2;     // 3秒～5秒周期
  const swayAmplitude  = 10 + Math.random() * 20;   // 10px～30px

  return {
    width:              `${Newdiameter}px`,
    height:             `${Newdiameter}px`,
    fontSize:           `${fontSize}px`,
    top:                `-200px`,                 // スタート位置は画面上外
    left:               `${leftPercent}%`,
    // CSS変数で揺れ幅を渡す
    '--sway-amplitude': `${swayAmplitude}px`,
    // アニメーションを inline で指定
    animation: `
      floatDown ${fallDuration}s linear 0s infinite both,
      sway      ${swayDuration}s ease-in-out 0s infinite both
    `
  };
}