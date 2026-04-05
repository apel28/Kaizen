
import express from "express";
import { authorize } from "../controllers/auth.controllers.js";
import { verifyAuth } from "../middleware/auth.verifier.js";
import { aiDiagnosisNotification } from "../utils/runAIdiagnostics.js";


const router = express.Router();


router.post("/", async (req, res, next) => {

    await authorize(req, res);
    if (res.statusCode === 200 && res.locals && res.locals.user_id && res.locals.role === 'P') {
        const user_id = res.locals.user_id
        aiDiagnosisNotification(user_id);
    }
});


router.get("/", verifyAuth, (req, res) => {
    res.status(200).json({ role: req.user.role });
});

export default router;
