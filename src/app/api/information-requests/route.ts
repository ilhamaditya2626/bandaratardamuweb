import { NextRequest, NextResponse } from "next/server";
import { createInformationRequest, requestStats } from "@/services/information.service";
import { saveUploadedDocument, DocumentUploadError } from "@/lib/document-upload";
import { notifyNewInformationRequest } from "@/lib/telegram";

const fields = ["email","name","phone","address","occupation","identity_type","identity_number","submitted_on"] as const;

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
    if (!["information", "objection"].includes(request_type) || fields.some(k => !String(form.get(k) || "").trim())) {
      return NextResponse.json({ success: false, error: "Mohon lengkapi seluruh kolom wajib." }, { status: 400 });
    }

    const identity = form.get("identity_file");
    if (!(identity instanceof File) || !identity.size) {
      return NextResponse.json({ success: false, error: "Foto identitas wajib diunggah." }, { status: 400 });
    }

    const identity_file_url = await saveUploadedDocument(identity, "ppid");
    const support = form.get("supporting_file");
    const supporting_file_url = support instanceof File && support.size ? await saveUploadedDocument(support, "ppid") : null;

    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const address = String(form.get("address") || "").trim();
    const occupation = String(form.get("occupation") || "").trim();
    const identity_type = String(form.get("identity_type") || "").trim();
    const identity_number = String(form.get("identity_number") || "").trim();
    const institution = String(form.get("institution") || "").trim() || null;
    const information_detail = String(form.get("information_detail") || "").trim() || null;
    const purpose = String(form.get("purpose") || "").trim() || null;
    const objection_reason = String(form.get("objection_reason") || "").trim() || null;
    const objection_reason_other = String(form.get("objection_reason_other") || "").trim() || null;
    const case_position = String(form.get("case_position") || "").trim() || null;
    const submitted_on = String(form.get("submitted_on") || "").trim();

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

    // Kirim notifikasi Telegram ke grup admin secara asinkron tanpa memblokir respon
    notifyNewInformationRequest({
      request_type,
      name,
      phone,
      email,
      occupation,
      institution,
      information_detail,
      purpose,
      objection_reason,
      objection_reason_other,
      case_position,
      submitted_on,
    }).catch((err) => console.error("Gagal mengirim notifikasi Telegram:", err));

    return NextResponse.json({ success: true, message: "Permohonan berhasil dikirim ke PPID." }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof DocumentUploadError ? e.message : "Permohonan gagal dikirim." },
      { status: 500 }
    );
  }
}
