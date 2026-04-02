import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DDashboard from "./pages/dDashboard.jsx";
import DoctorProfile from "./pages/doctorProfile.jsx";
import Experience from "./pages/Experience.jsx"
import Qualification from "./pages/Qualification.jsx"
import Prescription from "./pages/Prescription.jsx"
import Availability from "./pages/Availability.jsx"

import LandingPg from "./pages/landingPg.jsx";
import PDashboard from "./pages/pDashboard.jsx";
import PatientProfile from "./pages/patientProfile.jsx";
import Appointment from "./pages/Appointment.jsx";
import PatientVitals from "./pages/PatientVitals.jsx";
import DoctorPatientVitals from "./pages/DoctorPatientVitals.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/" element={<LandingPg />} />

          {/* Patient-only route */}
          <Route
            path="/PatientDashboard"
            element={
              <ProtectedRoute allowedRole="P">
                <PDashboard />
              </ProtectedRoute>
            }
          />

          {/* Patient profile route */}
          <Route
            path="/PatientDashboard/Profile"
            element={
              <ProtectedRoute allowedRole="P">
                <PatientProfile />
              </ProtectedRoute>
            }
          />

          {/* Patient appointment route */}
          <Route
            path="/Appointment"
            element={
              <ProtectedRoute allowedRole="P">
                <Appointment />
              </ProtectedRoute>
            }
          />

          {/* Doctor-only route */}
          <Route
            path="/DoctorDashboard"
            element={
              <ProtectedRoute allowedRole="D">
                <DDashboard />
              </ProtectedRoute>
            }
          />

          {/* Doctor profile route — placeholder until page is built */}
          <Route
            path="/DoctorDashboard/Profile"
            element={
              <ProtectedRoute allowedRole="D">
                <DoctorProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/DoctorDashboard/Profile/Experience"
            element={
              <ProtectedRoute allowedRole="D">
                <Experience />
              </ProtectedRoute>
            }
          />

          <Route
            path="/DoctorDashboard/Profile/Qualification"
            element={
              <ProtectedRoute allowedRole="D">
                <Qualification />
              </ProtectedRoute>
            }
          />

          <Route
            path="/DoctorDashboard/Prescription"
            element={
              <ProtectedRoute allowedRole="D">
                <Prescription />
              </ProtectedRoute>
            }
          />

          <Route
            path="/DoctorDashboard/Availability"
            element={
              <ProtectedRoute allowedRole="D">
                <Availability />
              </ProtectedRoute>
            }
          />

          <Route
            path="/DoctorDashboard/PatientVitals"
            element={
              <ProtectedRoute allowedRole="D">
                <DoctorPatientVitals />
              </ProtectedRoute>
            }
          />

          <Route
            path="/PatientDashboard/Vitals"
            element={
              <ProtectedRoute allowedRole="P">
                <PatientVitals />
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
