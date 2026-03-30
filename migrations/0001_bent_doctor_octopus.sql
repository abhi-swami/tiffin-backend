ALTER TABLE "menus" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "order_items" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "orders" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "menus" CASCADE;--> statement-breakpoint
DROP TABLE "order_items" CASCADE;--> statement-breakpoint
DROP TABLE "orders" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "first_name" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_name" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profile_image" varchar(1000);--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");