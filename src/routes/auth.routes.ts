import express, { Request, Response } from "express";
import { redisClient } from "../config/session";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const router = express.Router();


const sendOTP = async (phone: string) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await redisClient.set(`phone:${phone}:otp`, otp, {
        EX: 5 * 60, // 5 minutes
    });

    console.log(`OTP for ${phone}: ${otp}`);
};

router.post("/send-otp", async (req: Request, res: Response) => {
    const { phone } = req.body;

    try {
        await sendOTP(phone);
        res.status(200).json({ message: "OTP sent" });
    } catch (error) {
        console.error("Error sending OTP", error);
        res.status(500).json({ message: "Failed to send OTP" });
    }
});

const verifyOTP = async (phone: string, otp: string) => {
    const storedOtp = await redisClient.get(`phone:${phone}:otp`);

    if (!storedOtp) return false;
    let stiringOtp = String(otp);

    if (storedOtp === stiringOtp) {
        await redisClient.del(`phone:${phone}:otp`); // one-time use
        return true;
    }

    return false;
};



interface User {
    id: string;
    phone: string;
    email: string | null;
    first_name: string | null;
    last_name: string | null;
    profile_image: string | null;
    created_at: Date | null;
}

type NewRequest = Request & {
    session: {
        userId?: string;
        authenticatedAt?: string;
    };
};


router.post("/verify-otp", async (req: NewRequest, res: Response) => {
    const { phone, otp } = req.body;

    try {
        const isValid = await verifyOTP(phone, otp);

        if (!isValid) {
            return res.status(400).json({ message: "Invalid OTP" });
        }


        let user: User = { id: "", phone: "", email: null, first_name: null, last_name: null, profile_image: null, created_at: null };

        await db.transaction(async (tx) => {
            const data = await tx.select().from(users).where(eq(users.phone, phone));

            if (data.length === 0) {
                const inserted = await tx
                    .insert(users)
                    .values({ phone })
                    .returning();

                user = inserted[0];
            } else {
                user = data[0];
            }
        });

        if (!user) {
            return res.status(500).json({ message: "User creation failed" });
        }

        await new Promise<void>((resolve, reject) => {
            req.session.regenerate((error) => {
                if (error) return reject(error);
                resolve();
            });
        });


        req.session.userId = user.id;
        req.session.authenticatedAt = new Date().toISOString();

        await new Promise<void>((resolve, reject) => {
            req.session.save((error) => {
                if (error) return reject(error);
                resolve();
            });
        });


        res.json({
            message: "Login successful",
            user,
            sessionId: req.sessionID,
        });

    } catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

export default router;