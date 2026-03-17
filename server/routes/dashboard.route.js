import express from 'express';
import { patientDashboardData } from '../controllers/dashboard.controllers.js';
// import { doctorDashboardData } from '../controllers/doctor.controllers.js'; // Uncomment when created
import { verifyAuth } from '../middleware/auth.verifier.js';

const router = express.Router();

// Single dashboard route that handles both roles
router.get('/', verifyAuth, async (req, res) => {

    console.log("Hello")

    if (req.user.role === 'P') {
        return patientDashboardData(req, res);
    } else if (req.user.role === 'D') {
        // return doctorDashboardData(req, res); // Implement doctor dashboard
        return res.json({ message: 'Doctor dashboard not implemented yet' });
    } else {
        return res.status(403).json({ error: 'Invalid role' });
    }
});

export default router;

