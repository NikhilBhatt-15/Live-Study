import React, { useState } from "react";
import VideoJS from "./Videojs.jsx";

export default function VideoPlayerWrapper({ isLive, streamUrl, videoUrl }) {
  const [ended, setEnded] = useState(false);
  const src = isLive ? streamUrl : videoUrl;

  if (!src) return <div>No video source available.</div>;

  if (ended)
    return <div style={{ textAlign: "center", padding: 24 }}>Video Ended</div>;

  return <VideoJS src={src} isLive={isLive} onEnded={() => setEnded(true)} />;
}
