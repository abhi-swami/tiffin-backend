import { Request, Response } from "express";
import express from "express";
import { db } from "../db";
import { daily_tiffin, daily_tiffin_items, menu_items, orders } from "../db/schema";
import { and, eq, gt, inArray, or, SQL } from "drizzle-orm";
import { UserRequest } from "../utils/interfaces";


const router = express.Router();

router.get("/", async (req: UserRequest, res) => {
  try {

    let lastOrderDate = req.query.lastOrderDate as string | undefined;
    let lastOrderId = req.query.lastOrderDate as string | undefined;

    const page_size = 10;

    if (!req.session?.userId) {
      return res.status(400).json({ message: "User ID is required in session" });
    }

    let baseQuery = db.select().from(orders).where(eq(orders.user_id, req.session?.userId || ""));

    const conditions: SQL[] = [];

    if (lastOrderDate && lastOrderId) {
      const cursorCondition = or(
        gt(orders.order_date, new Date(lastOrderDate)),
        and(
          eq(orders.order_date, new Date(lastOrderDate)),
          gt(orders.id, lastOrderId)
        )
      );

      if (cursorCondition) {
        conditions.push(cursorCondition);
      }
    }
    const paginatedOrders = await baseQuery
      .orderBy(orders.order_date, orders.id)
      .limit(page_size);

    const orderIds = paginatedOrders.map((order) => order.id);

    if (orderIds.length === 0) {
      return res.json({
        data: [],
        nextCursor: null,
        hasMore: false,
      });
    }

    const fullData = await db
      .select()
      .from(orders)
      .where(inArray(orders.id, orderIds))
      .leftJoin(daily_tiffin, eq(orders.tiffin_id, daily_tiffin.id))
      .leftJoin(
        daily_tiffin_items,
        eq(daily_tiffin.id, daily_tiffin_items.daily_tiffin_id)
      )
      .leftJoin(menu_items, eq(daily_tiffin_items.menu_item_id, menu_items.id));

    const lastItem = paginatedOrders[paginatedOrders.length - 1];

    const nextCursor = {
      lastOrderDate: lastItem.order_date,
      lastOrderId: lastItem.id,
    };

    const hasMore = paginatedOrders.length === page_size;


    const grouped = Object.values(
      fullData.reduce((acc, row) => {
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

    res.status(200).json({
      message: "Order route is working",
      orders: grouped,
      nextCursor,
      hasMore
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
})

export default router;