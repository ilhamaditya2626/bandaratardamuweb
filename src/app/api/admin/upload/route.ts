import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { FileUploadError, saveFile } from "@/lib/file-upload";

export async function POST(request: NextRequest) {
  if (!(await auth.api.getSession({ headers: request.headers }))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "Berkas tidak ditemukan" }, { status: 400 });
    }
    const saved = await saveFile(file, {
      baseDir: path.join(process.cwd(), "storage", "documents"),
      allowedTypes: ["application/pdf"],
      maxMB: 25,
    });
    return NextResponse.json({ success: true, url: `/api/files/documents/${saved.fileName}`, name: saved.originalName });
  } catch (error) {
    if (error instanceof FileUploadError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ success: false, error: "Gagal mengunggah berkas" }, { status: 500 });
  }
}