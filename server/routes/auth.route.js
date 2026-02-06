import express from "express";
import { authorize } from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/", authorize);

export default router;
