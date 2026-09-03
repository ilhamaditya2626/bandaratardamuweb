import { NextRequest, NextResponse } from "next/server";
import { createInformationRequest, requestStats } from "@/services/information.service";
import { saveUploadedDocument, DocumentUploadError } from "@/lib/document-upload";
const fields = ["email","name","phone","address","occupation","identity_type","identity_number","submitted_on"] as const;
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year") || undefined;
  const month = searchParams.get("month") || undefined;
  return NextResponse.json({ success: true, data: await requestStats(year, month) });
}
export async function POST(request: NextRequest) {
  try { const form = await request.formData(); const request_type = String(form.get("request_type") || "");
    if (!["information", "objection"].includes(request_type) || fields.some(k => !String(form.get(k) || "").trim())) return NextResponse.json({ success:false, error:"Mohon lengkapi seluruh kolom wajib." }, { status:400 });
    const identity = form.get("identity_file"); if (!(identity instanceof File) || !identity.size) return NextResponse.json({ success:false, error:"Foto identitas wajib diunggah." }, { status:400 });
    const identity_file_url = await saveUploadedDocument(identity, "ppid"); const support = form.get("supporting_file");
    const supporting_file_url = support instanceof File && support.size ? await saveUploadedDocument(support, "ppid") : null;
    await createInformationRequest({ request_type, email:String(form.get("email")), name:String(form.get("name")), phone:String(form.get("phone")), address:String(form.get("address")), occupation:String(form.get("occupation")), identity_type:String(form.get("identity_type")), identity_number:String(form.get("identity_number")), identity_file_url, institution:String(form.get("institution") || "") || null, information_detail:String(form.get("information_detail") || "") || null, purpose:String(form.get("purpose") || "") || null, supporting_file_url, objection_reason:String(form.get("objection_reason") || "") || null, objection_reason_other:String(form.get("objection_reason_other") || "") || null, case_position:String(form.get("case_position") || "") || null, submitted_on:String(form.get("submitted_on")) });
    return NextResponse.json({ success:true, message:"Permohonan berhasil dikirim ke PPID." }, { status:201 });
  } catch (e) { return NextResponse.json({ success:false, error:e instanceof DocumentUploadError ? e.message : "Permohonan gagal dikirim." }, { status:500 }); }
}
