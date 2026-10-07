import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { informationRequests } from "@/db/schema";
import { FileUploadError, saveFile } from "@/lib/file-upload";

// Pembatas sederhana: maksimal 5 kiriman per IP per jam (tersimpan di memori server).
const hits = new Map<string, number[]>();
function isLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60 * 60 * 1000);
  if (recent.length >= 5) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

const fail = (error: string, status = 400) => NextResponse.json({ success: false, error }, { status });
const text = (form: FormData, key: string, max: number) => String(form.get(key) ?? "").trim().slice(0, max);

async function storeFile(form: FormData, key: string): Promise<string | null> {
  const file = form.get(key);
  if (!(file instanceof File) || file.size === 0) return null;
  const saved = await saveFile(file, {
    baseDir: path.join(process.cwd(), "storage", "private"),
    allowedTypes: ["application/pdf", "image/jpeg", "image/png", "image/webp"],
    maxMB: 2,
  });
  return `/api/admin/private-file/${saved.fileName}`;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isLimited(ip)) return fail("Terlalu banyak pengiriman. Coba lagi satu jam lagi.", 429);

  try {
    const form = await request.formData();

    // Kolom jebakan untuk bot: manusia tidak melihatnya, jadi tidak pernah mengisinya.
    if (text(form, "website", 100)) return NextResponse.json({ success: true });

    // Di database: "information" = permohonan, "objection" = keberatan.
    const isObjection = text(form, "request_type", 30) === "keberatan";
    const request_type = isObjection ? "objection" : "information";

    const name = text(form, "name", 150);
    const email = text(form, "email", 255);
    if (!name) return fail("Nama wajib diisi");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Email tidak valid");

    if (!isObjection) {
      if (!text(form, "information_detail", 5000)) return fail("Rincian informasi yang dibutuhkan wajib diisi");
      if (!text(form, "purpose", 2000)) return fail("Tujuan penggunaan informasi wajib diisi");
      if (!text(form, "identity_number", 120)) return fail("Nomor identitas wajib diisi");
      const identity = form.get("identity_file");
      if (!(identity instanceof File) || identity.size === 0) return fail("Berkas identitas wajib diunggah");
    } else {
      if (!text(form, "objection_reason", 255)) return fail("Alasan keberatan wajib dipilih");
      if (!text(form, "case_position", 5000)) return fail("Kasus posisi wajib diisi");
    }

    const identity_file_url = await storeFile(form, "identity_file");
    const supporting_file_url = await storeFile(form, "supporting_file");

    // Tanggal masuk (format YYYY-MM-DD) menurut waktu Sabu (WITA).
    const submitted_on = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Makassar" });

    await db.insert(informationRequests).values({
      request_type,
      name,
      email,
      // Kolom di bawah ini wajib terisi di database, jadi dikirim "" kalau pemohon tidak mengisi.
      phone: text(form, "phone", 40),
      address: text(form, "address", 1000),
      occupation: text(form, "occupation", 150),
      identity_type: text(form, "identity_type", 20),
      identity_number: text(form, "identity_number", 120),
      identity_file_url: identity_file_url ?? "",
      // Kolom di bawah ini boleh kosong.
      institution: text(form, "institution", 255) || null,
      information_detail: text(form, "information_detail", 5000) || null,
      purpose: text(form, "purpose", 2000) || null,
      supporting_file_url,
      objection_reason: text(form, "objection_reason", 255) || null,
      objection_reason_other: text(form, "objection_reason_other", 2000) || null,
      case_position: text(form, "case_position", 5000) || null,
      submitted_on,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof FileUploadError) return fail(error.message);
    console.error("Failed to save information request:", error);
    return fail("Gagal mengirim formulir. Silakan coba lagi.", 500);
  }
}