import { Request, Response } from "express";
import { sendOTP, verifyOTP } from "../services/auth.service";
import jwt from "jsonwebtoken";

export const sendOtpHandler = (req: Request, res: Response) => {
  const { phone } = req.body;

  sendOTP(phone);

  res.json({ message: "OTP sent" });
};

export const verifyOtpHandler = (req: Request, res: Response) => {
  const { phone, otp } = req.body;

  const isValid = verifyOTP(phone, otp);

  if (!isValid) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const token = jwt.sign({ phone }, process.env.JWT_SECRET!);

  res.json({ token });
};