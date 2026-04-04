import express from "express";
import { verifyAuth } from "../middleware/auth.verifier.js";
import { getTestsToDoHandler, orderNowHandler } from "../controllers/testOrder.controllers.js";

const router = express.Router();

router.get("/",       verifyAuth, getTestsToDoHandler);
router.post("/order", verifyAuth, orderNowHandler);

export default router;
