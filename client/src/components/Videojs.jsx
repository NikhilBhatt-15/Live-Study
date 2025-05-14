import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const VideoJS = ({ src, isLive, onEnded }) => {
  const videoNode = useRef(null);
  const player = useRef(null);

  useEffect(() => {
    if (!videoNode.current) return;

    // Video.js player options
    const options = {
      controls: true,
      autoplay: isLive,
      responsive: true,
      fluid: true,
      sources: [
        {
          src,
          type: src.endsWith(".m3u8") ? "application/x-mpegURL" : "video/mp4",
        },
      ],
      liveui: isLive,
    };

    // Initialize Video.js
    player.current = videojs(
      videoNode.current,
      options,
      function onPlayerReady() {
        // Optional: Player is ready
      }
    );

    // Handle 'ended' event
    if (onEnded) {
      player.current.on("ended", onEnded);
    }

    // Cleanup on unmount
    return () => {
      if (player.current) {
        player.current.dispose();
        player.current = null;
      }
    };
  }, [src, isLive, onEnded]);

  return (
    <div data-vjs-player>
      <video ref={videoNode} className="video-js vjs-big-play-centered" />
    </div>
  );
};

export default VideoJS;
