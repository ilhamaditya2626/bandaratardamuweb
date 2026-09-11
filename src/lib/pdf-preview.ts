import fs from "fs/promises";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { getUploadDirectory } from "./document-upload";

export interface PreviewResult {
  totalPages: number;
  previewPages: number;
  previewBuffer: Buffer;
}

/**
 * Memotong buffer PDF asli sehingga hanya menyisakan 20% halaman pertama (minimal 1 halaman).
 */
export async function generatePdfPreview(pdfBuffer: Buffer): Promise<PreviewResult> {
  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const totalPages = pdfDoc.getPageCount();
  const previewPages = Math.max(1, Math.ceil(totalPages * 0.2));

  const previewDoc = await PDFDocument.create();
  const pageIndices = Array.from({ length: previewPages }, (_, i) => i);
  const copiedPages = await previewDoc.copyPages(pdfDoc, pageIndices);
  copiedPages.forEach((page) => previewDoc.addPage(page));

  const previewBytes = await previewDoc.save();
  return {
    totalPages,
    previewPages,
    previewBuffer: Buffer.from(previewBytes),
  };
}

/**
 * Menghitung nama berkas preview dari URL / path berkas asli
 * contoh: /uploads/documents/123-file.pdf -> /uploads/documents/123-file-preview.pdf
 */
export function getPreviewUrlFromOriginal(fileUrl: string): string {
  if (!fileUrl.toLowerCase().endsWith(".pdf")) return fileUrl;
  if (fileUrl.toLowerCase().endsWith("-preview.pdf")) return fileUrl;
  return fileUrl.replace(/\.pdf$/i, "-preview.pdf");
}

/**
 * Mencari path file fisik di disk dari URL (/uploads/... atau /assets/...)
 */
export function resolveDiskPathFromUrl(fileUrl: string): string | null {
  if (fileUrl.startsWith("/uploads/")) {
    const relative = fileUrl.replace(/^\/uploads\//, "");
    return path.join(getUploadDirectory(), ...relative.split("/"));
  }
  if (fileUrl.startsWith("/assets/")) {
    const relative = fileUrl.replace(/^\//, "");
    return path.join(process.cwd(), "public", ...relative.split("/"));
  }
  return null;
}

/**
 * Memastikan berkas preview PDF 20% ada di disk.
 * Jika belum ada, baca file asli, potong 20% dengan pdf-lib, lalu simpan ke disk sebagai cache.
 * Mengembalikan URL preview yang siap diakses pengguna/Google Docs Viewer.
 */
export async function ensureDocumentPreview(fileUrl: string): Promise<string> {
  if (!fileUrl || !fileUrl.toLowerCase().endsWith(".pdf")) {
    return fileUrl;
  }

  // Jika URL sudah merupakan URL preview
  if (fileUrl.toLowerCase().endsWith("-preview.pdf")) {
    return fileUrl;
  }

  const previewUrl = getPreviewUrlFromOriginal(fileUrl);
  const previewDiskPath = resolveDiskPathFromUrl(previewUrl);
  const originalDiskPath = resolveDiskPathFromUrl(fileUrl);

  if (!previewDiskPath || !originalDiskPath) {
    return fileUrl;
  }

  // Cek apakah file preview sudah ada di disk
  try {
    await fs.access(previewDiskPath);
    return previewUrl;
  } catch {
    // File preview belum ada, generate sekarang dari file asli
  }

  try {
    const originalBuffer = await fs.readFile(originalDiskPath);
    const { previewBuffer } = await generatePdfPreview(originalBuffer);

    // Buat direktori tujuan jika belum ada
    await fs.mkdir(path.dirname(previewDiskPath), { recursive: true });
    await fs.writeFile(previewDiskPath, previewBuffer);

    return previewUrl;
  } catch (error) {
    console.error("Gagal membuat pratinjau PDF 20%:", error);
    // Fallback ke berkas asli jika terjadi kendala pemrosesan
    return fileUrl;
  }
}
