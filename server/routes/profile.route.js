import express from "express";
import { getPatientProfile, updatePatientProfile } from "../controllers/patientProfile.controllers.js";
import { getDoctorProfile, updateDoctorProfile } from "../controllers/doctorProfile.controllers.js";
import { verifyAuth } from "../middleware/auth.verifier.js";
import pool from "../db.js";

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

router.delete('/', verifyAuth, async (req, res) => {
    try {
        await pool.query('CALL delete_user_everywhere($1)', [req.user.user_id]);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

export default router;
