import { Request, Response } from "express";
import express from "express";
import { db } from "../db";
import {
  daily_tiffin,
  daily_tiffin_items,
  menu_items,
  orders,
} from "../db/schema";
import { and, desc, eq, inArray, lt, or, SQL } from "drizzle-orm";
import { UserRequest } from "../utils/interfaces";

const router = express.Router();

router.get("/", async (req: UserRequest, res: Response) => {
  try {
    const page_size = 10;

    const lastOrderDate = req.query.lastOrderDate as string | undefined;
    const lastOrderId = req.query.lastOrderId as string | undefined;

    if (!req.session?.userId) {
      return res
        .status(400)
        .json({ message: "User ID is required in session" });
    }


    let query: any = null;

    if (lastOrderDate && lastOrderId) {
      query = db
        .select()
        .from(orders).where(
          and(
            eq(orders.user_id, req.session.userId),
            or(
              lt(orders.order_date, new Date(lastOrderDate)),
              and(
                eq(orders.order_date, new Date(lastOrderDate)),
                lt(orders.id, lastOrderId)
              )
            )
          )
        );
    } else {
      query = db
        .select()
        .from(orders)
        .where(eq(orders.user_id, req.session.userId))
        .orderBy(desc(orders.order_date));
    }

    const paginatedOrders: typeof orders.$inferInsert[] = await query
      .orderBy(desc(orders.order_date), desc(orders.id))
      .limit(page_size + 1);

    const hasMore = paginatedOrders.length > page_size;

    const finalOrders = hasMore
      ? paginatedOrders.slice(0, page_size)
      : paginatedOrders;

    const orderIds = finalOrders
      .map((order) => order.id)
      .filter((id): id is string => typeof id === "string");

    if (orderIds.length === 0) {
      return res.json({
        orders: [],
        nextCursor: null,
        hasMore: false,
      });
    }

    const orderMap = new Map(
      finalOrders.map((order, index) => [order.id, index])
    );

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

    const grouped = Object.values(
      fullData.reduce((acc, row) => {
        const orderId = row.orders.id;

        if (!acc[orderId]) {
          acc[orderId] = {
            ...row.orders,
            tiffin: row.daily_tiffin
              ? { ...row.daily_tiffin, items: [] }
              : null,
          };
        }

        if (row.menu_items && acc[orderId].tiffin) {
          acc[orderId].tiffin.items.push(row.menu_items);
        }

        return acc;
      }, {} as Record<string, any>)
    ).sort((a, b) => {
      return orderMap.get(a.id)! - orderMap.get(b.id)!;
    });

    // ✅ Next cursor
    const lastItem = finalOrders[finalOrders.length - 1];

    const nextCursor = lastItem
      ? {
        lastOrderDate: lastItem.order_date,
        lastOrderId: lastItem.id,
      }
      : null;

    return res.status(200).json({
      orders: grouped,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;