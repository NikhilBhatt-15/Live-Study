import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth.js";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const response = await login(formData);
      setIsLoading(false); // End loading
      if (response.status === 200) {
        navigate("/");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setIsLoading(false); // End loading
      console.error("Login error:", err);
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(message);
    }
  };

  return (
    <div style={styles.outerContainer}>
      <div className="heroContainer" style={styles.heroContainer}>
        {/* Hero SVG illustration */}
        <div style={styles.heroImage}>
          <svg
            width="350"
            height="350"
            viewBox="0 0 350 350"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="350" height="350" rx="32" fill="#F1F5F9" />
            <ellipse cx="175" cy="190" rx="120" ry="90" fill="#E0E7FF" />
            <rect x="80" y="130" width="190" height="110" rx="18" fill="#fff" />
            <rect
              x="100"
              y="150"
              width="150"
              height="16"
              rx="8"
              fill="#DBEAFE"
            />
            <rect
              x="100"
              y="180"
              width="110"
              height="12"
              rx="6"
              fill="#DBEAFE"
            />
            <rect
              x="100"
              y="200"
              width="70"
              height="12"
              rx="6"
              fill="#DBEAFE"
            />
            <circle cx="120" cy="230" r="14" fill="#A7F3D0" />
            <circle cx="175" cy="230" r="14" fill="#FDE68A" />
            <circle cx="230" cy="230" r="14" fill="#FCA5A5" />
            <ellipse cx="175" cy="110" rx="30" ry="30" fill="#818CF8" />
            <ellipse cx="175" cy="110" rx="20" ry="20" fill="#C7D2FE" />
            <ellipse cx="175" cy="110" rx="10" ry="10" fill="#fff" />
          </svg>
        </div>
        <h1 style={styles.heroTitle}>TeachStreaming</h1>
        <p style={styles.heroSubtitle}>
          Empower your teaching.
          <br />
          Go live. Engage the world.
        </p>
      </div>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Welcome back</h2>
            <p style={styles.cardDescription}>
              Enter your credentials to access your account
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
                <div style={styles.passwordContainer}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
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
                  <button
                    type="button"
                    style={styles.showPasswordButton}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    disabled={isLoading}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
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
                disabled={!formData.email || !formData.password || isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
              <p style={styles.toggleText}>
                Don't have an account?{" "}
                <button
                  type="button"
                  style={styles.toggleButton}
                  onClick={() => navigate("/signup")}
                  disabled={isLoading}
                >
                  Sign up
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
    position: "relative", // for loading overlay
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
  passwordContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  showPasswordButton: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#64748b",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.95rem",
    padding: "0 4px",
    transition: "color 0.2s",
  },
  errorText: {
    color: "#ef4444",
    fontSize: "0.92rem",
    marginTop: "6px",
    transition: "opacity 0.3s",
    minHeight: "18px",
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

export default Login;
