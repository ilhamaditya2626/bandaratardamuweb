import fs from "fs/promises";
import path from "path";
import { PDFDocument } from "pdf-lib";

const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024;
export class DocumentUploadError extends Error {}

// Pada VPS, isi UPLOAD_DIR dengan lokasi di luar folder aplikasi/deploy.
// Fallback ini hanya untuk pengembangan lokal.
export function getUploadDirectory() {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");
}

export async function countPdfPages(file: File): Promise<number> {
  if (file.type !== "application/pdf") return 0;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    return doc.getPageCount();
  } catch {
    // Fallback jika terjadi kendala pada parser
    const content = Buffer.from(await file.arrayBuffer()).toString("latin1");
    return (content.match(/\/Type\s*\/Page\b/g) || []).length;
  }
}

export async function saveUploadedDocument(file: File, folder: "documents" | "ppid") {
  const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) throw new DocumentUploadError("File harus berupa PDF, JPG, PNG, atau WebP.");
  if (file.size > MAX_DOCUMENT_SIZE) throw new DocumentUploadError("Ukuran file maksimal 20 MB.");

  const ext = file.type === "application/pdf" ? ".pdf" : `.${file.name.split(".").pop()?.toLowerCase() || "bin"}`;
  const base = path.parse(file.name).name.replace(/[^a-zA-Z0-9-_]/g, "_").slice(0, 80) || "file";
  const fileId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const fileName = `${fileId}-${base}${ext}`;
  const dir = path.join(getUploadDirectory(), folder);

  await fs.mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, fileName), buffer);

  // Jika berupa PDF dokumen publik, buat juga berkas pratinjau 20% secara otomatis
  if (file.type === "application/pdf" && folder === "documents") {
    try {
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const totalPages = pdfDoc.getPageCount();
      const previewPages = Math.max(1, Math.ceil(totalPages * 0.2));

      const previewDoc = await PDFDocument.create();
      const pageIndices = Array.from({ length: previewPages }, (_, i) => i);
      const copiedPages = await previewDoc.copyPages(pdfDoc, pageIndices);
      copiedPages.forEach((page) => previewDoc.addPage(page));

      const previewBytes = await previewDoc.save();
      const previewFileName = `${fileId}-${base}-preview.pdf`;
      await fs.writeFile(path.join(dir, previewFileName), Buffer.from(previewBytes));
    } catch (err) {
      console.error("Gagal membuat pratinjau awal saat unggah dokumen:", err);
    }
  }

  return `/uploads/${folder}/${fileName}`;
}
