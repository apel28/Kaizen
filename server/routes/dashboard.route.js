import express from 'express';
import { patientDashboardData } from '../controllers/dashboard.controllers.js';
import { doctorDashboardData } from '../controllers/doctorDashboard.controller.js';
import { verifyAuth } from '../middleware/auth.verifier.js';

const router = express.Router();

// Single dashboard route that handles both roles
router.get('/', verifyAuth, async (req, res) => {
    if (req.user.role === 'P') {
        return patientDashboardData(req, res);
    } else if (req.user.role === 'D') {
        return doctorDashboardData(req, res);
    } else {
        return res.status(403).json({ error: 'Invalid role' });
    }
});

export default router;

