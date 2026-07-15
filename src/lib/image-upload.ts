import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

// Batas & konfigurasi pemrosesan gambar (samakan dengan fitur Berita).
const MAX_IMAGE_SIZE = 15 * 1024 * 1024;
const IMAGE_MAX_DIMENSION = 1600;
const WEBP_QUALITY = 80;

export class ImageUploadError extends Error {}

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
    throw new ImageUploadError("File yang diupload harus berupa gambar");
  }

  if (image.size > MAX_IMAGE_SIZE) {
    throw new ImageUploadError("Ukuran gambar maksimal 15 MB");
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

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
  } catch {
    throw new ImageUploadError(
      "Gagal memproses gambar. Gunakan file JPG, PNG, WebP, atau format gambar umum lainnya.",
    );
  }

  return `/uploads/${fileName}`;
}
