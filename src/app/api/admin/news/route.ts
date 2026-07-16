import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { ImageUploadError, saveImageAsWebp } from "@/lib/image-upload";
import { createNews, deleteNews, updateNews } from "@/services/news.service";

export const runtime = "nodejs";

async function verifyAdmin(request: NextRequest) {
  return auth.api.getSession({
    headers: request.headers,
  });
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
      image_url = await saveImageAsWebp(image, "news");
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
      updateData.image_url = await saveImageAsWebp(image, "news");
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
