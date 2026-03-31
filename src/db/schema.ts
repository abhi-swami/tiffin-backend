import { pgTable, uuid, text, date, integer, varchar, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { create } from "node:domain";

export const users = pgTable("users", {
  id: uuid('id').defaultRandom().primaryKey(),
  phone: text('phone').notNull().unique(),
  email: text('email').unique(),
  first_name: varchar('first_name', { length: 100 }),
  last_name: varchar('last_name', { length: 100 }),
  profile_image: varchar('profile_image', { length: 1000 }),
  created_at: timestamp('created_at').defaultNow(),
});

export const menu_items = pgTable('menu_items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().notNull(),
  description: text('description'),
  price: integer('price'),
  image_url: varchar('image_url', { length: 1000 }),
  created_at: timestamp('created_at').defaultNow(),
  is_deleted: boolean('is_deleted').default(false),

});

export const daily_tiffin = pgTable("daily_tiffin", {
  id: serial('id').primaryKey(),
  date: date('date').notNull().unique(),
  created_at: timestamp('created_at').defaultNow(),
});

export const daily_tiffin_items = pgTable("daily_tiffin_items", {
  id: uuid("id").defaultRandom().primaryKey(),

  daily_tiffin_id: integer('daily_tiffin_id')
    .references(() => daily_tiffin.id)
    .notNull(),

  menu_item_id: integer('menu_item_id')
    .references(() => menu_items.id)
    .notNull(),
});

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),

  user_id: uuid('user_id')
    .references(() => users.id),

  tiffin_id: integer('tiffin_id')
    .references(() => daily_tiffin.id),

  order_date: timestamp('order_date').defaultNow(),
  payment_status: text('payment_status'),
});