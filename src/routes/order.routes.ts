import { Request, Response } from "express";
import express from "express";
import { db } from "../db";
import { orders } from "../db/schema";
import { eq } from "drizzle-orm";
import { UserRequest } from "../utils/interfaces";


const router = express.Router();

router.get("/", async (req: UserRequest, res) => {
    try {
        const userOrders = await db.select()
                                .from(orders)
                                .where(eq(orders.user_id, req.session?.userId || ""));

        console.log("User Orders:", userOrders, 'userId', req.session?.userId);

        res.status(200).json({ message: "Order route is working", orders: userOrders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
})

export default router;