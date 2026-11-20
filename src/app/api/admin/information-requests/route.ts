import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPegawaiId } from "@/lib/admin-crud";
import { deleteInformationRequest, listRequests, updateInformationRequest, updateRequestStatus } from "@/services/information.service";
import { InputValidationError, cleanDate, cleanEmail, cleanField, isUuidV4 } from "@/lib/sanitize";

// Batas panjang kolom pada tabel information_requests.
const TEXT_LIMITS: Record<string, number | undefined> = {
  name: 150, phone: 40, occupation: 150, institution: 255, objection_reason: 255,
  address: undefined, information_detail: undefined, purpose: undefined,
  objection_reason_other: undefined, case_position: undefined, admin_note: undefined,
};
const REQUIRED_FIELDS = new Set(["name", "phone", "address", "occupation"]);

async function allowed(request: NextRequest) {
  try {
    return await auth.api.getSession({ headers: request.headers });
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!await allowed(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const data = await listRequests();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/admin/information-requests error:", error);
    return NextResponse.json({ success: false, error: "Gagal memuat permohonan informasi", data: [] }, { status: 500 });
  }
}

async function executeUpdateRequest(body: any, pegawaiId: number | null) {
  // ID permohonan berupa UUID v4.
  const id = body.id;
  if (!isUuidV4(id)) {
    return NextResponse.json({ success: false, error: "ID tidak valid" }, { status: 400 });
  }
  if (body.status !== undefined) {
    if (!["pending", "processing", "accepted", "rejected"].includes(body.status)) {
      return NextResponse.json({ success: false, error: "Data status tidak valid" }, { status: 400 });
    }
    // Pegawai yang memproses permohonan dicatat dari akun admin yang login.
    const adminNote = typeof body.admin_note === "string" ? cleanField(body.admin_note, "Catatan admin") ?? "" : undefined;
    await updateRequestStatus(id, body.status, adminNote, pegawaiId);
  } else {
    // Isian dari form Edit admin juga dibersihkan dengan aturan yang sama seperti formulir publik.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields: Record<string, any> = {};
    for (const [field, maxLength] of Object.entries(TEXT_LIMITS)) {
      if (typeof body[field] === "string") {
        fields[field] = cleanField(body[field], field, { maxLength, required: REQUIRED_FIELDS.has(field) });
      }
    }
    if (typeof body.email === "string") fields.email = cleanEmail(body.email);
    if (typeof body.submitted_on === "string") fields.submitted_on = cleanDate(body.submitted_on, "Tanggal pengajuan");
    if (!Object.keys(fields).length) {
      return NextResponse.json({ success: false, error: "Tidak ada data yang diubah" }, { status: 400 });
    }
    await updateInformationRequest(id, fields);
  }
  return NextResponse.json({ success: true });
}

export async function POST(request: NextRequest) {
  try {
    const session = await allowed(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    if (body.action === "delete" || body._method === "DELETE") {
      const id = body.id;
      if (!isUuidV4(id)) {
        return NextResponse.json({ success: false, error: "ID tidak valid" }, { status: 400 });
      }
      await deleteInformationRequest(id);
      return NextResponse.json({ success: true });
    }
    return await executeUpdateRequest(body, await getPegawaiId(session.user.id));
  } catch (error) {
    if (error instanceof InputValidationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    console.error("POST /api/admin/information-requests error:", error);
    return NextResponse.json({ success: false, error: "Gagal memproses permohonan" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await allowed(request);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    return await executeUpdateRequest(body, await getPegawaiId(session.user.id));
  } catch (error) {
    if (error instanceof InputValidationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    console.error("PUT /api/admin/information-requests error:", error);
    return NextResponse.json({ success: false, error: "Gagal memperbarui status" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  return PUT(request);
}

export async function DELETE(request: NextRequest) {
  try {
    if (!await allowed(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await request.json();
    if (!isUuidV4(id)) {
      return NextResponse.json({ success: false, error: "ID tidak valid" }, { status: 400 });
    }
    await deleteInformationRequest(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/information-requests error:", error);
    return NextResponse.json({ success: false, error: "Gagal menghapus permohonan" }, { status: 500 });
  }
}
