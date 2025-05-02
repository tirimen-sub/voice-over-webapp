import React from 'react';
import './bgVideo.css';


const BgVideo = () => (
  <video
    className="bg-video"
    playsInline
    autoPlay
    muted
    loop
    preload="auto"
  >
    <source src="/vodouga01.mp4" type="video/mp4" />
  </video>
);

export default BgVideo;