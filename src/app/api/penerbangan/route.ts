import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

// =============================================================
// GET /api/penerbangan?dari=YYYY-MM-DD&sampai=YYYY-MM-DD
//
// Endpoint KHUSUS untuk aplikasi SIMTAR: mengembalikan data penerbangan
// (flights) dan rekap penumpang (passenger_stats) satu rentang tanggal
// penuh, dengan SEMUA kolom (SELECT *) — termasuk kolom DAU baru
// (pax_adult/child/infant, transit, baggage/cargo/mail_kg, seat_capacity,
// aircraft_type, is_scheduled).
//
// Memakai pool mysql2 sendiri + .query() (BUKAN prepared .execute() milik
// drizzle) supaya:
//   1. Kolom yang baru ditambahkan ke DB ikut terkirim tanpa mengubah
//      schema.ts / service / tampilan web yang sudah publish.
//   2. Terhindar dari bug cache metadata prepared-statement mysql2 yang
//      memunculkan kolom hantu "Column12" saat skema tabel berubah.
//
// Dilindungi token statis:  Authorization: Bearer <SIMTAR_API_TOKEN>
// =============================================================

// DATABASE_URL memuat '@' pada password, jadi diurai manual (bukan lewat URL()).
function konfigDb(): mysql.PoolOptions {
  const raw = (process.env.DATABASE_URL ?? "").replace(/^mysql:\/\//, "");
  const potong = raw.lastIndexOf("@");
  const kredensial = raw.slice(0, potong); // user:pass (pass boleh ber-@)
  const lokasi = raw.slice(potong + 1); // host:port/db
  const bagiKred = kredensial.indexOf(":");
  const user = kredensial.slice(0, bagiKred);
  const password = kredensial.slice(bagiKred + 1);
  const [hostPort, database] = lokasi.split("/");
  const [host, port] = hostPort.split(":");
  return {
    host,
    port: Number(port || 3306),
    user,
    password,
    database,
    charset: "utf8mb4",
    dateStrings: true,
    waitForConnections: true,
    connectionLimit: 5,
  };
}

const globalPool = globalThis as unknown as { poolPenerbangan?: mysql.Pool };
function pool(): mysql.Pool {
  if (!globalPool.poolPenerbangan) {
    globalPool.poolPenerbangan = mysql.createPool(konfigDb());
  }
  return globalPool.poolPenerbangan;
}

export async function GET(request: NextRequest) {
  const token = (request.headers.get("authorization") ?? "").replace(
    /^Bearer\s+/i,
    ""
  );
  if (!process.env.SIMTAR_API_TOKEN || token !== process.env.SIMTAR_API_TOKEN) {
    return NextResponse.json(
      { success: false, error: "Token tidak sah." },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const dari = searchParams.get("dari");
    const sampai = searchParams.get("sampai");

    function filter(kolom: string) {
      const syarat: string[] = [];
      const args: string[] = [];
      if (dari) { syarat.push(`\`${kolom}\` >= ?`); args.push(dari); }
      if (sampai) { syarat.push(`\`${kolom}\` <= ?`); args.push(sampai); }
      return { where: syarat.length ? ` WHERE ${syarat.join(" AND ")}` : "", args };
    }

    // Kolom dipilih EKSPLISIT (bukan SELECT *) agar kolom sampah lama di DB
    // (Column12.. / Column16.. dari impor lama) tidak ikut terkirim.
    const KOLOM_FLIGHTS = [
      "id", "flight_no", "airline", "origin", "destination", "type",
      "flight_type", "scheduled_time", "estimated_time", "status",
      "status_label", "notes", "flight_date", "seat_capacity",
      "aircraft_type", "is_scheduled",
    ].map((k) => `\`${k}\``).join(", ");
    const KOLOM_STATS = [
      "id", "date", "arrival_count", "departure_count", "category", "airline",
      "flight_type", "city", "passenger_count", "load_factor",
      "pax_adult", "pax_child", "pax_infant",
      "pax_transit_adult", "pax_transit_child", "pax_transit_infant",
      "baggage_kg", "cargo_kg", "mail_kg",
    ].map((k) => `\`${k}\``).join(", ");

    const f = filter("flight_date");
    const [penerbangan] = await pool().query(
      `SELECT ${KOLOM_FLIGHTS} FROM flights${f.where} ORDER BY flight_date, scheduled_time`,
      f.args
    );

    const s = filter("date");
    const [penumpang] = await pool().query(
      `SELECT ${KOLOM_STATS} FROM passenger_stats${s.where} ORDER BY date`,
      s.args
    );

    return NextResponse.json({ penerbangan, penumpang });
  } catch (error) {
    console.error("GET /api/penerbangan error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data penerbangan." },
      { status: 500 }
    );
  }
}

// =============================================================
// POST /api/penerbangan  — tambah 1 penerbangan + rekap penumpang
//
// Dipakai tombol "Tambah Data" di halaman LLAU SIMTAR. Body:
//   { penerbangan: {...flights}, penumpang: {...passenger_stats} }
//
// Kolom di-whitelist eksplisit (INSERT hanya kolom sah) → aman dari
// kolom sampah lama (Column12.. / Column16..) dan dari nama kolom liar.
// Dua INSERT dibungkus satu transaksi.
// =============================================================

const KOLOM_INSERT_FLIGHTS = [
  "flight_no", "airline", "origin", "destination", "type", "flight_type",
  "scheduled_time", "estimated_time", "status", "status_label", "notes",
  "flight_date", "seat_capacity", "aircraft_type", "is_scheduled",
];
const KOLOM_INSERT_STATS = [
  "date", "arrival_count", "departure_count", "category", "airline",
  "flight_type", "city", "passenger_count", "load_factor",
  "pax_adult", "pax_child", "pax_infant",
  "pax_transit_adult", "pax_transit_child", "pax_transit_infant",
  "baggage_kg", "cargo_kg", "mail_kg",
];

function susunInsert(
  tabel: string,
  obj: Record<string, unknown>,
  kolom: string[]
) {
  const nama: string[] = [];
  const nilai: unknown[] = [];
  for (const k of kolom) {
    const v = obj[k];
    if (v !== undefined && v !== null && v !== "") {
      nama.push(k);
      nilai.push(v);
    }
  }
  const sql = `INSERT INTO \`${tabel}\` (${nama
    .map((n) => `\`${n}\``)
    .join(", ")}) VALUES (${nama.map(() => "?").join(", ")})`;
  return { sql, nilai, jumlah: nama.length };
}

export async function POST(request: NextRequest) {
  const token = (request.headers.get("authorization") ?? "").replace(
    /^Bearer\s+/i,
    ""
  );
  if (!process.env.SIMTAR_API_TOKEN || token !== process.env.SIMTAR_API_TOKEN) {
    return NextResponse.json(
      { success: false, error: "Token tidak sah." },
      { status: 401 }
    );
  }

  let body: { penerbangan?: Record<string, unknown>; penumpang?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Body bukan JSON." },
      { status: 400 }
    );
  }

  const penerbangan = body?.penerbangan ?? {};
  const penumpang = body?.penumpang ?? {};
  if (!body?.penerbangan || !body?.penumpang) {
    return NextResponse.json(
      { success: false, error: "penerbangan & penumpang wajib diisi." },
      { status: 400 }
    );
  }

  const conn = await pool().getConnection();
  try {
    await conn.beginTransaction();

    const f = susunInsert("flights", penerbangan, KOLOM_INSERT_FLIGHTS);
    let flightId: number | null = null;
    if (f.jumlah > 0) {
      const [r] = await conn.query(f.sql, f.nilai);
      flightId = (r as { insertId?: number }).insertId ?? null;
    }

    const s = susunInsert("passenger_stats", penumpang, KOLOM_INSERT_STATS);
    let paxId: number | null = null;
    if (s.jumlah > 0) {
      const [r] = await conn.query(s.sql, s.nilai);
      paxId = (r as { insertId?: number }).insertId ?? null;
    }

    await conn.commit();
    return NextResponse.json({ success: true, ok: true, flightId, paxId });
  } catch (error) {
    await conn.rollback();
    console.error("POST /api/penerbangan error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan data." },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}
