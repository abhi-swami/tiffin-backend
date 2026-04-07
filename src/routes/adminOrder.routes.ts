import { Response } from "express";
import express from "express";
import { db } from "../db";
import {
  daily_tiffin,
  daily_tiffin_items,
  menu_items,
  orders,
  users,
} from "../db/schema";
import {
  and,
  desc,
  eq,
  inArray,
  lt,
  ne,
  or,
  SQL,
} from "drizzle-orm";
import { UserRequest } from "../utils/interfaces";

const router = express.Router();

const PAGE_SIZE = 10;

/**
 * Generic handler for admin order fetching
 */
const getOrders = async (
  req: UserRequest,
  res: Response,
  statusType: "delivered" | "rejected" | "to-be-delivered"
) => {
  try {
    const lastOrderDate = req.query.lastOrderDate as string | undefined;
    const lastOrderId = req.query.lastOrderId as string | undefined;

    let condition: SQL|undefined = undefined;

    // ---- STATUS CONDITIONS ----
    if (statusType === "delivered") {
      condition = eq(orders.order_status, "delivered");
    } else if (statusType === "rejected") {
      condition = eq(orders.order_status, "rejected");
    } else {
      // to-be-delivered = everything except delivered & rejected
      condition = and(
        ne(orders.order_status, "delivered"),
        ne(orders.order_status, "rejected")
      );
    }

    // ---- CURSOR PAGINATION ----
    if (lastOrderDate && lastOrderId) {
      condition = and(
        condition,
        or(
          lt(orders.order_date, new Date(lastOrderDate)),
          and(
            eq(orders.order_date, new Date(lastOrderDate)),
            lt(orders.id, lastOrderId)
          )
        )
      );
    }

    // ---- FETCH PAGINATED ORDERS ----
    const paginatedOrders: typeof orders.$inferSelect[] = await db
      .select()
      .from(orders)
      .where(condition)
      .orderBy(desc(orders.order_date), desc(orders.id))
      .limit(PAGE_SIZE + 1);

    const hasMore = paginatedOrders.length > PAGE_SIZE;

    const finalOrders = hasMore
      ? paginatedOrders.slice(0, PAGE_SIZE)
      : paginatedOrders;

    const orderIds = finalOrders
      .map((o) => o.id)
      .filter((id): id is string => typeof id === "string");

    if (orderIds.length === 0) {
      return res.json({
        orders: [],
        nextCursor: null,
        hasMore: false,
      });
    }

    // ---- MAP FOR ORDER PRESERVATION ----
    const orderMap = new Map(
      finalOrders.map((order, index) => [order.id, index])
    );

    // ---- FETCH FULL JOIN DATA ----
    const fullData = await db
      .select()
      .from(orders)
      .where(inArray(orders.id, orderIds))
      .leftJoin(users, eq(orders.user_id, users.id))
      .leftJoin(daily_tiffin, eq(orders.tiffin_id, daily_tiffin.id))
      .leftJoin(
        daily_tiffin_items,
        eq(daily_tiffin.id, daily_tiffin_items.daily_tiffin_id)
      )
      .leftJoin(
        menu_items,
        eq(daily_tiffin_items.menu_item_id, menu_items.id)
      );
      console.log("Full data fetched for admin orders", fullData);

    // ---- GROUPING ----
    const grouped = Object.values(
      fullData.reduce((acc, row) => {
        const orderId = row.orders.id;

        if (!acc[orderId]) {
          acc[orderId] = {
            ...row.orders,
            user: row.users ? {
              id: row.users.id,
              first_name: row.users.first_name,
              last_name: row.users.last_name,
              phone: row.users.phone,
            } : null,

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

    // ---- NEXT CURSOR ----
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
};

/**
 * ROUTES
 */

router.get("/delivered", (req, res) =>
  getOrders(req, res, "delivered")
);

router.get("/rejected", (req, res) =>
  getOrders(req, res, "rejected")
);

router.get("/to-be-delivered", (req, res) =>
  getOrders(req, res, "to-be-delivered")
);

export default router;