import React from "react";

const LiveBadge = ({ className }) => {
  return (
    <div style={{ ...styles.liveBadge, ...(className ? { className } : {}) }}>
      <span style={styles.pulseDot}></span>
      LIVE
    </div>
  );
};

const styles = {
  liveBadge: {
    display: "flex",
    alignItems: "center",
    fontSize: "12px",
    fontWeight: "bold",
    color: "#ffffff",
    backgroundColor: "#e11d48", // Red background
    padding: "4px 8px",
    borderRadius: "4px",
  },
  pulseDot: {
    width: "8px",
    height: "8px",
    backgroundColor: "#ffffff",
    borderRadius: "50%",
    marginRight: "4px",
    animation: "pulse 1.5s infinite",
  },
};

export default LiveBadge;
