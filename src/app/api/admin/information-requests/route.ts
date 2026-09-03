import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deleteInformationRequest, listRequests, updateInformationRequest, updateRequestStatus } from "@/services/information.service";

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

export async function PATCH(request: NextRequest) {
  try {
    if (!await allowed(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const id = Number(body.id);
    if (!Number.isInteger(id)) {
      return NextResponse.json({ success: false, error: "ID tidak valid" }, { status: 400 });
    }
    if (body.status !== undefined) {
      if (!["pending", "accepted", "rejected"].includes(body.status)) {
        return NextResponse.json({ success: false, error: "Data status tidak valid" }, { status: 400 });
      }
      await updateRequestStatus(id, body.status, typeof body.admin_note === "string" ? body.admin_note : undefined);
    } else {
      const fields = Object.fromEntries(
        ["name", "email", "phone", "address", "occupation", "institution", "information_detail", "purpose", "objection_reason", "objection_reason_other", "case_position", "submitted_on", "admin_note"]
          .filter((field) => typeof body[field] === "string")
          .map((field) => [field, body[field].trim() || null])
      );
      if (!Object.keys(fields).length) {
        return NextResponse.json({ success: false, error: "Tidak ada data yang diubah" }, { status: 400 });
      }
      await updateInformationRequest(id, fields);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/admin/information-requests error:", error);
    return NextResponse.json({ success: false, error: "Gagal memperbarui status" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!await allowed(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await request.json();
    if (!Number.isInteger(Number(id))) {
      return NextResponse.json({ success: false, error: "ID tidak valid" }, { status: 400 });
    }
    await deleteInformationRequest(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/information-requests error:", error);
    return NextResponse.json({ success: false, error: "Gagal menghapus permohonan" }, { status: 500 });
  }
}
