import express from "express";
import { verifyAuth } from "../middleware/auth.verifier.js";
import {
    addPrescription,
    getAllMedicines,
    getAllTests,
    getTodaysPatients,
    getDepartments,
    getPrescriptionByVisitId,
} from "../controllers/prescription.controllers.js";

const router = express.Router();

router.get("/patients/today", verifyAuth, getTodaysPatients);
router.get("/medicines",      verifyAuth, getAllMedicines);
router.get("/tests",          verifyAuth, getAllTests);
router.get("/departments",    verifyAuth, getDepartments);
router.get("/:visit_id",      verifyAuth, getPrescriptionByVisitId);
router.post("/",              verifyAuth, addPrescription);

export default router;
