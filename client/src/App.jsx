import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import HomePage from "./pages/Home/HomePage.jsx";
import VideoPage from "./pages/Video/VideoPage.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Login from "./pages/Signup/Login.jsx";
import Signup from "./pages/Signup/Signup.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

import PrivateRoute from "./components/PrivateRoute.jsx";
function App() {
  const location = useLocation();

  // Define routes where the Navbar should not be displayed
  const hideNavbarRoutes = ["/login", "/signup"];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/video/:id" element={<VideoPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function RootApp() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
}
