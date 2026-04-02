import { Request, Response } from "express";
import express from "express";
import { db } from "../db";
import { daily_tiffin, daily_tiffin_items, menu_items, orders } from "../db/schema";
import { eq } from "drizzle-orm";
import { UserRequest } from "../utils/interfaces";


const router = express.Router();

router.get("/", async (req: UserRequest, res) => {
    try {
      
      if(!req.session?.userId){
        return res.status(400).json({ message: "User ID is required in session" });
      }

        const result = await db
                      .select()
                      .from(orders)
                      .where(eq(orders.user_id, req.session?.userId || ""))
                      .leftJoin(daily_tiffin, eq(orders.tiffin_id, daily_tiffin.id))
                      .leftJoin(
                        daily_tiffin_items,
                        eq(daily_tiffin.id, daily_tiffin_items.daily_tiffin_id)
                      )
                      .leftJoin(menu_items, eq(daily_tiffin_items.menu_item_id, menu_items.id));



const grouped = Object.values(
  result.reduce((acc, row) => {
    const orderId = row.orders.id;

    if (!acc[orderId]) {
      acc[orderId] = {
        ...row.orders,
        tiffin: {
          ...row.daily_tiffin,
          items: [],
        },
      };
    }

    // push menu item
    if (row.menu_items) {
      acc[orderId].tiffin.items.push(row.menu_items);
    }

    return acc;
  }, {} as Record<string, any>)
);

        // console.log("User Orders:", grouped, 'userId', req.session?.userId);

        res.status(200).json({ message: "Order route is working", orders: grouped });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
})

export default router;