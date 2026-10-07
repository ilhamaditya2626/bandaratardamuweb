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
  pegawai_id: int("pegawai_id").references(() => pegawai.id),
  slug: varchar("slug", { length: 255 }).unique(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// ─── 1b. URGENT PUBLIC INFORMATION (Informasi Serta Merta) ──
export const urgentInformation = mysqlTable("urgent_information", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  attachment_url: text("attachment_url"),
  pegawai_id: int("pegawai_id").references(() => pegawai.id),
  published_at: timestamp("published_at").defaultNow().notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// ─── 2. FLIGHTS (Jadwal Penerbangan) ─────────────────────────
export const flights = mysqlTable("flights", {
  id: int("id").autoincrement().primaryKey(),
  flight_no: varchar("flight_no", { length: 20 }).notNull(),
  airline: varchar("airline", { length: 100 }).notNull(),
  maskapai_id: int("maskapai_id").references(() => maskapai.id),

  origin: varchar("origin", { length: 100 }),
  destination: varchar("destination", { length: 100 }),
  type: varchar("type", { length: 20 }).notNull(), // "arrival" | "departure"
  flight_type: varchar("flight_type", { length: 30 }).default("reguler"), // "reguler" | "extra_flight" | "charter_flight" | "perintis"
  scheduled_time: varchar("scheduled_time", { length: 5 }).notNull(),
  estimated_time: varchar("estimated_time", { length: 5 }),



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
    maskapai_id: int("maskapai_id").references(() => maskapai.id),
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
  maskapai_id: int("maskapai_id").references(() => maskapai.id),
  flight_type: varchar("flight_type", { length: 20 }),
  city: varchar("city", { length: 100 }),
  passenger_count: int("passenger_count").default(0),
  load_factor: decimal("load_factor", { precision: 8, scale: 2 }),

  // Rincian DAU (dewasa+anak = penumpang dihitung; bayi TIDAK dihitung
  // tapi tetap disimpan karena keluar di PDF DAU).
  pax_adult: int("pax_adult").default(0).notNull(),
  pax_child: int("pax_child").default(0).notNull(),
  pax_infant: int("pax_infant").default(0).notNull(),
  pax_transit_adult: int("pax_transit_adult").default(0).notNull(),
  pax_transit_child: int("pax_transit_child").default(0).notNull(),
  pax_transit_infant: int("pax_transit_infant").default(0).notNull(),
  baggage_kg: int("baggage_kg").default(0).notNull(),
  cargo_kg: int("cargo_kg").default(0).notNull(),
  mail_kg: int("mail_kg").default(0).notNull(),

  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const feedbackSubmissions = mysqlTable("feedback_submissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 30 }).default("new").notNull(),
  ditangani_oleh: int("ditangani_oleh").references(() => pegawai.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// ─── PENGINAPAN (Akomodasi Penginapan) ───────────────────────
export const penginapan = mysqlTable("penginapan", {
  id: int("id").autoincrement().primaryKey(),
  category: varchar("category", { length: 50 }).notNull(), // badge, teks bebas
  name: varchar("name", { length: 150 }).notNull(),
  description: text("description"),
  photos: json("photos").$type<string[]>().notNull(), // array path/URL foto
  facilities: json("facilities").$type<string[]>().notNull(), // array nama fasilitas
  price: int("price").notNull(), // rupiah, integer
  phone: varchar("phone", { length: 30 }), // nomor WA mentah
  is_active: boolean("is_active").default(true).notNull(),
  dikelola_oleh: int("dikelola_oleh").references(() => pegawai.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// ─── BETTER AUTH TABLES ──────────────────────────────────────

export const user = mysqlTable("user", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  pegawai_id: int("pegawai_id").references(() => pegawai.id),
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
  userId: varchar("user_id", { length: 255 }).references(() => user.id),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// ─── 12. MASKAPAI (Airline) ──────────────────────────────────
// Ditambahkan agar ERD tersambung penuh sesuai arahan dosen pembimbing.
// Bersifat referensi (belum dipakai flights.airline yang tetap teks bebas
// agar tidak mengganggu integrasi SIMTAR yang sudah berjalan).
export const maskapai = mysqlTable("maskapai", {
  id: int("id").autoincrement().primaryKey(),
  nama: varchar("nama", { length: 100 }).notNull(),
  kode: varchar("kode", { length: 10 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// ─── 13. PILOT ────────────────────────────────────────────────
// CATATAN: tidak ada data pilot di kode/website manapun sebelum ini.
// Data isi (seed) untuk tabel ini bersifat CONTOH, bukan data pilot sungguhan.
export const pilot = mysqlTable("pilot", {
  id: int("id").autoincrement().primaryKey(),
  nama: varchar("nama", { length: 100 }).notNull(),
  nomor_lisensi: varchar("nomor_lisensi", { length: 50 }),
  maskapai_id: int("maskapai_id").notNull().references(() => maskapai.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// ─── 14. DIVISI (Unit Kerja) ──────────────────────────────────
// Menggantikan konten "workUnits" yang sebelumnya hardcode di
// src/app/(flight)/unit-kerja/page.tsx.
export const divisi = mysqlTable("divisi", {
  id: int("id").autoincrement().primaryKey(),
  nama: varchar("nama", { length: 100 }).notNull(),
  deskripsi: text("deskripsi"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// ─── 15. PEGAWAI (Employee) ──────────────────────────────────
// Menggantikan konten "officials"/"leaderProfile" yang sebelumnya
// hardcode di src/app/(flight)/informasi-berkala/page.tsx.
export const pegawai = mysqlTable("pegawai", {
  id: int("id").autoincrement().primaryKey(),
  nama: varchar("nama", { length: 150 }).notNull(),
  jabatan: varchar("jabatan", { length: 150 }),
  pendidikan_terakhir: varchar("pendidikan_terakhir", { length: 50 }),
  divisi_id: int("divisi_id").references(() => divisi.id),
  role_id: int("role_id").references(() => role.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// ─── 16. DESTINASI (Rute/Tujuan Penerbangan) ─────────────────
// Tabel BARU sesuai hasil ACC ERD Chen dari dosen pembimbing.
// Belum dipakai kolom origin/destination di flights/ticket_prices
// (tetap teks bebas apa adanya, supaya tidak mengganggu integrasi
// SIMTAR yang sudah berjalan). Tabel ini baru berdiri sendiri dulu.
export const destinasi = mysqlTable("destinasi", {
  id: int("id").autoincrement().primaryKey(),
  kode_bandara: varchar("kode_bandara", { length: 10 }),
  nama_kota: varchar("nama_kota", { length: 100 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// ─── 17. PENUMPANG (Data Penumpang per-individu) ─────────────
// Tabel BARU sesuai hasil ACC ERD Chen dari dosen pembimbing.
// CATATAN JUJUR: sistem sekarang HANYA punya statistik agregat
// (passenger_stats), belum pernah ada pencatatan data penumpang
// per-orang. Tabel ini disiapkan strukturnya, tapi belum ada
// halaman/form nyata yang mengisi datanya -- itu langkah
// implementasi lanjutan yang terpisah.
export const penumpang = mysqlTable("penumpang", {
  id: int("id").autoincrement().primaryKey(),
  nama: varchar("nama", { length: 150 }).notNull(),
  nomor_identitas: varchar("nomor_identitas", { length: 50 }),
  kontak: varchar("kontak", { length: 30 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// ─── 18. ROLE ─────────────────────────────────────────────────
// Tabel BARU sesuai hasil ACC ERD Chen. Berdiri sendiri, TIDAK
// menggantikan tabel `user` (yang tetap wajib ada untuk Better Auth).
export const role = mysqlTable("role", {
  id: int("id").autoincrement().primaryKey(),
  nama_role: varchar("nama_role", { length: 50 }).notNull(),
  deskripsi: text("deskripsi"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// ─── 19. PENERBANGAN (relasi N-ary: Maskapai-Pilot-Destinasi-Penumpang) ───
// Tabel BARU sesuai hasil ACC ERD Chen. Berdiri sendiri, TIDAK
// menggantikan flights/ticket_prices/passenger_stats yang tetap
// dipakai aplikasi yang berjalan. Data di sini adalah salinan/contoh,
// bukan sumber data otomatis untuk halaman publik.
export const penerbangan = mysqlTable("penerbangan", {
  id: int("id").autoincrement().primaryKey(),
  maskapai_id: int("maskapai_id").notNull().references(() => maskapai.id),
  pilot_id: int("pilot_id").notNull().references(() => pilot.id),
  destinasi_id: int("destinasi_id").notNull().references(() => destinasi.id),
  penumpang_id: int("penumpang_id").references(() => penumpang.id),
  tanggal: date("tanggal", { mode: "string" }),
  jam: varchar("jam", { length: 5 }),
  seat: varchar("seat", { length: 10 }),
  harga_tiket: int("harga_tiket"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
