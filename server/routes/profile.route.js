import express from "express";
import { getPatientProfile, updatePatientProfile } from "../controllers/patientProfile.controllers.js";
import { getDoctorProfile, updateDoctorProfile } from "../controllers/doctorProfile.controllers.js";
import { verifyAuth } from "../middleware/auth.verifier.js";

const router = express.Router();

router.get('/', verifyAuth, async (req, res) => {
    if (req.user.role === 'P') {
        return getPatientProfile(req, res);
    } else if (req.user.role === 'D') {
        return getDoctorProfile(req, res);
    } else {
        return res.status(403).json({ error: 'Invalid role' });
    }
});

router.put('/', verifyAuth, async (req, res) => {
    if (req.user.role === 'P') {
        return updatePatientProfile(req, res);
    } else if (req.user.role === 'D') {
        return updateDoctorProfile(req, res);
    } else {
        return res.status(403).json({ error: 'Invalid role' });
    }
});

export default router;
