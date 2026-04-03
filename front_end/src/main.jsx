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
import DoctorPatientConditions from "./pages/DoctorPatientConditions.jsx";
import PatientConditions from "./pages/PatientConditions.jsx";
import PatientAllergies from "./pages/PatientAllergies.jsx";
import DoctorPatientAllergies from "./pages/DoctorPatientAllergies.jsx";
import PatientMedications from "./pages/PatientMedications.jsx";
import DoctorPatientMedications from "./pages/DoctorPatientMedications.jsx";
import PatientPrescriptions from "./pages/PatientPrescriptions.jsx";
import DoctorPatientPrescriptions from "./pages/DoctorPatientPrescriptions.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

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

          <Route
            path="/DoctorDashboard/PatientConditions"
            element={
              <ProtectedRoute allowedRole="D">
                <DoctorPatientConditions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/PatientDashboard/Conditions"
            element={
              <ProtectedRoute allowedRole="P">
                <PatientConditions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/PatientDashboard/Allergies"
            element={
              <ProtectedRoute allowedRole="P">
                <PatientAllergies />
              </ProtectedRoute>
            }
          />

          <Route
            path="/DoctorDashboard/PatientAllergies"
            element={
              <ProtectedRoute allowedRole="D">
                <DoctorPatientAllergies />
              </ProtectedRoute>
            }
          />

          <Route
            path="/PatientDashboard/Medications"
            element={
              <ProtectedRoute allowedRole="P">
                <PatientMedications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/DoctorDashboard/PatientMedications"
            element={
              <ProtectedRoute allowedRole="D">
                <DoctorPatientMedications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/PatientDashboard/Prescriptions"
            element={
              <ProtectedRoute allowedRole="P">
                <PatientPrescriptions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/DoctorDashboard/PatientPrescriptions"
            element={
              <ProtectedRoute allowedRole="D">
                <DoctorPatientPrescriptions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/AdminDashboard"
            element={
              <ProtectedRoute allowedRole="A">
                <AdminDashboard />
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
