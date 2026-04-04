import express from "express";
import { verifyAuth } from "../middleware/auth.verifier.js";
import { getTestReportsListHandler, getTestReportFileHandler } from "../controllers/testReport.controllers.js";

const router = express.Router();

router.get("/", verifyAuth, getTestReportsListHandler);
router.post("/download", verifyAuth, getTestReportFileHandler); // POST because report_id is expected in req.body

export default router;
