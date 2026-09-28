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

const categories = ["annual_report", "work_budget", "financial_report", "lakip", "bmn", "surat", "sop", "dip", "dik"];
const annualSubcategories = ["ppid", "laporan_tahunan", "bmn", "surat"];

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
    const contentType = r.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await r.json();
      if (body.action === "delete" || body._method === "DELETE") {
        const id = Number(body.id);
        if (!Number.isInteger(id)) {
          return NextResponse.json({ success: false, error: "ID tidak valid" }, { status: 400 });
        }
        await deleteDocument(id);
        return NextResponse.json({ success: true });
      }
      return await executeUpdateDocument(body);
    }
    const f = await r.formData();
    const category = String(f.get("category") || "");
    const title = String(f.get("title") || "").trim();
    const file = f.get("file");

    const isFileValid = file && typeof file === "object" && "size" in file && Number((file as any).size) > 0;

    const debugInfo = {
      keys: Array.from(f.keys()),
      category,
      title,
      fileRaw: file ? {
        type: typeof file,
        constructor: file.constructor?.name,
        name: (file as any)?.name,
        size: (file as any)?.size,
        mime: (file as any)?.type,
      } : null,
      isFileValid,
    };

    try {
      const fsSync = require("fs");
      fsSync.appendFileSync("upload_debug.log", new Date().toISOString() + " - " + JSON.stringify(debugInfo, null, 2) + "\n\n");
    } catch (e) {
      console.error("Failed to write debug log", e);
    }

    if (!categories.includes(category)) {
      return NextResponse.json({ success: false, error: `Kategori tidak valid (${category}).` }, { status: 400 });
    }
    if (!title) {
      return NextResponse.json({ success: false, error: "Judul dokumen wajib diisi." }, { status: 400 });
    }
    if (!isFileValid) {
      return NextResponse.json({ success: false, error: "Berkas PDF wajib dipilih dan tidak boleh kosong." }, { status: 400 });
    }

    const fileObj = file as File;
    const isPdf = fileObj.type === "application/pdf" || fileObj.name?.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      return NextResponse.json({ success: false, error: "Dokumen publik harus berupa PDF." }, { status: 400 });
    }

    let subcategory: string | null = null;
    if (category === "annual_report") {
      const sub = String(f.get("subcategory") || "").trim().toLowerCase();
      subcategory = annualSubcategories.includes(sub) ? sub : "ppid";
    }

    const rawAccess = String(f.get("access_type") || "").trim().toLowerCase();
    const access_type = rawAccess === "rahasia" ? "rahasia" : "umum";

    const total_pages = await countPdfPages(file);
    const file_url = await saveUploadedDocument(file, "documents", access_type);

    await createDocument({
      category,
      subcategory,
      title,
      description: String(f.get("description") || "") || null,
      document_date: String(f.get("document_date") || "") || null,
      file_url,
      file_name: file.name,
      total_pages,
      is_published: true,
      access_type,
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

async function executeUpdateDocument(body: any) {
  const id = Number(body.id);
  const category = String(body.category || "");
  const title = String(body.title || "").trim();
  if (!Number.isInteger(id) || !categories.includes(category) || !title) {
    return NextResponse.json({ success: false, error: "ID, kategori, dan judul wajib diisi." }, { status: 400 });
  }
  let subcategory: string | null = null;
  if (category === "annual_report") {
    const sub = String(body.subcategory || "").trim().toLowerCase();
    subcategory = annualSubcategories.includes(sub) ? sub : "ppid";
  }
  await updateDocument(id, {
    category,
    subcategory,
    title,
    description: typeof body.description === "string" ? body.description.trim() || null : null,
    document_date: typeof body.document_date === "string" ? body.document_date || null : null,
    access_type: body.access_type === "rahasia" ? "rahasia" : "umum",
    });
  return NextResponse.json({ success: true });
}

async function handleUpdateDocument(r: NextRequest) {
  try {
    if (!await allowed(r)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const body = await r.json();
    return await executeUpdateDocument(body);
  } catch (error) {
    console.error("PUT/PATCH /api/admin/documents error:", error);
    return NextResponse.json({ success: false, error: "Gagal memperbarui dokumen" }, { status: 500 });
  }
}

export async function PUT(r: NextRequest) {
  return handleUpdateDocument(r);
}

export async function PATCH(r: NextRequest) {
  return handleUpdateDocument(r);
}
