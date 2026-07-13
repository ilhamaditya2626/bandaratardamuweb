import {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
  date,
  boolean,
  decimal,
  json,
  uniqueIndex,
} from "drizzle-orm/mysql-core";


// ─── 1. NEWS (Berita & Pengumuman) ───────────────────────────
export const news = mysqlTable("news", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  image_url: text("image_url"),
  author: varchar("author", { length: 100 }).default("Redaksi Bandara"),
  slug: varchar("slug", { length: 255 }).unique(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// ─── 2. FLIGHTS (Jadwal Penerbangan) ─────────────────────────
export const flights = mysqlTable("flights", {
  id: int("id").autoincrement().primaryKey(),
  flight_no: varchar("flight_no", { length: 20 }).notNull(),
  airline: varchar("airline", { length: 100 }).notNull(),
  airline_key: varchar("airline_key", { length: 50 }),
  origin: varchar("origin", { length: 100 }),
  destination: varchar("destination", { length: 100 }),
  type: varchar("type", { length: 20 }).notNull(), // "arrival" | "departure"
  flight_type: varchar("flight_type", { length: 30 }).default("reguler"), // "reguler" | "extra_flight" | "charter_flight" | "perintis"
  scheduled_time: varchar("scheduled_time", { length: 5 }).notNull(),
  estimated_time: varchar("estimated_time", { length: 5 }),

  sta: varchar("sta", { length: 5 }),
  eta: varchar("eta", { length: 5 }),
  std: varchar("std", { length: 5 }),
  etd: varchar("etd", { length: 5 }),

  status: varchar("status", { length: 20 }).default("ontime"),

  status_label: varchar("status_label", { length: 30 }),
  notes: text("notes"),
  flight_date: date("flight_date", { mode: "string" }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// ─── 3. PASSENGER STATISTICS (Statistik Penumpang) ───────────
export const ticketPrices = mysqlTable(
  "ticket_prices",
  {
    id: int("id").autoincrement().primaryKey(),
    route_key: varchar("route_key", { length: 160 }).notNull(),
    origin: varchar("origin", { length: 100 }).notNull(),
    destination: varchar("destination", { length: 100 }).notNull(),
    flight_type: varchar("flight_type", { length: 20 }).default("reguler").notNull(),
    operating_days: json("operating_days").$type<string[]>().notNull(),
    price: int("price").notNull(),
    is_active: boolean("is_active").default(true).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    routeTypeUnique: uniqueIndex("ticket_prices_route_type_unique").on(
      table.route_key,
      table.flight_type
    ),
  })
);

export const passengerStats = mysqlTable("passenger_stats", {
  id: int("id").autoincrement().primaryKey(),
  date: date("date", { mode: "string" }).notNull(),

  // Kolom lama, jangan hapus dulu agar kode lama tidak langsung rusak
  arrival_count: int("arrival_count").default(0).notNull(),
  departure_count: int("departure_count").default(0).notNull(),
  category: varchar("category", { length: 20 }).default("domestic").notNull(),

  // Kolom baru
  airline: varchar("airline", { length: 100 }),
  flight_type: varchar("flight_type", { length: 20 }),
  city: varchar("city", { length: 100 }),
  passenger_count: int("passenger_count").default(0),
  load_factor: decimal("load_factor", { precision: 8, scale: 2 }),

  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const feedbackSubmissions = mysqlTable("feedback_submissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 30 }).default("new").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// ─── BETTER AUTH TABLES ──────────────────────────────────────

export const user = mysqlTable("user", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = mysqlTable("session", {
  id: varchar("id", { length: 255 }).primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => user.id),
});

export const account = mysqlTable("account", {
  id: varchar("id", { length: 255 }).primaryKey(),
  accountId: varchar("account_id", { length: 255 }).notNull(),
  providerId: varchar("provider_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 255 }).primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
