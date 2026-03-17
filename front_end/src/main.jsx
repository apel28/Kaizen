import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import LandingPg from "./pages/landingPg.jsx";
import PDashboard from "./pages/pDashboard.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPg />} />
        <Route path="/pDashboard" element={<PDashboard />} />
      </Routes>
    </Router>
  </StrictMode>,
);
