import React from "react";

export const ChatMessage = ({
  user,
  content,
  timestamp,
  isTeacher = false,
}) => {
  return (
    <div style={styles.messageContainer}>
      <div style={styles.avatar}>
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            style={styles.avatarImage}
          />
        ) : (
          <div style={styles.avatarPlaceholder}>
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div style={styles.messageContent}>
        <div style={styles.messageHeader}>
          <span
            style={{
              ...styles.username,
              ...(isTeacher ? styles.teacherUsername : {}),
            }}
          >
            {user.username}{" "}
            {isTeacher && <span style={styles.teacherBadge}>Teacher</span>}
          </span>
          <span style={styles.timestamp}>{formatDate(timestamp)}</span>
        </div>
        <p style={styles.messageText}>{content}</p>
      </div>
    </div>
  );
};

const formatDate = (date) => {
  // format to minutes ago hourse ago seconds ago
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};
const styles = {
  messageContainer: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    marginBottom: "16px",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    overflow: "hidden",
    backgroundColor: "#e5e7eb",
    flexShrink: 0,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarPlaceholder: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#e0f2fe",
    color: "#0284c7",
    fontWeight: "500",
    fontSize: "14px",
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  username: {
    fontSize: "14px",
    fontWeight: "500",
  },
  teacherUsername: {
    color: "#1d4ed8",
  },
  teacherBadge: {
    fontSize: "12px",
    backgroundColor: "#bfdbfe",
    color: "#1d4ed8",
    padding: "2px 4px",
    borderRadius: "4px",
    marginLeft: "4px",
  },
  timestamp: {
    fontSize: "12px",
    color: "#6b7280",
  },
  messageText: {
    fontSize: "14px",
    marginTop: "4px",
  },
};

export default ChatMessage;
