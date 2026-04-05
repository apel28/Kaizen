import express from 'express';
import { patientDashboardData } from '../controllers/dashboard.controllers.js';
import { doctorDashboardData } from '../controllers/doctorDashboard.controller.js';
import { verifyAuth } from '../middleware/auth.verifier.js';

const router = express.Router();

router.get('/', verifyAuth, async (req, res) => {
    if (req.user.role === 'P') {
        return patientDashboardData(req, res);
    } else if (req.user.role === 'D') {
        return doctorDashboardData(req, res);
    } else if (req.user.role === 'A') {
        return res.status(200).json({ role: 'A', user_id: req.user.user_id });
    } else {
        return res.status(403).json({ error: 'Invalid role' });
    }
});

export default router;

