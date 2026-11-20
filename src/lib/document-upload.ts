import fs from "fs/promises";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { AllowedFileType, FILE_EXTENSIONS, FileSignatureError, findDangerousPdfContent, verifyUpload } from "./file-signature";

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

// Gambar diproses ulang (disalin ulang) menjadi WebP sehingga data yang disisipkan di dalam berkas ikut hilang,
// termasuk metadata seperti lokasi foto. Gambar yang tidak dapat diproses dianggap rusak dan ditolak.
async function reencodeImage(buffer: Buffer): Promise<Buffer | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let sharp: any = null;
  try {
    const sharpModule = await import("sharp");
    sharp = sharpModule.default || sharpModule;
  } catch (loadError) {
    console.warn("Library sharp tidak dapat dimuat; gambar disimpan tanpa diproses ulang:", loadError);
    return null;
  }
  try {
    return await sharp(buffer)
      .rotate()
      .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
  } catch {
    throw new DocumentUploadError("Gambar rusak atau tidak dapat diproses. Unggah ulang foto yang jelas.");
  }
}

export async function saveUploadedDocument(
  file: File,
  folder: "documents" | "ppid",
  accessType: "umum" | "rahasia" = "umum"
) {
  if (file.size > MAX_DOCUMENT_SIZE) throw new DocumentUploadError("Ukuran file maksimal 20 MB.");

  // Dokumen publik hanya PDF; berkas permohonan boleh PDF atau gambar.
  const allowed: AllowedFileType[] = folder === "documents"
    ? ["application/pdf"]
    : ["application/pdf", "image/jpeg", "image/png", "image/webp"];
  let buffer: Buffer = Buffer.from(await file.arrayBuffer());
  let detectedType: AllowedFileType;
  try {
    // Memeriksa MIME type, magic bytes (isi berkas), dan ekstensi ganda berbahaya.
    detectedType = verifyUpload(file, buffer, allowed);
  } catch (error) {
    if (error instanceof FileSignatureError) {
      throw new DocumentUploadError(
        folder === "documents"
          ? `${error.message} Dokumen publik harus berupa PDF.`
          : `${error.message} Berkas harus berupa PDF, JPG, PNG, atau WebP.`
      );
    }
    throw error;
  }

  // PDF yang berisi kode JavaScript, perintah menjalankan program, atau berkas sisipan ditolak.
  if (detectedType === "application/pdf") {
    const danger = findDangerousPdfContent(buffer);
    if (danger) {
      throw new DocumentUploadError(`PDF ditolak karena mengandung ${danger}. Simpan ulang PDF tanpa bagian tersebut.`);
    }
  }

  // Foto (misalnya KTP) pada permohonan dan keberatan diproses ulang menjadi WebP.
  if (folder === "ppid" && detectedType !== "application/pdf") {
    const reencoded = await reencodeImage(buffer);
    if (reencoded) {
      buffer = reencoded;
      detectedType = "image/webp";
    }
  }

  // Ekstensi diambil dari hasil pemeriksaan isi berkas, bukan dari nama berkas asli.
  const ext = FILE_EXTENSIONS[detectedType];
  const base = file.name.split(".")[0].replace(/[^a-zA-Z0-9-_]/g, "_").slice(0, 80) || "file";
  const fileId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const fileName = `${fileId}-${base}${ext}`;
  const dir = path.join(getUploadDirectory(), folder);

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, fileName), buffer);

  // Hanya dokumen rahasia yang memerlukan berkas pratinjau terbatas (20%).
  if (detectedType === "application/pdf" && folder === "documents" && accessType === "rahasia") {
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
