import express from "express";
import { verifyAuth } from "../middleware/auth.verifier.js";
import {
    getPatientsForDoctor,
    getPatientVitals,
    getPatientConditions,
    getPatientAllergies,
    getPatientMedications,
    deletePatientMedications,
    getPatientBills,
} from "../controllers/patientData.controllers.js";

const router = express.Router();


router.get("/doctor/patients", verifyAuth, getPatientsForDoctor);

router.get("/:patient_id/vitals",        verifyAuth, getPatientVitals);
router.get("/:patient_id/conditions",    verifyAuth, getPatientConditions);
router.get("/:patient_id/allergies",     verifyAuth, getPatientAllergies);
router.get("/:patient_id/medications",   verifyAuth, getPatientMedications);
router.delete("/:patient_id/medications/:medicine_id", verifyAuth, deletePatientMedications);
router.get("/bills",                     verifyAuth, getPatientBills);

export default router;
