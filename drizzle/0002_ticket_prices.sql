CREATE TABLE "ticket_prices" (
	"id" serial PRIMARY KEY NOT NULL,
	"route_key" varchar(160) NOT NULL,
	"origin" varchar(100) NOT NULL,
	"destination" varchar(100) NOT NULL,
	"flight_type" varchar(20) DEFAULT 'reguler' NOT NULL,
	"operating_days" text[] NOT NULL,
	"price" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX "ticket_prices_route_type_unique"
ON "ticket_prices" USING btree ("route_key","flight_type");

INSERT INTO "ticket_prices"
	("route_key", "origin", "destination", "flight_type", "operating_days", "price", "is_active")
VALUES
	('kupang-sabu', 'Kupang', 'Sabu', 'reguler', ARRAY['senin','selasa','rabu','kamis','jumat','sabtu','minggu'], 1250000, true),
	('sabu-kupang', 'Sabu', 'Kupang', 'reguler', ARRAY['senin','selasa','rabu','kamis','jumat','sabtu','minggu'], 1180000, true),
	('ende-sabu', 'Ende', 'Sabu', 'perintis', ARRAY['senin','rabu','jumat'], 850000, true),
	('sabu-waingapu', 'Sabu', 'Waingapu', 'perintis', ARRAY['selasa','kamis'], 920000, true)
ON CONFLICT DO NOTHING;
