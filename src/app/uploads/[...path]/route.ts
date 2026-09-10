import fs from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getUploadDirectory } from "@/lib/document-upload";

export const runtime = "nodejs";

const contentTypes: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: requestedPath } = await params;

  // Jangan pernah membiarkan URL membaca file lain di VPS.
  if (!requestedPath.length || requestedPath.some((part) => !part || part === "." || part === ".." || part !== path.basename(part))) {
    return new NextResponse("Not found", { status: 404 });
  }

  const root = path.resolve(getUploadDirectory());
  const filePath = path.resolve(root, ...requestedPath);
  if (!filePath.startsWith(`${root}${path.sep}`)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const file = await fs.readFile(filePath);
    const contentType = contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
