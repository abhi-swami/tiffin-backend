import { Request, Response } from "express";
import express from "express";
import { db } from "../db";
import { orders } from "../db/schema";
import { eq } from "drizzle-orm";
import { UserRequest } from "../utils/interfaces";


const router = express.Router();


router.post("/", async (req: UserRequest, res) => {
    console.log("Received new order request with body:", req.body, 'userId', req.session?.userId);
    const { tiffin_id } = req.body;
    console.log("Received new order request with tiffin_id:", tiffin_id, 'userId', req.session?.userId);
    try {
        const newOrder = await db.insert(orders).values({
            user_id: req.session?.userId || "",
            tiffin_id,
            payment_status: "pending",
        }).returning()

        console.log("User Orders:", newOrder, 'userId', req.session?.userId);

        res.status(200).json({ message: "Order Created Successfully", orders: newOrder });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
})


export default router;