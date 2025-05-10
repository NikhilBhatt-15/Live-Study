import React from "react";
import { Link } from "react-router-dom";
import LiveBadge from "./LiveBadge";

const VideoCard = ({
  id,
  title,
  thumbnail,
  views,
  postedAt,
  duration,
  creator,
  isLive,
}) => {
  return (
    <Link to={`/video/${id}`} style={styles.link}>
      <div style={styles.card}>
        <div style={styles.thumbnailContainer}>
          <img src={thumbnail} alt={title} style={styles.thumbnail} />
          {isLive ? (
            <div style={styles.liveBadgeContainer}>
              <LiveBadge />
            </div>
          ) : (
            <div style={styles.durationBadge}>{duration}</div>
          )}
        </div>
        <div style={styles.cardContent}>
          <div style={styles.contentContainer}>
            <div style={styles.avatar}>
              <img
                src={creator.avatar}
                alt={creator.name}
                style={styles.avatarImage}
              />
            </div>
            <div style={styles.textContainer}>
              <h3 style={styles.title}>{title}</h3>
              <p style={styles.creatorName}>{creator.name}</p>
              <div style={styles.metaInfo}>
                <span>{views}</span>
                <span style={styles.dot}>•</span>
                <span>{postedAt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const styles = {
  link: {
    textDecoration: "none",
    color: "inherit",
  },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#fff",
    transition: "box-shadow 0.2s ease-in-out",
    cursor: "pointer",
  },
  thumbnailContainer: {
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    aspectRatio: "16/9",
    objectFit: "cover",
  },
  liveBadgeContainer: {
    position: "absolute",
    bottom: "8px",
    right: "8px",
  },
  durationBadge: {
    position: "absolute",
    bottom: "8px",
    right: "8px",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "#fff",
    fontSize: "12px",
    padding: "2px 6px",
    borderRadius: "4px",
  },
  cardContent: {
    padding: "12px",
  },
  contentContainer: {
    display: "flex",
    gap: "12px",
  },
  avatar: {
    flexShrink: 0,
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    overflow: "hidden",
    backgroundColor: "#e5e7eb",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  textContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: "14px",
    fontWeight: "500",
    lineHeight: "1.4",
    margin: "0 0 4px",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  creatorName: {
    fontSize: "12px",
    color: "#6b7280",
    margin: "0 0 4px",
  },
  metaInfo: {
    fontSize: "12px",
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
  },
  dot: {
    margin: "0 4px",
  },
};

export default VideoCard;
