import { NextRequest, NextResponse } from "next/server";
import { createInformationRequest, requestStats } from "@/services/information.service";
import { saveUploadedDocument, DocumentUploadError } from "@/lib/document-upload";
import { notifyNewInformationRequest } from "@/lib/telegram";
import { InputValidationError, cleanDate, cleanEmail, cleanField, decodeText } from "@/lib/sanitize";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year") || undefined;
  const month = searchParams.get("month") || undefined;
  return NextResponse.json({ success: true, data: await requestStats(year, month) });
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const request_type = String(form.get("request_type") || "");
    if (!["information", "objection"].includes(request_type)) {
      return NextResponse.json({ success: false, error: "Jenis pengajuan tidak valid." }, { status: 400 });
    }

    // Semua isian dibersihkan di backend: karakter khusus dinetralkan dan alamat web dijinakkan.
    // Panjang maksimal mengikuti panjang kolom pada tabel information_requests.
    const name = cleanField(form.get("name"), "Nama", { required: true, maxLength: 150 })!;
    const email = cleanEmail(form.get("email"));
    const phone = cleanField(form.get("phone"), "Nomor telepon", { required: true, maxLength: 40 })!;
    const address = cleanField(form.get("address"), "Alamat", { required: true })!;
    const occupation = cleanField(form.get("occupation"), "Pekerjaan", { required: true, maxLength: 150 })!;
    const identity_type = cleanField(form.get("identity_type"), "Jenis identitas", { required: true, maxLength: 20 })!;
    const identity_number = cleanField(form.get("identity_number"), "Nomor identitas", { required: true, maxLength: 120 })!;
    const institution = cleanField(form.get("institution"), "Instansi", { maxLength: 255 });
    const information_detail = cleanField(form.get("information_detail"), "Rincian informasi");
    const purpose = cleanField(form.get("purpose"), "Tujuan penggunaan");
    const objection_reason = cleanField(form.get("objection_reason"), "Alasan keberatan", { maxLength: 255 });
    const objection_reason_other = cleanField(form.get("objection_reason_other"), "Alasan lain");
    const case_position = cleanField(form.get("case_position"), "Kasus posisi");
    const submitted_on = cleanDate(form.get("submitted_on"), "Tanggal pengajuan");

    const identity = form.get("identity_file");
    if (!(identity instanceof File) || !identity.size) {
      return NextResponse.json({ success: false, error: "Foto identitas wajib diunggah." }, { status: 400 });
    }

    // Berkas diperiksa isinya (magic bytes), bukan hanya nama atau jenis yang dikirim peramban.
    const identity_file_url = await saveUploadedDocument(identity, "ppid");
    const support = form.get("supporting_file");
    const supporting_file_url = support instanceof File && support.size ? await saveUploadedDocument(support, "ppid") : null;

    await createInformationRequest({
      request_type,
      email,
      name,
      phone,
      address,
      occupation,
      identity_type,
      identity_number,
      identity_file_url,
      institution,
      information_detail,
      purpose,
      supporting_file_url,
      objection_reason,
      objection_reason_other,
      case_position,
      submitted_on,
    });

    // Kirim notifikasi Telegram ke grup admin secara asinkron tanpa memblokir respon.
    // Teks dikembalikan ke bentuk biasa (alamat web tetap dijinakkan); Telegram meng-escape HTML sendiri.
    notifyNewInformationRequest({
      request_type,
      name: decodeText(name),
      phone: decodeText(phone),
      email,
      occupation: decodeText(occupation),
      institution: decodeText(institution),
      information_detail: decodeText(information_detail),
      purpose: decodeText(purpose),
      objection_reason: decodeText(objection_reason),
      objection_reason_other: decodeText(objection_reason_other),
      case_position: decodeText(case_position),
      submitted_on,
    }).catch((err) => console.error("Gagal mengirim notifikasi Telegram:", err));

    return NextResponse.json({ success: true, message: "Permohonan berhasil dikirim ke PPID." }, { status: 201 });
  } catch (e) {
    if (e instanceof InputValidationError) {
      return NextResponse.json({ success: false, error: e.message }, { status: 400 });
    }
    // Catat penyebab di log server tanpa memasukkan data pribadi pemohon ke log.
    console.error("POST /api/information-requests error:", e);
    return NextResponse.json(
      { success: false, error: e instanceof DocumentUploadError ? e.message : "Permohonan gagal dikirim." },
      { status: e instanceof DocumentUploadError ? 400 : 500 }
    );
  }
}
