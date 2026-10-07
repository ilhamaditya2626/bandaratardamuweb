import fs from "fs/promises";
import path from "path";

export class FileUploadError extends Error {}

const EXTENSIONS: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export async function saveFile(
  file: File,
  options: { baseDir: string; allowedTypes: string[]; maxMB: number },
) {
  const extension = EXTENSIONS[file.type];
  if (!extension || !options.allowedTypes.includes(file.type)) {
    throw new FileUploadError("Jenis berkas tidak diizinkan");
  }
  if (file.size > options.maxMB * 1024 * 1024) {
    throw new FileUploadError(`Ukuran berkas maksimal ${options.maxMB} MB`);
  }
  await fs.mkdir(options.baseDir, { recursive: true });
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;
  await fs.writeFile(path.join(options.baseDir, fileName), Buffer.from(await file.arrayBuffer()));
  return { fileName, originalName: file.name };
}