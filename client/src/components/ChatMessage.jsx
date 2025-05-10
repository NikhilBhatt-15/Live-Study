import React from "react";

export const ChatMessage = ({
  username,
  message,
  timestamp,
  isTeacher = false,
  avatar,
}) => {
  return (
    <div style={styles.messageContainer}>
      <div style={styles.avatar}>
        {avatar ? (
          <img src={avatar} alt={username} style={styles.avatarImage} />
        ) : (
          <div style={styles.avatarPlaceholder}>
            {username.charAt(0).toUpperCase()}
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
            {username}{" "}
            {isTeacher && <span style={styles.teacherBadge}>Teacher</span>}
          </span>
          <span style={styles.timestamp}>{timestamp}</span>
        </div>
        <p style={styles.messageText}>{message}</p>
      </div>
    </div>
  );
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
