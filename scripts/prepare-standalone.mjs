import { cpSync, existsSync, rmSync } from "fs";
import { join } from "path";

const root = process.cwd();
const standaloneDir = join(root, ".next", "standalone");

if (!existsSync(standaloneDir)) {
  throw new Error("Folder .next/standalone tidak ditemukan. Pastikan next.config.ts memakai output: 'standalone'.");
}

const copies = [
  {
    from: join(root, ".next", "static"),
    to: join(standaloneDir, ".next", "static"),
  },
  {
    from: join(root, "public"),
    to: join(standaloneDir, "public"),
  },
];

for (const { from, to } of copies) {
  if (!existsSync(from)) {
    throw new Error(`Source tidak ditemukan: ${from}`);
  }

  if (existsSync(to)) {
    rmSync(to, { recursive: true, force: true });
  }

  cpSync(from, to, { recursive: true });
}

const requiredFiles = [
  join(standaloneDir, "server.js"),
  join(standaloneDir, ".next", "static"),
  join(standaloneDir, "public"),
  join(standaloneDir, "node_modules", "next", "dist", "compiled", "cookie", "index.js"),
];

for (const filePath of requiredFiles) {
  if (!existsSync(filePath)) {
    throw new Error(`Standalone belum lengkap, file/folder wajib tidak ditemukan: ${filePath}`);
  }
}

console.log("Standalone assets siap: public dan .next/static sudah disalin.");
