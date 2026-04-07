ALTER TABLE "orders" ALTER COLUMN "order_status" SET DATA TYPE "public"."order_status_enum";--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "order_status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "order_status" SET NOT NULL;