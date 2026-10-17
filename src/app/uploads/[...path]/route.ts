import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const REMOTE_BASE_URL = process.env.SITE_URL || "https://tardamuairport.id";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await context.params;
  const relativeFilePath = pathSegments.join("/");
  const localFilePath = path.join(process.cwd(), "public", "uploads", ...pathSegments);

  // 1. Cek apakah file ada di disk lokal
  if (fs.existsSync(localFilePath)) {
    try {
      const fileBuffer = fs.readFileSync(localFilePath);
      const ext = path.extname(localFilePath).toLowerCase();
      const mimeTypes: Record<string, string> = {
        ".webp": "image/webp",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".pdf": "application/pdf",
      };
      const contentType = mimeTypes[ext] || "application/octet-stream";

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch (e) {
      console.error("Gagal membaca file lokal uploads:", e);
    }
  }

  // 2. Jika file tidak ada di lokal (misal database tersambung ke remote/VPS saat mode dev),
  // tarik file dari server production (https://tardamuairport.id/uploads/...)
  try {
    const remoteUrl = `${REMOTE_BASE_URL}/uploads/${relativeFilePath}`;
    const remoteResponse = await fetch(remoteUrl);

    if (remoteResponse.ok) {
      const contentType = remoteResponse.headers.get("content-type") || "image/webp";
      const buffer = Buffer.from(await remoteResponse.arrayBuffer());

      // Simpan salinan ke folder lokal agar request berikutnya langsung cepat dari disk
      try {
        const dir = path.dirname(localFilePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(localFilePath, buffer);
      } catch (saveErr) {
        // Abaikan jika folder write-protected
      }

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400",
        },
      });
    }
  } catch (remoteErr) {
    console.error("Gagal fetch gambar dari remote fallback:", remoteErr);
  }

  return new NextResponse("File tidak ditemukan", { status: 404 });
}
