import express from "express";
import { getDoctorExperience, addDoctorExperience, removeDoctorExperience } from "../controllers/experience.controllers.js";
import { verifyAuth } from "../middleware/auth.verifier.js";

const router = express.Router();

router.get('/', verifyAuth, getDoctorExperience);

router.post('/', verifyAuth, addDoctorExperience);

router.delete('/', verifyAuth, removeDoctorExperience);

export default router;