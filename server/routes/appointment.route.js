import express from "express";
import { verifyAuth } from "../middleware/auth.verifier.js";
import {
    getDepartmentsHandler,
    getDoctorsHandler,
    getSlotsHandler,
    getAppointmentsHandler,
    bookAppointmentHandler,
    cancelAppointmentHandler,
} from "../controllers/appointment.controllers.js";

const router = express.Router();

router.get("/departments", getDepartmentsHandler);
router.get("/doctors", getDoctorsHandler);
router.get("/slots", getSlotsHandler);
router.get("/", verifyAuth, getAppointmentsHandler);
router.post("/", verifyAuth, bookAppointmentHandler);
router.delete("/:appId", verifyAuth, cancelAppointmentHandler);

export default router;
