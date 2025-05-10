import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const VideoPlayer = ({ isLive, streamUrl, videoUrl }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (isLive && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });

      return () => {
        hls.destroy();
      };
    } else if (!isLive) {
      video.src = videoUrl;
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
    }
  }, [isLive, streamUrl, videoUrl]);

  return (
    <video
      ref={videoRef}
      style={{ width: "100%", height: "100%", borderRadius: "8px" }}
      controls
      autoPlay
      muted
    />
  );
};

export default VideoPlayer;
