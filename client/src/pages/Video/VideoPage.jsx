import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { videos } from "../../data/mockData";
import VideoCard from "../../components/VideoCard";
import LiveChat from "../../components/LiveChat";
import { Download, Share, ThumbsUp } from "lucide-react";

const VideoPage = () => {
  const { id } = useParams();
  const videoId = parseInt(id || "1");
  const video = videos.find((v) => v.id === videoId) || videos[0];
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);

  const relatedVideos = videos.filter((v) => v.id !== videoId).slice(0, 10);

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {/* Video Player Section */}
        <div style={styles.videoSection}>
          <div style={styles.videoPlayer}>
            <iframe
              src="https://www.livereacting.com/tools/hls-player-embed?url=http%3A%2F%2Flocalhost%3A8080%2Fhls%2Fnight%2Findex.m3u8"
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              style={{
                maxWidth: "100%",
              }}
            ></iframe>
          </div>

          {/* Video Info */}
          <div style={styles.videoInfo}>
            <h1 style={styles.videoTitle}>{video.title}</h1>
            <div style={styles.videoMeta}>
              <div style={styles.creatorInfo}>
                <div style={styles.avatar}>
                  <img
                    src={video.creator.avatar}
                    alt={video.creator.name}
                    style={styles.avatarImage}
                  />
                </div>
                <div>
                  <h3 style={styles.creatorName}>{video.creator.name}</h3>
                  <p style={styles.subscribers}>12.5K subscribers</p>
                </div>
                <button
                  style={{
                    ...styles.subscribeButton,
                    ...(isSubscribed ? styles.subscribedButton : {}),
                  }}
                  onClick={() => setIsSubscribed(!isSubscribed)}
                >
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </button>
              </div>

              <div style={styles.actions}>
                <button style={styles.actionButton}>
                  <ThumbsUp style={styles.icon} />
                  <span>2.4K</span>
                </button>
                <button style={styles.actionButton}>
                  <Share style={styles.icon} />
                  <span>Share</span>
                </button>
                <button style={styles.actionButton}>
                  <Download style={styles.icon} />
                  <span>Save</span>
                </button>
              </div>
            </div>

            {/* Video Description */}
            <div style={styles.description}>
              <div style={styles.descriptionMeta}>
                <span>{video.views} views</span>
                <span style={styles.dot}>•</span>
                <span>{video.postedAt}</span>
              </div>
              <p>
                In this educational session, {video.creator.name} explores{" "}
                {video.title.toLowerCase()}. This video is part of our
                comprehensive curriculum designed to help students master the
                subject through clear explanations and practical examples.
              </p>
            </div>
          </div>

          {/* Notes Upload Section */}
          <div style={styles.notesSection}>
            <h2 style={styles.notesTitle}>Lecture Notes</h2>
            <p style={styles.notesDescription}>
              Download the complete lecture notes for this session. These notes
              cover all the key concepts discussed in the video with additional
              examples and practice problems.
            </p>
            <button style={styles.downloadButton}>Download Notes (PDF)</button>
          </div>
        </div>

        {/* Related Videos and Chat Section */}
        <div style={styles.sidebar}>
          {/* Live Chat */}
          {video.isLive && (
            <div style={styles.liveChatContainer}>
              <LiveChat
                isCollapsed={isChatCollapsed}
                onToggleCollapse={() => setIsChatCollapsed(!isChatCollapsed)}
              />
            </div>
          )}

          {/* Related Videos */}
          <div>
            <h2 style={styles.relatedTitle}>Related Videos</h2>
            <div style={styles.relatedList}>
              {relatedVideos.map((video) => (
                <VideoCard key={video.id} {...video} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "3fr 1fr", // Video player takes 3/4, sidebar takes 1/4
    gap: "24px",
  },
  videoSection: {
    gridColumn: "span 1",
  },
  videoPlayer: {
    position: "relative",
    width: "100%",
    aspectRatio: "16/9",
    backgroundColor: "#000",
    borderRadius: "8px",
    overflow: "hidden",
  },
  videoInfo: {
    marginTop: "16px",
  },
  videoTitle: {
    fontSize: "20px",
    fontWeight: "600",
  },
  videoMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "16px",
  },
  creatorInfo: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    overflow: "hidden",
    backgroundColor: "#e5e7eb",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  creatorName: {
    fontSize: "16px",
    fontWeight: "500",
  },
  subscribers: {
    fontSize: "12px",
    color: "#6b7280",
  },
  subscribeButton: {
    padding: "8px 16px",
    fontSize: "14px",
    color: "#fff",
    backgroundColor: "#1d4ed8",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  subscribedButton: {
    backgroundColor: "#6b7280",
  },
  actions: {
    display: "flex",
    gap: "8px",
  },
  actionButton: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "8px 12px",
    fontSize: "14px",
    color: "#374151",
    backgroundColor: "#f3f4f6",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    cursor: "pointer",
  },
  icon: {
    width: "16px",
    height: "16px",
  },
  description: {
    marginTop: "24px",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
  },
  descriptionMeta: {
    display: "flex",
    alignItems: "center",
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "8px",
  },
  dot: {
    margin: "0 8px",
  },
  notesSection: {
    marginTop: "24px",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
  },
  notesTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  notesDescription: {
    fontSize: "14px",
    marginBottom: "16px",
  },
  downloadButton: {
    padding: "8px 16px",
    fontSize: "14px",
    color: "#fff",
    backgroundColor: "#1d4ed8",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  sidebar: {
    gridColumn: "span 1",
  },
  liveChatContainer: {
    marginBottom: "24px",
    height: "384px",
  },
  relatedTitle: {
    fontSize: "18px",
    fontWeight: "500",
    marginBottom: "16px",
  },
  relatedList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
};

export default VideoPage;
