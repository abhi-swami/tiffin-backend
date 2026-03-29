CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"mobile_number" varchar(10) NOT NULL,
	"created_at" "cal::local_datetime" DEFAULT now()
);
