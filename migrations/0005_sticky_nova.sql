ALTER TABLE "menu_items" ADD COLUMN "price" integer;--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN "image_url" varchar(1000);--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN "created_at" timestamp DEFAULT now();