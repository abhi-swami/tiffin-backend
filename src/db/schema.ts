import { pgTable, uuid, text, date, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  phone: text("phone").notNull().unique(),
});

export const menus = pgTable("menus", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: date("date").notNull().unique(),
  items: text("items").notNull(), // JSON string
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  date: date("date").notNull(),
  status: text("status").default("pending"),
  totalAmount: integer("total_amount"),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull(),
  itemName: text("item_name"),
  quantity: integer("quantity"),
});