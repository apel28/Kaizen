import express from "express";
import { verifyAuth } from "../middleware/auth.verifier.js";
import {
    getPatientsForDoctor,
    getPatientVitals,
    getPatientConditions,
    getPatientAllergies,
    getPatientMedications,
} from "../controllers/patientData.controllers.js";

const router = express.Router();

// Doctor: get all their patients
router.get("/doctor/patients",           verifyAuth, getPatientsForDoctor);

// Shared: get vitals / conditions / allergies / medications for a patient
router.get("/:patient_id/vitals",        verifyAuth, getPatientVitals);
router.get("/:patient_id/conditions",    verifyAuth, getPatientConditions);
router.get("/:patient_id/allergies",     verifyAuth, getPatientAllergies);
router.get("/:patient_id/medications",   verifyAuth, getPatientMedications);

export default router;
