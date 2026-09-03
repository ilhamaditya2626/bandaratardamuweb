import fs from "fs/promises";
import path from "path";

const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024;
export class DocumentUploadError extends Error {}

// PDF menyimpan setiap halaman sebagai objek `/Type /Page`; `Pages` (pohon
// halaman) sengaja tidak ikut dihitung oleh ekspresi ini.
export async function countPdfPages(file: File): Promise<number> {
  if (file.type !== "application/pdf") return 0;
  const content = Buffer.from(await file.arrayBuffer()).toString("latin1");
  return (content.match(/\/Type\s*\/Page\b/g) || []).length;
}

export async function saveUploadedDocument(file: File, folder: "documents" | "ppid") {
  const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) throw new DocumentUploadError("File harus berupa PDF, JPG, PNG, atau WebP.");
  if (file.size > MAX_DOCUMENT_SIZE) throw new DocumentUploadError("Ukuran file maksimal 20 MB.");
  const ext = file.type === "application/pdf" ? ".pdf" : `.${file.name.split(".").pop()?.toLowerCase() || "bin"}`;
  const base = path.parse(file.name).name.replace(/[^a-zA-Z0-9-_]/g, "_").slice(0, 80) || "file";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, fileName), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${folder}/${fileName}`;
}
