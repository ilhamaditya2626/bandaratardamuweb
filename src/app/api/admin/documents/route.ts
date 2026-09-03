import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createDocument, deleteDocument, listAllDocumentsAdmin, updateDocument } from "@/services/information.service";
import { DocumentUploadError, saveUploadedDocument, countPdfPages } from "@/lib/document-upload";

async function allowed(r: NextRequest) {
  try {
    return await auth.api.getSession({ headers: r.headers });
  } catch {
    return null;
  }
}

const categories = ["annual_report", "work_budget", "financial_report", "lakip", "dip", "dik"];

export async function GET(r: NextRequest) {
  try {
    if (!await allowed(r)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const data = await listAllDocumentsAdmin();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/admin/documents error:", error);
    return NextResponse.json({ success: false, error: "Gagal memuat dokumen", data: [] }, { status: 500 });
  }
}

export async function POST(r: NextRequest) {
  try {
    if (!await allowed(r)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const f = await r.formData();
    const category = String(f.get("category") || "");
    const title = String(f.get("title") || "").trim();
    const file = f.get("file");

    if (!categories.includes(category) || !title || !(file instanceof File) || !file.size) {
      return NextResponse.json({ success: false, error: "Kategori, judul, dan PDF wajib diisi." }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ success: false, error: "Dokumen publik harus berupa PDF." }, { status: 400 });
    }

    const total_pages = await countPdfPages(file);
    const file_url = await saveUploadedDocument(file, "documents");

    await createDocument({
      category,
      title,
      description: String(f.get("description") || "") || null,
      document_date: String(f.get("document_date") || "") || null,
      file_url,
      file_name: file.name,
      total_pages,
      is_published: true,
    });

    return NextResponse.json({ success: true, total_pages }, { status: 201 });
  } catch (e) {
    console.error("POST /api/admin/documents error:", e);
    return NextResponse.json(
      { success: false, error: e instanceof DocumentUploadError ? e.message : "Unggahan gagal." },
      { status: 500 }
    );
  }
}

export async function DELETE(r: NextRequest) {
  try {
    if (!await allowed(r)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await r.json();
    if (!Number.isInteger(Number(id))) {
      return NextResponse.json({ success: false, error: "ID tidak valid" }, { status: 400 });
    }
    await deleteDocument(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/documents error:", error);
    return NextResponse.json({ success: false, error: "Gagal menghapus dokumen" }, { status: 500 });
  }
}

export async function PATCH(r: NextRequest) {
  try {
    if (!await allowed(r)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const body = await r.json();
    const id = Number(body.id);
    const category = String(body.category || "");
    const title = String(body.title || "").trim();
    if (!Number.isInteger(id) || !categories.includes(category) || !title) {
      return NextResponse.json({ success: false, error: "ID, kategori, dan judul wajib diisi." }, { status: 400 });
    }
    await updateDocument(id, {
      category,
      title,
      description: typeof body.description === "string" ? body.description.trim() || null : null,
      document_date: typeof body.document_date === "string" ? body.document_date || null : null,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/admin/documents error:", error);
    return NextResponse.json({ success: false, error: "Gagal memperbarui dokumen" }, { status: 500 });
  }
}
