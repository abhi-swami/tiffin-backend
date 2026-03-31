import express, { Request, Response } from "express";
import { redisClient } from "../config/session";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { UserRequest } from "../utils/interfaces";

const router = express.Router();


const checkSendOtpLimit = async (phone: string) => {
  const key = `otp:send:${phone}`;

  const count = await redisClient.incr(key);

  if (count === 1) {
    await redisClient.expire(key, 300); // 5 min
  }

  return count <= 3;
};

const checkVerifyOtpLimit = async (phone: string) => {
  const key = `otp:verify:${phone}`;

  const count = await redisClient.incr(key);

  if (count === 1) {
    await redisClient.expire(key, 300); // 5 min
  }

  return count <= 5;
};


const sendOTP = async (phone: string) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await redisClient.set(`phone:${phone}:otp`, otp, {
    EX: 5 * 60,
  });

  console.log(`OTP for ${phone}: ${otp}`);
};

const verifyOTP = async (phone: string, otp: string) => {
  const storedOtp = await redisClient.get(`phone:${phone}:otp`);

  if (!storedOtp) return false;

  if (storedOtp === otp) {
    await redisClient.del(`phone:${phone}:otp`);
    await redisClient.del(`otp:verify:${phone}`); // reset attempts
    return true;
  }

  return false;
};



type User = typeof users.$inferSelect;



router.post("/send-otp", async (req: Request, res: Response) => {
  const { phone } = req.body;


  if (!phone || typeof phone !== "string") {
    return res.status(400).json({ message: "Invalid phone number or type of phone is not a string" });
  }

  try {
    const allowed = await checkSendOtpLimit(phone);

    if (!allowed) {
      return res.status(429).json({
        message: "Too many OTP requests. Try again later.",
      });
    }

    await sendOTP(phone);

    res.json({ message: "OTP sent" });

  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});



router.post("/verify-otp", async (req: UserRequest, res: Response) => {
  const { phone, otp } = req.body;


  if (!phone || typeof phone !== "string") {
    return res.status(400).json({ message: "Invalid phone number or type of phone is not a string" });
  }

  if (!otp || typeof otp !== "string") {
    return res.status(400).json({ message: "Invalid OTP or type of OTP is not a string" });
  }

  try {
    
    const allowed = await checkVerifyOtpLimit(phone);

    if (!allowed) {
      return res.status(429).json({
        message: "Too many attempts. Try again later.",
      });
    }


    const isValid = await verifyOTP(phone, otp);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    let user: User  = null as unknown as User;

    await db.transaction(async (tx) => {
      const existing:User[] = await tx
        .select()
        .from(users)
        .where(eq(users.phone, phone));

      user = existing[0] as User;

      if (!user) {
        const inserted = await tx
          .insert(users)
          .values({ phone })
          .returning();

        user = inserted[0] as User;
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

    await new Promise<void>((resolve, reject) => {
      req.session.save((error) => {
        if (error) return reject(error);
        resolve();
      });
    });


    res.json({
      message: "Login successful",
      user,
      session_id: req.sessionID,
    });

  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;