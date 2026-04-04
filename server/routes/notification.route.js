import express from "express";
import { verifyAuth } from "../middleware/auth.verifier.js";
import { getNotificationsHandler } from "../controllers/notification.controllers.js";

const router = express.Router();

router.get("/", verifyAuth, getNotificationsHandler);

export default router;
