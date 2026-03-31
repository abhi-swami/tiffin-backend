import express from "express";
import { Request, Response } from "express";


const otpStore = new Map<string, string>();
const router = express.Router();


const sendOTP = (phone: string) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(phone, otp);

    console.log(`OTP for ${phone}: ${otp}`);
    return true;
}

const verifyOTP = (phone: string, otp: string) => {
    const validOtp = otpStore.get(phone)?.toString();
    const stringOtp = otp.toString();
    return validOtp === stringOtp;
}



router.post("/send-otp", (req: Request, res: Response) => {
    const { phone } = req.body;

    sendOTP(phone);

    res.json({ message: "OTP sent" });
});



router.post("/verify-otp", async (req: Request, res: Response) => {
    const { phone, otp } = req.body;
    console.log(`Verifying OTP for ${phone}: ${otp}`);

    const isValid = verifyOTP(phone, otp);

    if (!isValid) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    await new Promise<void>((resolve, reject) => {
        req.session.regenerate((error) => {
            if (error) {
                reject(error);
                return;
            }

            resolve();
        });
    });

    req.session.user = { phone };
    req.session.authenticatedAt = new Date().toISOString();

    await new Promise<void>((resolve, reject) => {
        req.session.save((error) => {
            if (error) {
                reject(error);
                return;
            }

            resolve();
        });
    });

    res.json({
        message: "Login successful",
        sessionId: req.sessionID,
        user: req.session.user,
    });
});

export default router;