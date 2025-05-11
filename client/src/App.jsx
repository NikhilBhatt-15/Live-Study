import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import HomePage from "./pages/Home/HomePage.jsx";
import VideoPage from "./pages/Video/VideoPage.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import SignIn from "./pages/Signup/Signup.jsx";

function App() {
  const location = useLocation();

  // Define routes where the Navbar should not be displayed
  const hideNavbarRoutes = ["/login"];

  return (
    <>
      {/* Conditionally render Navbar */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/video/:id" element={<VideoPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default function RootApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
