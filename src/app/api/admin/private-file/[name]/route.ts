import fs from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(request: NextRequest, context: { params: Promise<{ name: string }> }) {
  if (!(await auth.api.getSession({ headers: request.headers }))) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const { name } = await context.params;
  const type = TYPES[path.extname(name).toLowerCase()];
  if (!type || !/^[a-zA-Z0-9._-]+$/.test(name)) return new NextResponse("Not found", { status: 404 });
  try {
    const file = await fs.readFile(path.join(process.cwd(), "storage", "private", name));
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": type,
        "Content-Disposition": `inline; filename="${name}"`,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}