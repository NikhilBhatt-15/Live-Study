import React, { useState } from "react";
import { videos } from "../../data/mockData";
import { Video, Upload, Play } from "lucide-react";

const Dashboard = () => {
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);

  // Filter only user's videos (for demo, we'll just use the first 3)
  const userVideos = videos.slice(0, 3);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Creator Dashboard</h1>
        <div style={styles.headerActions}>
          <button
            style={styles.outlineButton}
            onClick={() => setIsLiveModalOpen(true)}
          >
            <Play style={styles.icon} />
            Go Live
          </button>
          <button style={styles.primaryButton}>
            <Upload style={styles.icon} />
            Upload Video
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div style={styles.statsGrid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Total Views</h3>
          <div style={styles.cardContent}>
            <div style={styles.statValue}>42.5K</div>
            <p style={styles.statDescription}>+12% from last month</p>
          </div>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Subscribers</h3>
          <div style={styles.cardContent}>
            <div style={styles.statValue}>1,240</div>
            <p style={styles.statDescription}>+85 new this week</p>
          </div>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Watch Hours</h3>
          <div style={styles.cardContent}>
            <div style={styles.statValue}>958</div>
            <p style={styles.statDescription}>Average 4.2 min/view</p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div>
        <div style={styles.tabsList}>
          <button style={styles.tabButton}>Your Content</button>
          <button style={styles.tabButton}>Analytics</button>
          <button style={styles.tabButton}>Comments</button>
          <button style={styles.tabButton}>Monetization</button>
        </div>

        {/* Your Content Tab */}
        <div style={styles.tabContent}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Your Videos</h3>
            <div style={styles.cardContent}>
              {userVideos.map((video) => (
                <div key={video.id} style={styles.videoItem}>
                  <div style={styles.videoThumbnail}>
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      style={styles.thumbnailImage}
                    />
                    {!video.isLive && (
                      <div style={styles.videoDuration}>{video.duration}</div>
                    )}
                  </div>
                  <div style={styles.videoDetails}>
                    <h4 style={styles.videoTitle}>{video.title}</h4>
                    <p style={styles.videoMeta}>
                      {video.views} views • {video.postedAt}
                    </p>
                    <div style={styles.videoActions}>
                      <button style={styles.outlineButton}>Edit</button>
                      <button style={styles.outlineButton}>Analytics</button>
                    </div>
                  </div>
                </div>
              ))}
              <button style={styles.outlineButtonFull}>View All Videos</button>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Upcoming Scheduled Streams</h3>
            <div style={styles.cardContentCenter}>
              <Video style={styles.iconLarge} />
              <h4 style={styles.noContentTitle}>No upcoming streams</h4>
              <p style={styles.noContentDescription}>
                Schedule a live stream to connect with your students in
                real-time
              </p>
              <button style={styles.primaryButton}>Schedule Stream</button>
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
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  headerActions: {
    display: "flex",
    gap: "12px",
  },
  primaryButton: {
    padding: "8px 16px",
    fontSize: "14px",
    color: "#fff",
    backgroundColor: "#1d4ed8",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  outlineButton: {
    padding: "8px 16px",
    fontSize: "14px",
    color: "#374151",
    backgroundColor: "transparent",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "24px",
    marginBottom: "24px",
  },
  card: {
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: "8px",
  },
  cardContent: {
    fontSize: "16px",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  statDescription: {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "4px",
  },
  tabsList: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
  },
  tabButton: {
    padding: "8px 16px",
    fontSize: "14px",
    color: "#374151",
    backgroundColor: "#f3f4f6",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    cursor: "pointer",
  },
  tabContent: {
    marginTop: "16px",
  },
  videoItem: {
    display: "flex",
    gap: "16px",
    marginBottom: "16px",
  },
  videoThumbnail: {
    position: "relative",
    width: "160px",
    height: "90px",
    borderRadius: "8px",
    overflow: "hidden",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  videoDuration: {
    position: "absolute",
    bottom: "8px",
    right: "8px",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "#fff",
    fontSize: "12px",
    padding: "2px 6px",
    borderRadius: "4px",
  },
  videoDetails: {
    flex: 1,
  },
  videoTitle: {
    fontSize: "16px",
    fontWeight: "500",
  },
  videoMeta: {
    fontSize: "14px",
    color: "#6b7280",
    marginTop: "4px",
  },
  videoActions: {
    display: "flex",
    gap: "8px",
    marginTop: "8px",
  },
  outlineButtonFull: {
    width: "100%",
    padding: "8px 16px",
    fontSize: "14px",
    color: "#374151",
    backgroundColor: "transparent",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cardContentCenter: {
    textAlign: "center",
    padding: "24px",
  },
  icon: {
    width: "16px",
    height: "16px",
  },
  iconLarge: {
    width: "48px",
    height: "48px",
    color: "#6b7280",
    opacity: "0.5",
  },
  noContentTitle: {
    fontSize: "16px",
    fontWeight: "500",
    marginTop: "16px",
  },
  noContentDescription: {
    fontSize: "14px",
    color: "#6b7280",
    marginTop: "8px",
  },
};

export default Dashboard;
