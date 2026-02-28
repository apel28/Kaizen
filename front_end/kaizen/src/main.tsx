import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import LandingPg from "./landingPg.tsx";
import PatientDash from "./patientDash.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PatientDash />
  </StrictMode>,
);
