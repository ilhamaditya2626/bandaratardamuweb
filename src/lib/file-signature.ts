// Validasi berkas unggahan berdasarkan isi berkas, bukan hanya nama atau jenis yang dikirim peramban.
// - MIME type dari peramban harus termasuk jenis yang diizinkan.
// - Magic bytes (beberapa byte pertama isi berkas) harus cocok dengan jenis tersebut.
// - Nama berkas dengan ekstensi ganda berbahaya (misalnya foto.php.jpg) ditolak.
// Ekstensi berkas yang disimpan ditentukan dari isi berkas, bukan dari nama aslinya.

export type AllowedFileType = "application/pdf" | "image/jpeg" | "image/png" | "image/webp";

export const FILE_EXTENSIONS: Record<AllowedFileType, string> = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const DANGEROUS_EXTENSIONS = new Set([
  "php", "php3", "php4", "php5", "php7", "phtml", "phar", "pht", "shtml", "html", "htm", "xhtml",
  "js", "mjs", "cjs", "jsx", "ts", "tsx", "svg", "xml", "exe", "dll", "bat", "cmd", "com", "msi",
  "sh", "bash", "ps1", "vbs", "jar", "py", "pl", "cgi", "rb", "asp", "aspx", "jsp", "jspx", "war",
  "htaccess", "ini", "env", "config",
]);

// Ekstensi sisipan PDF yang dianggap berbahaya (berkas .xml tidak termasuk karena dipakai Word untuk rumus).
const DANGEROUS_EMBEDDED_EXTENSIONS = new Set([...DANGEROUS_EXTENSIONS].filter((ext) => ext !== "xml"));

export class FileSignatureError extends Error {}

function startsWith(buffer: Buffer, bytes: number[], offset = 0) {
  return buffer.length >= offset + bytes.length && bytes.every((byte, i) => buffer[offset + i] === byte);
}

export function detectFileType(buffer: Buffer): AllowedFileType | null {
  if (startsWith(buffer, [0x25, 0x50, 0x44, 0x46, 0x2d])) return "application/pdf"; // %PDF-
  if (startsWith(buffer, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (startsWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  if (startsWith(buffer, [0x52, 0x49, 0x46, 0x46]) && startsWith(buffer, [0x57, 0x45, 0x42, 0x50], 8)) {
    return "image/webp"; // RIFF....WEBP
  }
  return null;
}

export function assertSafeFileName(fileName: string) {
  const parts = fileName.toLowerCase().split(".").map((part) => part.trim());
  // Bagian pertama adalah nama berkas; sisanya adalah ekstensi (termasuk ekstensi ganda).
  if (parts.slice(1).some((ext) => DANGEROUS_EXTENSIONS.has(ext))) {
    throw new FileSignatureError("Nama berkas mengandung ekstensi yang tidak diizinkan.");
  }
  if (/[\\/\u0000]/.test(fileName)) {
    throw new FileSignatureError("Nama berkas tidak valid.");
  }
}

// Mengembalikan jenis berkas hasil pemeriksaan isi; melempar galat jika tidak lolos.
export function verifyUpload(
  file: File,
  buffer: Buffer,
  allowedTypes: AllowedFileType[]
): AllowedFileType {
  assertSafeFileName(file.name || "");
  if (!allowedTypes.includes(file.type as AllowedFileType)) {
    throw new FileSignatureError("Jenis berkas tidak diizinkan.");
  }
  const detected = detectFileType(buffer);
  if (!detected || !allowedTypes.includes(detected)) {
    throw new FileSignatureError("Isi berkas tidak sesuai dengan format yang diizinkan.");
  }
  if (detected !== file.type) {
    throw new FileSignatureError("Isi berkas tidak sesuai dengan jenis berkas yang dikirim.");
  }
  return detected;
}

// Bagian PDF yang dapat menjalankan kode atau membuka berkas lain saat PDF dibuka.
const DANGEROUS_PDF_PARTS: { pattern: RegExp; label: string }[] = [
  { pattern: /\/JavaScript(?![A-Za-z])/, label: "kode JavaScript" },
  { pattern: /\/JS(?![A-Za-z])/, label: "kode JavaScript" },
  { pattern: /\/Launch(?![A-Za-z])/, label: "perintah menjalankan program" },
  { pattern: /\/RichMedia(?![A-Za-z])/, label: "media sisipan" },
  { pattern: /\/XFA(?![A-Za-z])/, label: "formulir XFA" },
];

// Memeriksa isi PDF. Mengembalikan keterangan bagian berbahaya yang ditemukan, atau null jika aman.
export function findDangerousPdfContent(buffer: Buffer): string | null {
  // Nama di PDF dapat disamarkan dengan kode #xx (misalnya /J#61vaScript), jadi dikembalikan dulu ke huruf biasa.
  const text = buffer
    .toString("latin1")
    .replace(/#([0-9A-Fa-f]{2})/g, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)));
  const found = DANGEROUS_PDF_PARTS.find(({ pattern }) => pattern.test(text));
  if (found) return found.label;

  // Berkas sisipan diperiksa namanya. Sisipan wajar (misalnya rumus dari Microsoft Word berbentuk .xml)
  // tetap diterima, tetapi sisipan berupa program atau skrip (.exe, .js, .html, dan sejenisnya) ditolak.
  if (/\/EmbeddedFiles?(?![A-Za-z])/.test(text)) {
    const names = [...text.matchAll(/\/(?:UF|F)\s*\(([^)]{1,200})\)/g)].map((match) => match[1].toLowerCase());
    const risky = names.some((name) => name.split(".").slice(1).some((ext) => DANGEROUS_EMBEDDED_EXTENSIONS.has(ext.trim())));
    if (risky) return "berkas sisipan berupa program atau skrip";
  }
  return null;
}
