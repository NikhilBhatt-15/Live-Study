import React, { useState } from "react";
import { getUserProfile } from "../../api/auth";
import { useEffect } from "react";
const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Taylor Edwards",
    username: "tayloredwards",
    email: "taylor@teachstream.com",
    bio: "Education enthusiast and video creator specialized in mathematics and science. I create engaging content to help students understand complex topics in a simple way.",
  });

  const [userProfile, setUserProfile] = useState(null);
  const [channelDescription, setChannelDescription] = useState("");
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [videosCount, setVideosCount] = useState(0);

  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile();
      if (response.status === 200) {
        setUserProfile(response.data.data.user);
        setChannelDescription(response.data.data.channel.description);
        setSubscribersCount(response.data.data.subscribersCount);
        setVideosCount(response.data.data.videosCount);
      } else {
        console.error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  // Call fetchUserProfile when the component mounts
  useEffect(() => {
    fetchUserProfile();
  }, []);
  const handleSave = () => {
    setIsEditing(false);
    // Typically save the data to a backend
    console.log("Saving profile data:", profileData);
  };

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {/* Profile Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.avatarWrapper}>
            <img
              src={userProfile?.avatarUrl}
              alt={profileData.name}
              style={styles.avatar}
            />
          </div>
          <div style={styles.textCenter}>
            <h2 style={styles.name}>{userProfile?.name}</h2>
            <p style={styles.username}>@{userProfile?.name}</p>
          </div>
          <button
            style={styles.buttonOutline}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
          <button style={styles.buttonOutline}>Account Settings</button>
        </div>
        {/* Profile Main */}
        <div>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>Profile Information</span>
            </div>
            <div style={styles.cardContent}>
              {isEditing ? (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Full Name</label>
                    <input
                      style={styles.input}
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Username</label>
                    <input
                      style={styles.input}
                      value={userProfile?.username}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          username: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Email</label>
                    <input
                      style={styles.input}
                      type="email"
                      value={userProfile?.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Bio</label>
                    <textarea
                      style={{ ...styles.input, minHeight: 80 }}
                      value={channelDescription}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                    />
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <button style={styles.buttonPrimary} onClick={handleSave}>
                      Save Changes
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Name:</span>
                    <span>{userProfile?.name}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Username:</span>
                    <span>@{userProfile?.name}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Email:</span>
                    <span>{userProfile?.email}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Bio:</span>
                    <span>{channelDescription}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div style={{ ...styles.card, marginTop: 24 }}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>Your Statistics</span>
            </div>
            <div style={styles.statsGrid}>
              <div style={styles.statBox}>
                <p style={styles.statValue}>{videosCount}</p>
                <p style={styles.statLabel}>Videos</p>
              </div>
              <div style={styles.statBox}>
                <p style={styles.statValue}>{subscribersCount}</p>
                <p style={styles.statLabel}>Subscribers</p>
              </div>
              <div style={styles.statBox}>
                <p style={styles.statValue}>45k</p>
                <p style={styles.statLabel}>Views</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 1100,
    margin: "40px auto",
    padding: 32,
    background: "linear-gradient(120deg, #f0f4ff 0%, #fdf6ff 100%)",
    borderRadius: 24,
    boxShadow: "0 8px 32px rgba(99,102,241,0.08)",
  },
  grid: {
    display: "grid",
    gap: 40,
    gridTemplateColumns: "330px 1fr",
    alignItems: "flex-start",
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 24,
    background: "linear-gradient(135deg, #6366f1 0%, #a5b4fc 100%)",
    borderRadius: 20,
    padding: "36px 20px 32px 20px",
    boxShadow: "0 4px 24px rgba(99,102,241,0.18)",
    color: "#fff",
    minHeight: 480,
  },
  avatarWrapper: {
    marginBottom: 12,
    boxShadow: "0 6px 24px rgba(99,102,241,0.15)",
    borderRadius: "50%",
    border: "5px solid #fff",
  },
  avatar: {
    width: 148,
    height: 148,
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #f3f4f6",
    boxShadow: "0 2px 12px rgba(99,102,241,0.13)",
  },
  textCenter: {
    textAlign: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    margin: 0,
    color: "#fff",
    letterSpacing: "0.5px",
  },
  username: {
    color: "#e0e7ff",
    fontSize: 18,
    margin: 0,
    fontWeight: 500,
  },
  buttonOutline: {
    width: "100%",
    padding: "12px 0",
    fontSize: 16,
    border: "2px solid #fff",
    borderRadius: 6,
    background: "rgba(255,255,255,0.13)",
    color: "#fff",
    cursor: "pointer",
    marginBottom: 10,
    fontWeight: 500,
    transition: "background 0.2s, color 0.2s, border 0.2s",
    boxShadow: "0 2px 8px rgba(99,102,241,0.11)",
  },
  buttonPrimary: {
    padding: "12px 28px",
    fontSize: 16,
    border: "none",
    borderRadius: 6,
    background: "linear-gradient(90deg, #6366f1 0%, #818cf8 100%)",
    color: "#fff",
    cursor: "pointer",
    marginTop: 8,
    fontWeight: 600,
    boxShadow: "0 2px 12px rgba(99,102,241,0.13)",
    transition: "background 0.2s, box-shadow 0.2s",
  },
  card: {
    background: "#fff",
    border: "2px solid #6366f1",
    borderRadius: 14,
    marginBottom: 32,
    boxShadow: "0 8px 32px rgba(99,102,241,0.10)",
    transition: "box-shadow 0.2s, border-color 0.2s",
  },
  cardHeader: {
    padding: "24px 28px",
    borderBottom: "1.5px solid #e5e7eb",
    background: "linear-gradient(90deg, #f3f4f6 0%, #e0e7ff 100%)",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4338ca",
    letterSpacing: "0.2px",
  },
  cardContent: {
    padding: 28,
    fontSize: 17,
  },
  formGroup: {
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  label: {
    fontSize: 15,
    fontWeight: 600,
    marginBottom: 2,
    color: "#6366f1",
  },
  input: {
    padding: 10,
    fontSize: 16,
    border: "1.5px solid #d1d5db",
    borderRadius: 6,
    width: "100%",
    boxSizing: "border-box",
    background: "#f3f4f6",
    marginTop: 2,
    marginBottom: 2,
  },
  infoRow: {
    display: "grid",
    gridTemplateColumns: "150px 1fr",
    gap: 10,
    alignItems: "start",
    marginBottom: 16,
  },
  infoLabel: {
    fontWeight: "600",
    color: "#6366f1",
    fontSize: 16,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 24,
    textAlign: "center",
    padding: 32,
  },
  statBox: {
    background: "linear-gradient(120deg, #6366f1 0%, #818cf8 100%)",
    borderRadius: 12,
    padding: 28,
    boxShadow: "0 2px 12px rgba(99,102,241,0.10)",
    color: "#fff",
    transition: "transform 0.18s, box-shadow 0.18s",
    fontWeight: 600,
    fontSize: 18,
    cursor: "pointer",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    margin: 0,
    color: "#fff",
    letterSpacing: "1px",
    textShadow: "0 2px 8px rgba(99,102,241,0.13)",
  },
  statLabel: {
    color: "#e0e7ff",
    fontSize: 17,
    margin: 0,
    marginTop: 4,
    fontWeight: 500,
  },
};

export default Profile;
