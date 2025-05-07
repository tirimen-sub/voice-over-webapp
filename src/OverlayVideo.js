import React from 'react';
import bg2 from './bg2.mp4';   // バンドルさせる場合
// import './App.css';                    // スタイルは App.css に書いても OK

const OverlayVideo = () => (
 <video
  className="overlay-video"
  playsInline
  autoPlay
  muted
  loop
  preload="auto"
  onLoadedMetadata={e => {
    e.currentTarget.playbackRate = 0.4;
  }}
>
  <source src={bg2} type="video/mp4" />
</video>
);

export default OverlayVideo;