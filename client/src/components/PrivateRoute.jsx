import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />; // Or a spinner
  return user ? children : <Navigate to="/login" replace />;
}

const Spinner = () => (
  <div style={{ textAlign: "center", marginTop: "20px" }}>
    <p>Loading...</p>
  </div>
);
