import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { ImageUploadError, saveImageAsWebp } from "@/lib/image-upload";
import { createNews, deleteNews, updateNews } from "@/services/news.service";

export const runtime = "nodejs";

async function verifyAdmin(request: NextRequest) {
  try {
    return await auth.api.getSession({
      headers: request.headers,
    });
  } catch (error) {
    console.error("verifyAdmin session error:", error);
    return null;
  }
}

function imageUploadErrorResponse(error: ImageUploadError | { message: string }) {
  return NextResponse.json(
    { success: false, error: error.message },
    { status: 400 }
  );
}

function triggerRevalidation(slug?: string | null) {
  try {
    revalidatePath("/");
    revalidatePath("/berita");
    revalidatePath("/informasi-berkala");
    if (slug) {
      revalidatePath(`/berita/${slug}`);
    }
  } catch (err) {
    console.error("revalidate error:", err);
  }
}

async function handleCreate(formData: FormData) {
  const title = formData.get("title")?.toString()?.trim();
  const content = formData.get("content")?.toString()?.trim();
  const image = formData.get("image") as File | null;
  let image_url = formData.get("image_url")?.toString() || undefined;
  const createdAtStr = formData.get("created_at")?.toString();

  if (!title || !content) {
    return NextResponse.json(
      { success: false, error: "Judul dan konten berita wajib diisi." },
      { status: 400 }
    );
  }

  if (image && image.size > 0) {
    image_url = await saveImageAsWebp(image, "news");
  }

  let created_at: Date | undefined;
  if (createdAtStr) {
    const parsedDate = new Date(createdAtStr);
    if (!isNaN(parsedDate.getTime())) {
      created_at = parsedDate;
    }
  }

  const article = await createNews({ title, content, image_url, created_at });
  triggerRevalidation((article as any)?.slug);
  return NextResponse.json({ success: true, data: article }, { status: 201 });
}

async function handleUpdate(formData: FormData) {
  const idStr = formData.get("id")?.toString();
  const title = formData.get("title")?.toString()?.trim();
  const content = formData.get("content")?.toString()?.trim();
  const image = formData.get("image") as File | null;
  const image_url = formData.get("image_url")?.toString() || undefined;
  const createdAtStr = formData.get("created_at")?.toString();

  if (!idStr) {
    return NextResponse.json(
      { success: false, error: "ID berita wajib diisi." },
      { status: 400 }
    );
  }

  const id = parseInt(idStr, 10);
  if (isNaN(id)) {
    return NextResponse.json(
      { success: false, error: "ID berita tidak valid." },
      { status: 400 }
    );
  }

  const updateData: {
    title?: string;
    content?: string;
    image_url?: string;
    created_at?: Date;
  } = {};

  if (title) updateData.title = title;
  if (content) updateData.content = content;
  if (createdAtStr) {
    const parsedDate = new Date(createdAtStr);
    if (!isNaN(parsedDate.getTime())) {
      updateData.created_at = parsedDate;
    }
  }

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

  triggerRevalidation(article.slug);
  return NextResponse.json({ success: true, data: article });
}

// POST /api/admin/news
// Mendukung Create, Update, dan Delete via POST karena web server produksi (LiteSpeed/cPanel)
// memblokir HTTP method PUT dan DELETE secara default dengan 403 Forbidden.
export async function POST(request: NextRequest) {
  const session = await verifyAdmin(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Sesi login tidak sah atau telah berakhir. Silakan login kembali." },
      { status: 401 }
    );
  }

  try {
    const contentType = request.headers.get("content-type") || "";

    // Tangani jika dikirim via JSON (misal payload delete atau JSON update)
    if (contentType.includes("application/json")) {
      const body = await request.json();

      if (body.action === "delete" || body._method === "DELETE") {
        const id = Number(body.id);
        if (!id || isNaN(id)) {
          return NextResponse.json({ success: false, error: "ID berita wajib diisi" }, { status: 400 });
        }
        const article = await deleteNews(id);
        if (!article) {
          return NextResponse.json({ success: false, error: "Berita tidak ditemukan" }, { status: 404 });
        }
        triggerRevalidation(article.slug);
        return NextResponse.json({ success: true, data: article });
      }

      if (body.id || body.action === "update" || body._method === "PUT") {
        const id = Number(body.id);
        if (!id || isNaN(id)) {
          return NextResponse.json({ success: false, error: "ID berita wajib diisi" }, { status: 400 });
        }
        const { id: _, ...data } = body;
        const article = await updateNews(id, data);
        if (!article) {
          return NextResponse.json({ success: false, error: "Berita tidak ditemukan" }, { status: 404 });
        }
        triggerRevalidation(article.slug);
        return NextResponse.json({ success: true, data: article });
      }
    }

    // Tangani FormData (Create atau Update dengan gambar)
    const formData = await request.formData();
    const idStr = formData.get("id")?.toString();
    const action = formData.get("action")?.toString();

    // Jika ada ID atau action update, jalankan Update
    if (action === "update" || (idStr && idStr.trim() !== "")) {
      return await handleUpdate(formData);
    }

    // Jika action delete via FormData
    if (action === "delete") {
      const id = parseInt(idStr || "", 10);
      if (isNaN(id)) {
        return NextResponse.json({ success: false, error: "ID berita tidak valid." }, { status: 400 });
      }
      const article = await deleteNews(id);
      if (!article) {
        return NextResponse.json({ success: false, error: "Berita tidak ditemukan" }, { status: 404 });
      }
      triggerRevalidation(article.slug);
      return NextResponse.json({ success: true, data: article });
    }

    // Default: Create news
    return await handleCreate(formData);
  } catch (error: any) {
    console.error("POST /api/admin/news error:", error);

    if (error instanceof ImageUploadError || error?.name === "ImageUploadError") {
      return imageUploadErrorResponse(error);
    }

    return NextResponse.json(
      { success: false, error: error?.message || "Gagal memproses berita" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/news - Tetap disediakan untuk backward compatibility jika dipanggil lewat PUT
export async function PUT(request: NextRequest) {
  const session = await verifyAdmin(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Sesi login tidak sah atau telah berakhir. Silakan login kembali." },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    return await handleUpdate(formData);
  } catch (error: any) {
    console.error("PUT /api/admin/news error:", error);

    if (error instanceof ImageUploadError || error?.name === "ImageUploadError") {
      return imageUploadErrorResponse(error);
    }

    return NextResponse.json(
      { success: false, error: error?.message || "Gagal memperbarui berita" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/news - Tetap disediakan untuk backward compatibility jika dipanggil lewat DELETE
export async function DELETE(request: NextRequest) {
  const session = await verifyAdmin(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Sesi login tidak sah atau telah berakhir. Silakan login kembali." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "ID berita wajib diisi." },
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

    triggerRevalidation(article.slug);
    return NextResponse.json({ success: true, data: article });
  } catch (error: any) {
    console.error("DELETE /api/admin/news error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal menghapus berita" },
      { status: 500 }
    );
  }
}
