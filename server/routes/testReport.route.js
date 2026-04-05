import express from "express";
import { verifyAuth } from "../middleware/auth.verifier.js";
import { getTestReportsListHandler, getTestReportFileHandler } from "../controllers/testReport.controllers.js";

const router = express.Router();

router.get("/", verifyAuth, getTestReportsListHandler);
router.post("/download", verifyAuth, getTestReportFileHandler); 

export default router;
