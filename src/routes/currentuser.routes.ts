import { Response } from "express";
import express from "express";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from 'drizzle-orm';
import { UserRequest } from "../utils/interfaces";

const router = express.Router();


router.get("/", async (req: UserRequest, res: Response) => {
  try {
    const userId = req.session.userId;


    const user = await db
      .select({
        id: users.id,
        phone: users.phone,
        email: users.email,
        first_name: users.first_name,
        last_name: users.last_name,
        profile_image: users.profile_image,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: user[0],
    });

  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({ message: "Failed to get current user" });
  }
});

export default router;