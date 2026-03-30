ALTER TABLE "daily_tiffin" DROP CONSTRAINT "daily_tiffin_id_unique";--> statement-breakpoint
ALTER TABLE "daily_tiffin" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "daily_tiffin_items" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "daily_tiffin" ADD COLUMN "date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "daily_tiffin" ADD CONSTRAINT "daily_tiffin_date_unique" UNIQUE("date");