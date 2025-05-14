import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Video, Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext"; // <-- import your context
import { useSearch } from "../../context/SearchContext"; // <-- import your context
const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // <-- use context
  const { searchQuery, setSearchQuery } = useSearch(); // <-- use context
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Logo Section */}
        <div style={styles.logoSection}>
          <Link to="/" style={styles.logoLink}>
            <Video style={styles.logoIcon} />
            <span style={styles.logoText}>TeachStream</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div style={styles.searchBar}>
          <div style={styles.searchContainer}>
            <Search style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search for videos, courses, teachers..."
              style={styles.searchInput}
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>

        {/* User Actions */}
        <div style={styles.userActions}>
          {user ? (
            <>
              <Link to="/dashboard">
                <button style={styles.outlineButton}>Creator Studio</button>
              </Link>
              <Bell />
              <Link to="/profile">
                <div style={styles.avatar}>
                  <img
                    src={user.avatarUrl}
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                    }}
                    alt="Avatar"
                  />
                </div>
              </Link>
              <button style={styles.outlineButton} onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                style={styles.outlineButton}
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
              <button
                style={styles.primaryButton}
                onClick={() => navigate("/signup")}
              >
                Create Account
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    width: "100%",
    borderBottom: "1px solid #e0e0e0",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "64px",
    // maxWidth: "1200px",
    // margin: "0 auto",
    padding: "0 16px",
  },
  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  logoLink: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "bold",
    fontSize: "20px",
    color: "#1d4ed8",
    textDecoration: "none",
  },
  logoIcon: {
    height: "24px",
    width: "24px",
  },
  logoText: {
    color: "#1d4ed8",
  },
  searchBar: {
    display: "flex", // Changed from "block" to "flex" for better alignment
    flex: 1,
    justifyContent: "center",
    padding: "0 16px",
  },
  searchContainer: {
    position: "relative",
    width: "100%",
    maxWidth: "500px", // Increased max width for better usability
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    height: "20px", // Slightly larger icon
    width: "20px",
    color: "#6b7280", // Softer gray for better contrast
  },
  searchInput: {
    width: "100%",
    padding: "10px 12px 10px 40px", // Adjusted padding for better spacing
    border: "1px solid #d1d5db",
    borderRadius: "20px", // Rounded corners for a modern look
    fontSize: "14px",
    backgroundColor: "#f3f4f6", // Softer background color
    outline: "none",
    transition: "border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  },
  searchInputFocus: {
    borderColor: "#1d4ed8", // Blue border on focus
    boxShadow: "0 0 0 3px rgba(29, 78, 216, 0.2)", // Subtle focus ring
  },
  userActions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  outlineButton: {
    padding: "8px 16px",
    fontSize: "14px",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    backgroundColor: "transparent",
    cursor: "pointer",
  },
  primaryButton: {
    padding: "8px 16px",
    fontSize: "14px",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#1d4ed8",
    cursor: "pointer",
  },
  avatar: {
    flexShrink: 0,
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    overflow: "hidden",
    backgroundColor: "#e5e7eb",
  },
};

export default Navbar;
