import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      alert("Please fill in all required fields");
      return;
    }

    if (isLogin) {
      // Login functionality
      alert("Login successful!");
      navigate("/");
    } else {
      // Signup functionality
      alert("Account created successfully!");
      setIsLogin(true);
      setAvatarPreview(null);
    }
  };

  const toggleView = () => {
    setIsLogin(!isLogin);
    setAvatarPreview(null); // Reset avatar preview when switching views
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>
            {isLogin ? "Welcome back" : "Create an account"}
          </h2>
          <p style={styles.cardDescription}>
            {isLogin
              ? "Enter your credentials to access your account"
              : "Enter your information to create an account"}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={styles.cardContent}>
            {!isLogin && (
              <>
                {/* Profile picture upload */}
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
                    style={styles.input}
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                style={styles.input}
                value={formData.email}
                onChange={handleChange}
              />
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
                  style={styles.input}
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  style={styles.showPasswordButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>
          <div style={styles.cardFooter}>
            <button type="submit" style={styles.submitButton}>
              {isLogin ? "Sign In" : "Create Account"}
            </button>
            <p style={styles.toggleText}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                style={styles.toggleButton}
                onClick={toggleView}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    padding: "16px",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    padding: "24px",
  },
  cardHeader: {
    textAlign: "center",
    marginBottom: "16px",
  },
  cardTitle: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: "14px",
    color: "#6b7280",
  },
  cardContent: {
    marginBottom: "16px",
  },
  inputGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "8px 12px",
    fontSize: "14px",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
  },
  passwordContainer: {
    position: "relative",
  },
  showPasswordButton: {
    position: "absolute",
    right: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#6b7280",
    cursor: "pointer",
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
    fontSize: "24px",
    fontWeight: "bold",
    color: "#374151",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarFallback: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#374151",
  },
  fileInput: {
    display: "none",
  },
  uploadButton: {
    marginTop: "8px",
    fontSize: "14px",
    color: "#1d4ed8",
    cursor: "pointer",
  },
  cardFooter: {
    textAlign: "center",
  },
  submitButton: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#1d4ed8",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  toggleText: {
    fontSize: "14px",
    color: "#6b7280",
    marginTop: "16px",
  },
  toggleButton: {
    background: "none",
    border: "none",
    color: "#1d4ed8",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default SignIn;
