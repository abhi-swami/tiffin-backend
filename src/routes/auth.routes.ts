import express from "express";
import { sendOtpHandler, verifyOtpHandler } from "../controllers/auth.controller";

const router = express.Router();

router.post("/send-otp", sendOtpHandler);
router.post("/verify-otp", verifyOtpHandler);

export default router;