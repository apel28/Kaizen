import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DDashboard from "./pages/dDashboard.jsx";

import LandingPg from "./pages/landingPg.jsx";
import PDashboard from "./pages/pDashboard.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/" element={<LandingPg />} />

          {/* Patient-only route */}
          <Route
            path="/pDashboard"
            element={
              <ProtectedRoute allowedRole="P">
                <PDashboard />
              </ProtectedRoute>
            }
          />

          {/* Doctor-only route */}
          <Route
            path="/dDashboard"
            element={
              <ProtectedRoute allowedRole="D">
                <DDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all — redirect unknown URLs back to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>,
);
