import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom, #f9fafb, #f3f4f6 30%)",
        padding: 16,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              borderRadius: "9999px",
              background: "#f3f4f6",
              padding: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Simple Alert Icon */}
            <svg
              width={48}
              height={48}
              fill="none"
              viewBox="0 0 24 24"
              stroke="#f59e42"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M21 19a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14z"
              />
            </svg>
          </div>
        </div>
        <h1 style={{ fontSize: 48, fontWeight: "bold", marginBottom: 16 }}>
          404
        </h1>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
          Page not found
        </h2>
        <p style={{ color: "#6b7280", marginBottom: 32 }}>
          The page you're looking for doesn't exist or has been moved. Check the
          URL or navigate back to the home page.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "center",
          }}
        >
          <Link
            to="/"
            style={{
              padding: "10px 24px",
              background: "#1d4ed8",
              color: "#fff",
              borderRadius: 6,
              textDecoration: "none",
              fontWeight: 500,
              marginBottom: 4,
              border: "none",
            }}
          >
            Back to Home
          </Link>
          <Link
            to="/dashboard"
            style={{
              padding: "10px 24px",
              background: "#fff",
              color: "#1d4ed8",
              border: "1px solid #1d4ed8",
              borderRadius: 6,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
