import express from "express";
import { getDoctorQualifications, addDoctorQualification, removeDoctorQualification } from "../controllers/qualification.controllers.js";
import { verifyAuth } from "../middleware/auth.verifier.js";

const router = express.Router();

router.get('/', verifyAuth, getDoctorQualifications);

router.post('/', verifyAuth, addDoctorQualification);

router.delete('/', verifyAuth, removeDoctorQualification);

export default router;