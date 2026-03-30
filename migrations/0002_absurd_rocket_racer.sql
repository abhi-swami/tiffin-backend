CREATE TABLE "daily_tiffin" (
	"id" serial NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "daily_tiffin_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "daily_tiffin_items" (
	"id" uuid PRIMARY KEY NOT NULL,
	"daily_tiffin_id" integer NOT NULL,
	"menu_item_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "menu_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"tiffin_id" integer,
	"order_date" timestamp DEFAULT now(),
	"payment_status" text
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "daily_tiffin_items" ADD CONSTRAINT "daily_tiffin_items_daily_tiffin_id_daily_tiffin_id_fk" FOREIGN KEY ("daily_tiffin_id") REFERENCES "public"."daily_tiffin"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_tiffin_items" ADD CONSTRAINT "daily_tiffin_items_menu_item_id_menu_items_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_tiffin_id_daily_tiffin_id_fk" FOREIGN KEY ("tiffin_id") REFERENCES "public"."daily_tiffin"("id") ON DELETE no action ON UPDATE no action;