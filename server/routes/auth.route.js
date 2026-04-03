
import express from "express";
import { authorize } from "../controllers/auth.controllers.js";
import { verifyAuth } from "../middleware/auth.verifier.js";
import { aiDiagnosisNotification } from "../middleware/aiDiagnosis.middleware.js";


const router = express.Router();

// Patient login: run authorize, then AI diagnosis middleware
router.post("/", async (req, res, next) => {
    // Call authorize, then run AI diagnosis if patient
    await authorize(req, res);
    // If login was successful, req.body will have email/password, but response is already sent
    // So, re-query user_id and role from response if needed
    if (res.statusCode === 200 && res.locals && res.locals.user_id && res.locals.role === 'patient') {
        req.body.user_id = res.locals.user_id;
        req.body.role = 'P';
        await aiDiagnosisNotification(req, res, () => {});
    }
});

// Silent verify — frontend calls this on every page load to restore session from cookies

router.get("/", verifyAuth, (req, res) => {
    res.status(200).json({ role: req.user.role });
});

export default router;
