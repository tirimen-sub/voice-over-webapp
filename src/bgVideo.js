import React from 'react';
import vodouga01 from './vodouga01.mp4';
import './App.css';  // .bg-video のスタイル定義があるファイルをインポート

const BgVideo = () => (
  <video
    className="bg-video"
    playsInline
    autoPlay
    muted
    loop
    preload="auto"
  >
    <source src={vodouga01} type="video/mp4" />
    {/* 必要なら別形式も import して <source> を追加 */}
  </video>
);

export default BgVideo;