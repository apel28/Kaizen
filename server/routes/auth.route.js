
import express from "express";
import { authorize } from "../controllers/auth.controllers.js";
import { verifyAuth } from "../middleware/auth.verifier.js";
import { aiDiagnosisNotification } from "../utils/runAIdiagnostics.js";


const router = express.Router();

// Patient login: run authorize, then AI diagnosis middleware
router.post("/", async (req, res, next) => {
    // Call authorize, then run AI diagnosis if patient
    await authorize(req, res);
    // If login was successful, req.body will have email/password, but response is already sent
    // So, re-query user_id and role from response if needed
    if (res.statusCode === 200 && res.locals && res.locals.user_id && res.locals.role === 'P') {
        const user_id = res.locals.user_id
        aiDiagnosisNotification(user_id);
    }
});

// Silent verify — frontend calls this on every page load to restore session from cookies

router.get("/", verifyAuth, (req, res) => {
    res.status(200).json({ role: req.user.role });
});

export default router;
