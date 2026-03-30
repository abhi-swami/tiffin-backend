import { pgTable, uuid, text, date, integer, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  phone: text("phone").notNull().unique(),
  email: text("email").unique(),
  first_name:varchar("first_name",{length:100}).notNull(),
  last_name:varchar("last_name",{length:100}).notNull(),
  profile_image:varchar("profile_image",{length:1000})
});
