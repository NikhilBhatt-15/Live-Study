import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { videos } from "../../data/mockData";
import VideoCard from "../../components/VideoCard";
import LiveChat from "../../components/LiveChat";
import { Download, Share, ThumbsUp } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getLiveStreamById,
  getVideoById,
  getVideos,
  subscribeToChannel,
  unsubscribeFromChannel,
  getChannelInfo,
  isSubscribed as checkSubscribe,
  likeVideo,
  dislikeVideo,
  isVideoLiked,
} from "../../api/auth";
import {
  formatDate,
  toLiveReactingEmbedUrl,
  formatDuration,
} from "../../utils/utility";

const VideoPage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const isLive = location.pathname.includes("live");
  const videoId = id;

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState(videos);
  const [channelinfo, setChannelInfo] = useState(null);
  const [isLike, setIsLike] = useState(false);

  const subscribeToChannelhandler = async () => {
    try {
      const response = await subscribeToChannel(video.channelId._id);
      if (response.status === 200) {
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error("Error subscribing to channel:", error);
    }
  };
  const unsubscribeFromChannelhandler = async () => {
    try {
      const response = await unsubscribeFromChannel(video.channelId._id);
      if (response.status === 200) {
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error("Error unsubscribing from channel:", error);
    }
  };
  const handleSubscribeClick = () => {
    if (isSubscribed) {
      unsubscribeFromChannelhandler();
    } else {
      subscribeToChannelhandler();
    }
  };

  const likeToVideo = async () => {
    try {
      const response = await likeVideo(video._id);
      if (response.status === 200) {
        setIsLike(true);
      }
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };
  const dislikeToVideo = async () => {
    try {
      const response = await dislikeVideo(video._id);
      if (response.status === 200) {
        setIsLike(false);
      }
    } catch (error) {
      console.error("Error disliking video:", error);
    }
  };
  const handleLikeClick = () => {
    if (isLike) {
      dislikeToVideo();
    } else {
      likeToVideo();
    }
    setVideo((prevVideo) => ({
      ...prevVideo,
      likes: isLike ? prevVideo.likes - 1 : prevVideo.likes + 1,
    }));
  };

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!video || !video.channelId) return; // Ensure `video` is loaded before proceeding
      try {
        const response = await checkSubscribe(video.channelId._id);
        if (response.status === 200) {
          setIsSubscribed(response.data.data);
        }
      } catch (error) {
        console.error("Error checking subscription status:", error);
        setIsSubscribed(false);
      }
    };
    const checkLikeStatus = async () => {
      if (!video) return; // Ensure `video` is loaded before proceeding
      try {
        const response = await isVideoLiked(video._id);
        if (response.status === 200) {
          setIsLike(response.data.data);
        }
      } catch (error) {
        console.error("Error checking like status:", error);
        setIsLike(false);
      }
    };
    checkLikeStatus();
    checkSubscriptionStatus();
  }, [video]); // Run this effect only when `video` changes

  useEffect(() => {
    const fetchLiveStream = async () => {
      try {
        const response = await getLiveStreamById(videoId);
        if (response.status === 200) {
          setVideo(response.data.data);
          setIsVideoLoaded(true);
        }
      } catch (error) {
        setIsVideoLoaded(true);
      }
    };
    const fetchVideo = async () => {
      try {
        const response = await getVideoById(videoId);
        if (response.status === 200) {
          setVideo(response.data.data);
          setIsVideoLoaded(true);
        }
      } catch (error) {
        setIsVideoLoaded(true);
      }
    };
    const fetchRelatedVideos = async () => {
      try {
        const response = await getVideos();
        if (response.status === 200) {
          setRelatedVideos(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching related videos:", error);

        setRelatedVideos([]);
      }
    };
    const fetchChannelInfo = async () => {
      try {
        const response = await getChannelInfo(video.channelId._id);
        if (response.status === 200) {
          setChannelInfo(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching channel info:", error);
      }
    };

    fetchChannelInfo();
    fetchRelatedVideos();
    if (isLive) fetchLiveStream();
    else fetchVideo();
  }, [videoId, isLive]);

  // Loading state
  if (!isVideoLoaded) {
    return <div>Loading...</div>;
  }

  if (!video) {
    return <div>Video not found.</div>;
  }

  // Determine if this is a livestream or a recorded video
  const isLivestream = isLive;

  // Get creator/channel info
  const channel = video.channelId || video.creator || {};
  const avatarUrl = channel.avatarUrl || "";
  const creatorName = channel.name || "Unknown";

  // Video/stream source
  const videoSrc = isLivestream
    ? video.hlsUrl // For livestreams
    : video.videoUrl; // For recordings

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {/* Video Player Section */}
        <div style={styles.videoSection}>
          <div style={styles.videoPlayer}>
            {videoSrc ? (
              <iframe
                src={toLiveReactingEmbedUrl(videoSrc)}
                width="100%"
                height="100%"
                frameborder="0"
                allowfullscreen
                style={{}}
              ></iframe>
            ) : (
              <div>No video source available.</div>
            )}
          </div>

          {/* Video Info */}
          <div style={styles.videoInfo}>
            <h1 style={styles.videoTitle}>{video.title}</h1>
            <div style={styles.videoMeta}>
              <div style={styles.creatorInfo}>
                <div style={styles.avatar}>
                  <img
                    src={avatarUrl}
                    alt={creatorName}
                    style={styles.avatarImage}
                  />
                </div>
                <div>
                  <h3 style={styles.creatorName}>{creatorName}</h3>
                  <p style={styles.subscribers}>
                    {channelinfo?.subscribersCount || "13k"} subscribers
                  </p>
                </div>
                <button
                  style={{
                    ...styles.subscribeButton,
                    ...(isSubscribed ? styles.subscribedButton : {}),
                  }}
                  onClick={() => {
                    if (user) {
                      handleSubscribeClick();
                    } else {
                      alert("Please login to subscribe");
                    }
                  }}
                >
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </button>
              </div>
              <div style={styles.actions}>
                <button
                  style={
                    isLike
                      ? {
                          ...styles.actionButton,
                          backgroundColor: "#219ebc", // genrate a good color
                          color: "white",
                        }
                      : styles.actionButton
                  }
                  onClick={() => {
                    if (user) {
                      handleLikeClick();
                    } else {
                      alert("Please login to like");
                    }
                  }}
                >
                  <ThumbsUp
                    style={
                      isLike
                        ? {
                            ...styles.icon,
                            color: "blue",
                          }
                        : {
                            ...styles.icon,
                            color: "black",
                          }
                    }
                  />
                  <span>{video.likes || 0}</span>
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
                <span>{video.views || 0} views</span>
                <span style={styles.dot}>•</span>
                <span>
                  {isLivestream
                    ? `Started on ${formatDate(video.startedAt)}`
                    : `${formatDate(video.publishedAt)}`}
                </span>
              </div>
              <p>{video.description}</p>
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
          {/* Live Chat only for livestreams */}
          {isLivestream && (
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
                <VideoCard
                  key={video._id}
                  id={video._id}
                  title={video.title}
                  thumbnail={video.thumbnailUrl}
                  views={video.views}
                  postedAt={formatDate(video.createdAt)}
                  duration={formatDuration(video.duration)}
                  creator={
                    video.channelId
                      ? {
                          name: video.channelId.name,
                          avatar: video.channelId.avatarUrl,
                        }
                      : { name: "Unknown", avatar: "" }
                  }
                  isLive={false}
                />
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
