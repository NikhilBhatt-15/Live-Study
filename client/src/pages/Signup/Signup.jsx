import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../api/auth.js";

const Signup = () => {
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // General error
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    avatar: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear field error for this field
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [e.target.name]: "",
      }));
    }
    // Clear general error
    if (error) setError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const res = await signup(formData);
      if (res.status === 201) {
        navigate("/login");
      } else {
        setError(res.data?.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.outerContainer}>
      <div className="heroContainer" style={styles.heroContainer}>
        <div style={styles.heroImage}>
          {/* SVG Illustration */}
          <img
            src="https://res.cloudinary.com/dnv6ajx3b/image/upload/v1747053314/mhjzads2ec2s0hyvaefv.png"
            alt="Signup Illustration"
            style={styles.heroImage}
          />
        </div>
        <h1 style={styles.heroTitle}>TeachStreaming</h1>
        <p style={styles.heroSubtitle}>
          Create your free account.
          <br />
          Start teaching live today!
        </p>
      </div>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Create an account</h2>
            <p style={styles.cardDescription}>
              Enter your information to create an account
            </p>
          </div>
          {isLoading && (
            <div style={styles.loadingOverlay}>
              <div style={styles.spinner}></div>
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            style={{
              opacity: isLoading ? 0.6 : 1,
              pointerEvents: isLoading ? "none" : "auto",
            }}
          >
            <div style={styles.cardContent}>
              <div style={styles.avatarContainer}>
                <div style={styles.avatar}>
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile"
                      style={styles.avatarImage}
                    />
                  ) : (
                    <div style={styles.avatarFallback}>
                      {formData.name
                        ? formData.name.charAt(0).toUpperCase()
                        : "?"}
                    </div>
                  )}
                </div>
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={styles.fileInput}
                  disabled={isLoading}
                />
                <label htmlFor="avatar" style={styles.uploadButton}>
                  Upload
                </label>
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="name" style={styles.label}>
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  style={{
                    ...styles.input,
                    borderColor: fieldErrors.name ? "#ef4444" : "#cbd5e1",
                    boxShadow: fieldErrors.name
                      ? "0 0 0 2px rgba(239,68,68,0.15)"
                      : "0 0 0 2px rgba(37,99,235,0.08)",
                  }}
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {fieldErrors.name && (
                  <p style={styles.errorText}>{fieldErrors.name}</p>
                )}
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="email" style={styles.label}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  style={{
                    ...styles.input,
                    borderColor: fieldErrors.email ? "#ef4444" : "#cbd5e1",
                    boxShadow: fieldErrors.email
                      ? "0 0 0 2px rgba(239,68,68,0.15)"
                      : "0 0 0 2px rgba(37,99,235,0.08)",
                  }}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {fieldErrors.email && (
                  <p style={styles.errorText}>{fieldErrors.email}</p>
                )}
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="password" style={styles.label}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  style={{
                    ...styles.input,
                    borderColor: fieldErrors.password ? "#ef4444" : "#cbd5e1",
                    boxShadow: fieldErrors.password
                      ? "0 0 0 2px rgba(239,68,68,0.15)"
                      : "0 0 0 2px rgba(37,99,235,0.08)",
                  }}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {fieldErrors.password && (
                  <p style={styles.errorText}>{fieldErrors.password}</p>
                )}
              </div>
              {error && (
                <p style={{ ...styles.errorText, textAlign: "center" }}>
                  {error}
                </p>
              )}
            </div>
            <div style={styles.cardFooter}>
              <button
                type="submit"
                style={styles.submitButton}
                disabled={
                  !formData.email ||
                  !formData.password ||
                  !formData.name ||
                  isLoading
                }
              >
                {isLoading ? "Creating..." : "Create Account"}
              </button>
              <p style={styles.toggleText}>
                Already have an account?{" "}
                <button
                  type="button"
                  style={styles.toggleButton}
                  onClick={() => navigate("/login")}
                  disabled={isLoading}
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
      {/* Responsive: Hide hero image on small screens */}
      <style>
        {`
          @media (max-width: 900px) {
            .heroContainer {
              display: none !important;
            }
          }
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  outerContainer: {
    display: "flex",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e0e7ff 0%, #f9fafb 100%)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroContainer: {
    flex: 1.2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
    minWidth: "320px",
    maxWidth: "520px",
    boxSizing: "border-box",
    background: "none",
  },
  heroImage: {
    width: "100%",
    maxWidth: "350px",
    marginBottom: "24px",
  },
  heroTitle: {
    fontSize: "2.4rem",
    fontWeight: "bold",
    color: "#1e293b",
    margin: "0 0 12px 0",
    letterSpacing: "0.02em",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: "1.2rem",
    color: "#64748b",
    textAlign: "center",
    maxWidth: "400px",
    margin: 0,
    lineHeight: 1.5,
  },
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "none",
    padding: "16px",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(31, 41, 55, 0.15)",
    padding: "32px 28px",
    transition: "box-shadow 0.2s",
    position: "relative",
    overflow: "hidden",
  },
  cardHeader: {
    textAlign: "center",
    marginBottom: "20px",
  },
  cardTitle: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1e293b",
    margin: 0,
  },
  cardDescription: {
    fontSize: "1rem",
    color: "#64748b",
    marginTop: "8px",
    marginBottom: "0",
  },
  cardContent: {
    marginBottom: "24px",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "1rem",
    marginBottom: "8px",
    fontWeight: "500",
    color: "#334155",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    fontSize: "1rem",
    border: "1.5px solid #cbd5e1",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
    marginBottom: "2px",
  },
  errorText: {
    color: "#ef4444",
    fontSize: "0.92rem",
    marginTop: "6px",
    transition: "opacity 0.3s",
    minHeight: "18px",
  },
  avatarContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "16px",
  },
  avatar: {
    width: "96px",
    height: "96px",
    borderRadius: "50%",
    overflow: "hidden",
    backgroundColor: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "bold",
    color: "#374151",
    marginBottom: "8px",
    boxShadow: "0 2px 8px rgba(31, 41, 55, 0.08)",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarFallback: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#374151",
  },
  fileInput: {
    display: "none",
  },
  uploadButton: {
    fontSize: "14px",
    color: "#2563eb",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
    marginTop: "2px",
    fontWeight: "500",
    textDecoration: "underline",
    transition: "color 0.2s",
  },
  cardFooter: {
    textAlign: "center",
    marginTop: "10px",
  },
  submitButton: {
    width: "100%",
    padding: "14px",
    fontSize: "1.1rem",
    color: "#fff",
    background: "linear-gradient(90deg, #2563eb 0%, #1e40af 100%)",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    letterSpacing: "0.01em",
    boxShadow: "0 2px 8px rgba(37, 99, 235, 0.08)",
    transition: "background 0.2s, box-shadow 0.2s, opacity 0.2s",
    marginBottom: "8px",
    opacity: 1,
  },
  toggleText: {
    fontSize: "1rem",
    color: "#64748b",
    marginTop: "18px",
  },
  toggleButton: {
    background: "none",
    border: "none",
    color: "#2563eb",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    textDecoration: "underline",
    marginLeft: "4px",
    transition: "color 0.2s",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(255,255,255,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    borderRadius: "16px",
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "6px solid #dbeafe",
    borderTop: "6px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default Signup;
