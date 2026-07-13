import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

import { auth } from "@/lib/auth";
import { createNews, deleteNews, updateNews } from "@/services/news.service";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 15 * 1024 * 1024;
const IMAGE_MAX_DIMENSION = 1600;
const WEBP_QUALITY = 80;

class ImageUploadError extends Error {}

async function verifyAdmin(request: NextRequest) {
  return auth.api.getSession({
    headers: request.headers,
  });
}

function createSafeImageName(originalName: string) {
  const parsedName = path.parse(originalName || "news-image").name;
  const safeBaseName = parsedName
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);

  return `${Date.now()}-${safeBaseName || "news-image"}.webp`;
}

async function saveNewsImageAsWebp(image: File) {
  if (!image.type.startsWith("image/")) {
    throw new ImageUploadError("File yang diupload harus berupa gambar");
  }

  if (image.size > MAX_IMAGE_SIZE) {
    throw new ImageUploadError("Ukuran gambar maksimal 15 MB");
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  const inputBuffer = Buffer.from(await image.arrayBuffer());
  const fileName = createSafeImageName(image.name);
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
      .webp({
        quality: WEBP_QUALITY,
        effort: 5,
      })
      .toBuffer();

    await fs.writeFile(filePath, webpBuffer);
  } catch {
    throw new ImageUploadError(
      "Gagal memproses gambar. Gunakan file JPG, PNG, WebP, atau format gambar umum lainnya."
    );
  }

  return `/uploads/${fileName}`;
}

function imageUploadErrorResponse(error: ImageUploadError) {
  return NextResponse.json(
    { success: false, error: error.message },
    { status: 400 }
  );
}

// POST /api/admin/news - Create news
export async function POST(request: NextRequest) {
  const session = await verifyAdmin(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const title = formData.get("title")?.toString();
    const content = formData.get("content")?.toString();
    const image = formData.get("image") as File | null;
    let image_url = formData.get("image_url")?.toString() || undefined;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Fields 'title' dan 'content' wajib diisi" },
        { status: 400 }
      );
    }

    if (image && image.size > 0) {
      image_url = await saveNewsImageAsWebp(image);
    }

    const article = await createNews({ title, content, image_url });
    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/news error:", error);

    if (error instanceof ImageUploadError) {
      return imageUploadErrorResponse(error);
    }

    return NextResponse.json(
      { success: false, error: "Gagal menambahkan berita" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/news - Update news
export async function PUT(request: NextRequest) {
  const session = await verifyAdmin(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const idStr = formData.get("id")?.toString();
    const title = formData.get("title")?.toString();
    const content = formData.get("content")?.toString();
    const image = formData.get("image") as File | null;
    const image_url = formData.get("image_url")?.toString() || undefined;

    if (!idStr) {
      return NextResponse.json(
        { success: false, error: "Field 'id' wajib diisi" },
        { status: 400 }
      );
    }

    const id = parseInt(idStr, 10);
    const updateData: {
      title?: string;
      content?: string;
      image_url?: string;
    } = {};

    if (title) updateData.title = title;
    if (content) updateData.content = content;

    if (image && image.size > 0) {
      updateData.image_url = await saveNewsImageAsWebp(image);
    } else if (image_url !== undefined) {
      updateData.image_url = image_url;
    }

    const article = await updateNews(id, updateData);

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Berita tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error("PUT /api/admin/news error:", error);

    if (error instanceof ImageUploadError) {
      return imageUploadErrorResponse(error);
    }

    return NextResponse.json(
      { success: false, error: "Gagal memperbarui berita" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/news - Delete news
export async function DELETE(request: NextRequest) {
  const session = await verifyAdmin(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Field 'id' wajib diisi" },
        { status: 400 }
      );
    }

    const article = await deleteNews(body.id);

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Berita tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error("DELETE /api/admin/news error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus berita" },
      { status: 500 }
    );
  }
}
