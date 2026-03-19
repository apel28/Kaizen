import express from "express";
import { authorize } from "../controllers/auth.controllers.js";
import { verifyAuth } from "../middleware/auth.verifier.js";

const router = express.Router();

router.post("/", authorize);

// Silent verify — frontend calls this on every page load to restore session from cookies
router.get("/", verifyAuth, (req, res) => {
    res.status(200).json({ role: req.user.role });
});

export default router;
