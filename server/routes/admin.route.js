import express from "express";
import { verifyAuth } from "../middleware/auth.verifier.js";
import { requireAdmin } from "../middleware/admin.verifier.js";
import { executeAdminQuery, registerAdmin } from "../controllers/admin.controllers.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/query", verifyAuth, requireAdmin, executeAdminQuery);

export default router;
