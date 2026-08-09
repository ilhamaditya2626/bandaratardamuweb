// src/app/api/penerbangan/route.ts  — DI PROJECT WEB VPS (tardamuairport.id)
//
// GET  /api/penerbangan?dari=YYYY-MM-DD&sampai=YYYY-MM-DD   → tarik data
// POST /api/penerbangan                                     → tambah/timpa data
// Header wajib (keduanya): Authorization: Bearer <PENERBANGAN_API_TOKEN>
//
// POST menerima body { penerbangan: {...}, penumpang: {...} } dari n8n/SIMTAR.
// Alih-alih selalu INSERT, POST melakukan UPSERT: mencari baris JADWAL yang
// cocok lalu MENIMPANYA (bukan membuat duplikat).
//
//   Kunci cocok flights   : flight_date + arah + endpoint (bandara non-SAU),
//                           tie-break jam jadwal terdekat.
//                           (flight_no TIDAK dipakai sebagai kunci karena diisi
//                            registrasi pesawat yang berulang antar leg.)
//   Kunci cocok penumpang : date + flight_type + city.

import mysql from "mysql2/promise";

// ---------------------------------------------------------------------------
// Koneksi ke DATABASE web VPS ini sendiri (localhost).
// ---------------------------------------------------------------------------
const globalDb = globalThis as unknown as { poolPenerbangan?: mysql.Pool };
function pool() {
  if (!globalDb.poolPenerbangan) {
    // Urai DATABASE_URL (mis. mysql://user:pass@host:3306/nama_db).
    const url = new URL(process.env.DATABASE_URL!);
    globalDb.poolPenerbangan = mysql.createPool({
      host: url.hostname,
      port: Number(url.port || 3306),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, ""),
      charset: "utf8mb4",
      dateStrings: true,
      waitForConnections: true,
      connectionLimit: 5,
    });
  }
  return globalDb.poolPenerbangan;
}

const TABEL_FLIGHTS = "flights";
const TABEL_PENUMPANG = "passenger_stats";
const KOLOM_TANGGAL_FLIGHTS = "flight_date";
const KODE_HOME = "SAU"; // bandara Tardamu (Sabu)

// ---------------------------------------------------------------------------
// Util umum
// ---------------------------------------------------------------------------
function cekToken(request: Request): boolean {
  const auth = request.headers.get("authorization") ?? "";
  const token = auth.replace(/^Bearer\s+/i, "");
  return !!process.env.PENERBANGAN_API_TOKEN && token === process.env.PENERBANGAN_API_TOKEN;
}

// Ambil hanya kolom yang diizinkan (hindari kolom liar / injection nama kolom).
function ambilKolom<T extends Record<string, unknown>>(
  obj: T,
  kolom: string[]
): { nama: string[]; nilai: unknown[] } {
  const nama: string[] = [];
  const nilai: unknown[] = [];
  for (const k of kolom) {
    if (obj[k] !== undefined) {
      nama.push(k);
      nilai.push(obj[k]);
    }
  }
  return { nama, nilai };
}

// Normalisasi nama/kode bandara → kode 3 huruf (samakan dgn kodeBandara SIMTAR).
function kodeBandara(nilai: unknown): string {
  const t = String(nilai ?? "").trim();
  if (!t) return "";
  const dlm = t.match(/\(([A-Za-z]{3})\)/);
  if (dlm) return dlm[1].toUpperCase();
  const l = t.toLowerCase();
  const peta: [RegExp, string][] = [
    [/kupang|koe|el\s*tari/, "KOE"],
    [/sabu|sau|tardamu/, "SAU"],
    [/waingapu|sumba|wgp|umbu/, "WGP"],
    [/\bende\b|ene/, "ENE"],
    [/rote|roti|ba['’]?a|rti|lekunik/, "RTI"],
    [/maumere|mof/, "MOF"],
    [/labuan\s*bajo|lbj|komodo/, "LBJ"],
    [/tambolaka|tmc/, "TMC"],
    [/atambua|abu/, "ABU"],
  ];
  for (const [re, k] of peta) if (re.test(l)) return k;
  return t.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase();
}

function arahKode(v: unknown): "arrival" | "departure" {
  return /arriv|datang|keda|tiba|masuk/i.test(String(v ?? "")) ? "arrival" : "departure";
}

// Endpoint = bandara non-SAU yang terisi (asal utk kedatangan / tujuan utk keberangkatan).
function endpointDari(data: any): string {
  const o = kodeBandara(data.origin);
  const d = kodeBandara(data.destination);
  return o && o !== KODE_HOME ? o : d;
}

// Selisih menit antara dua jam "HH:MM"/"HH.MM" (utk tie-break jadwal terdekat).
function selisihMenit(a: unknown, b: unknown): number {
  const m = (x: unknown) => {
    const t = String(x ?? "").match(/(\d{1,2})[.:](\d{2})/);
    return t ? Number(t[1]) * 60 + Number(t[2]) : 99999;
  };
  return Math.abs(m(a) - m(b));
}

// ---------------------------------------------------------------------------
// Kolom yang boleh ditulis
// ---------------------------------------------------------------------------
const KOLOM_FLIGHTS = [
  "flight_no", "airline", "origin", "destination", "type", "flight_type",
  "scheduled_time", "estimated_time", "status", "status_label", "notes",
  "flight_date", "seat_capacity", "aircraft_type", "is_scheduled",
];
const KOLOM_PENUMPANG = [
  "date", "arrival_count", "departure_count", "category", "airline",
  "flight_type", "city", "passenger_count", "load_factor",
  "pax_adult", "pax_child", "pax_infant",
  "baggage_kg", "cargo_kg", "mail_kg",
];

// ---------------------------------------------------------------------------
// GET — tarik data
// ---------------------------------------------------------------------------
function filterTanggal(kolom: string, dari: string | null, sampai: string | null) {
  const syarat: string[] = [];
  const args: unknown[] = [];
  if (kolom && dari) { syarat.push(`\`${kolom}\` >= ?`); args.push(dari); }
  if (kolom && sampai) { syarat.push(`\`${kolom}\` <= ?`); args.push(sampai); }
  const where = syarat.length ? ` WHERE ${syarat.join(" AND ")}` : "";
  return { where, args };
}

export async function GET(request: Request) {
  if (!cekToken(request)) {
    return Response.json({ pesan: "Token tidak sah." }, { status: 401 });
  }
  const p = new URL(request.url).searchParams;
  const dari = p.get("dari");
  const sampai = p.get("sampai");

  try {
    const f = filterTanggal(KOLOM_TANGGAL_FLIGHTS, dari, sampai);
    const [penerbangan] = await pool().query(
      `SELECT * FROM \`${TABEL_FLIGHTS}\`${f.where} ORDER BY \`${KOLOM_TANGGAL_FLIGHTS}\``,
      f.args
    );
    const s = filterTanggal("date", dari, sampai);
    const [penumpang] = await pool().query(
      `SELECT * FROM \`${TABEL_PENUMPANG}\`${s.where} ORDER BY \`date\``,
      s.args
    );
    return Response.json({ penerbangan, penumpang });
  } catch (err) {
    console.error("[api/penerbangan GET]", err);
    return Response.json({ pesan: "Galat mengambil data." }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// UPSERT flights — cari jadwal cocok lalu timpa, atau insert baru.
// ---------------------------------------------------------------------------
async function upsertFlight(conn: any, data: any): Promise<number | null> {
  const f = ambilKolom(data, KOLOM_FLIGHTS);
  if (!f.nama.length) return null;

  const tgl = data.flight_date;
  const tipe = arahKode(data.type ?? data.flight_type);
  const ep = endpointDari(data);

  if (tgl && ep) {
    const [rows]: any = await conn.query(
      `SELECT id, type, flight_type, origin, destination, scheduled_time
         FROM \`${TABEL_FLIGHTS}\` WHERE \`${KOLOM_TANGGAL_FLIGHTS}\` = ?`,
      [tgl]
    );
    const cocok = rows.filter(
      (r: any) =>
        arahKode(r.type ?? r.flight_type) === tipe &&
        (kodeBandara(r.origin) === ep || kodeBandara(r.destination) === ep)
    );
    if (cocok.length) {
      // >1 kandidat (rute + arah sama, hari sama) → pilih jam jadwal terdekat.
      const target =
        cocok.length === 1
          ? cocok[0]
          : cocok.sort(
              (a: any, b: any) =>
                selisihMenit(a.scheduled_time, data.scheduled_time) -
                selisihMenit(b.scheduled_time, data.scheduled_time)
            )[0];
      await conn.query(
        `UPDATE \`${TABEL_FLIGHTS}\`
            SET ${f.nama.map((n) => `\`${n}\` = ?`).join(", ")}
          WHERE id = ?`,
        [...f.nilai, target.id]
      );
      return target.id;
    }
  }

  const [r]: any = await conn.query(
    `INSERT INTO \`${TABEL_FLIGHTS}\` (${f.nama.map((n) => `\`${n}\``).join(",")})
     VALUES (${f.nama.map(() => "?").join(",")})`,
    f.nilai
  );
  return r.insertId ?? null;
}

// ---------------------------------------------------------------------------
// UPSERT passenger_stats — cocok date + flight_type + city, atau insert baru.
// ---------------------------------------------------------------------------
async function upsertPenumpang(conn: any, data: any): Promise<number | null> {
  const s = ambilKolom(data, KOLOM_PENUMPANG);
  if (!s.nama.length) return null;

  const tgl = data.date;
  const tipe = arahKode(data.flight_type);
  const kota = kodeBandara(data.city);

  if (tgl && kota) {
    const [rows]: any = await conn.query(
      `SELECT id, flight_type, city FROM \`${TABEL_PENUMPANG}\` WHERE \`date\` = ?`,
      [tgl]
    );
    const cocok = rows.filter(
      (r: any) => arahKode(r.flight_type) === tipe && kodeBandara(r.city) === kota
    );
    if (cocok.length) {
      await conn.query(
        `UPDATE \`${TABEL_PENUMPANG}\`
            SET ${s.nama.map((n) => `\`${n}\` = ?`).join(", ")}
          WHERE id = ?`,
        [...s.nilai, cocok[0].id]
      );
      return cocok[0].id;
    }
  }

  const [r]: any = await conn.query(
    `INSERT INTO \`${TABEL_PENUMPANG}\` (${s.nama.map((n) => `\`${n}\``).join(",")})
     VALUES (${s.nama.map(() => "?").join(",")})`,
    s.nilai
  );
  return r.insertId ?? null;
}

// ---------------------------------------------------------------------------
// POST — tambah / timpa data (transaksi)
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  if (!cekToken(request)) {
    return Response.json({ pesan: "Token tidak sah." }, { status: 401 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return Response.json({ pesan: "Body bukan JSON." }, { status: 400 });
  }
  const penerbangan = body?.penerbangan ?? {};
  const penumpang = body?.penumpang ?? {};

  const conn = await pool().getConnection();
  try {
    await conn.beginTransaction();
    const flightId = await upsertFlight(conn, penerbangan);
    const paxId = await upsertPenumpang(conn, penumpang);
    await conn.commit();
    return Response.json({ ok: true, flightId, paxId });
  } catch (err) {
    await conn.rollback();
    console.error("[api/penerbangan POST]", err);
    return Response.json({ pesan: "Gagal menyimpan data." }, { status: 500 });
  } finally {
    conn.release();
  }
}
