import express from "express";
import { register } from "../controllers/register.controllers.js";

const router = express.Router();

router.post("/", register); //check index, already link for /api/register, no need for additional linking

export default router;
