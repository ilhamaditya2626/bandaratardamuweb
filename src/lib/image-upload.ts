import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { getUploadDirectory } from "@/lib/document-upload";

// Batas & konfigurasi pemrosesan gambar (samakan dengan fitur Berita).
const MAX_IMAGE_SIZE = 15 * 1024 * 1024;
const IMAGE_MAX_DIMENSION = 1600;
const WEBP_QUALITY = 80;

export class ImageUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageUploadError";
  }
}

function createSafeImageName(originalName: string, fallback: string) {
  const parsedName = path.parse(originalName || fallback).name;
  const safeBaseName = parsedName
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);

  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${
    safeBaseName || fallback
  }.webp`;
}

// Simpan sebuah File gambar sebagai WebP di public/uploads dan
// kembalikan path publiknya (mis. "/uploads/xxx.webp").
export async function saveImageAsWebp(
  image: File,
  fallbackName = "image",
): Promise<string> {
  if (!image.type.startsWith("image/")) {
    throw new ImageUploadError("File yang diupload harus berupa gambar.");
  }

  if (image.size > MAX_IMAGE_SIZE) {
    throw new ImageUploadError("Ukuran gambar maksimal 15 MB.");
  }

  const uploadDir = getUploadDirectory();
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (dirErr) {
    console.error("Gagal membuat/mengakses uploadDir:", uploadDir, dirErr);
    throw new ImageUploadError("Gagal mengakses folder penyimpanan di server.");
  }

  const inputBuffer = Buffer.from(await image.arrayBuffer());
  const fileName = createSafeImageName(image.name, fallbackName);
  const filePath = path.join(uploadDir, fileName);

  try {
    const webpBuffer = await sharp(inputBuffer)
      .rotate()
      .resize({
        width: IMAGE_MAX_DIMENSION,
        height: IMAGE_MAX_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY, effort: 5 })
      .toBuffer();

    await fs.writeFile(filePath, webpBuffer);
    return `/uploads/${fileName}`;
  } catch (sharpError) {
    console.warn("Sharp webp processing failed, falling back to original buffer:", sharpError);
    // Fallback: simpan buffer gambar asli langsung jika kompresi sharp gagal
    try {
      const ext = path.extname(image.name).toLowerCase() || (image.type === "image/png" ? ".png" : ".jpg");
      const fallbackFileName = fileName.replace(/\.webp$/, ext);
      const fallbackFilePath = path.join(uploadDir, fallbackFileName);
      await fs.writeFile(fallbackFilePath, inputBuffer);
      return `/uploads/${fallbackFileName}`;
    } catch (writeErr) {
      console.error("Gagal menulis file gambar ke disk:", writeErr);
      throw new ImageUploadError(
        "Gagal menyimpan file gambar ke disk server. Periksa hak akses folder uploads."
      );
    }
  }
}
