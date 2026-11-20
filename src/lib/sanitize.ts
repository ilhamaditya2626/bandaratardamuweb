// Pembersihan isian dari formulir publik sebelum disimpan ke basis data.
// 1) Alamat web (http://, https://, www., atau nama domain) "dijinakkan" sehingga tidak dapat diklik,
//    misalnya www.situs.com menjadi www[.]situs[.]com dan http:// menjadi hxxp[://].
// 2) Karakter khusus HTML dan query (& < > " ' ; `) diubah menjadi kode entitas HTML,
//    sehingga kode yang diketik (script, tag HTML, potongan query) hanya tersimpan sebagai teks biasa.

const URL_PATTERN =
  /\b(?:(?:https?|ftp):\/\/|www\.)[^\s<>"'`]+|\b(?:[a-z0-9-]+\.)+(?:com|net|org|id|co|io|info|xyz|me|ly|biz|site|online|app|link|top|tk|ru|cn|gov|edu|ac|go|or|my|sch|web)\b(?:\/[^\s<>"'`]*)?/gi;

const ENCODE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  ";": "&#59;",
  "`": "&#96;",
};

const DECODE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(ENCODE_MAP).map(([char, entity]) => [entity, char])
);

// Karakter kontrol tak terlihat (kecuali baris baru dan tab) dibuang.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function defangUrls(text: string): string {
  return text.replace(URL_PATTERN, (match) =>
    match
      .replace(/^(h)tt(ps?)/i, "$1xx$2")
      .replace(/:\/\//, "[://]")
      .replace(/\./g, "[.]")
  );
}

export function neutralizeText(value: string): string {
  return defangUrls(value.replace(CONTROL_CHARS, "").trim()).replace(
    /[&<>"';`]/g,
    (char) => ENCODE_MAP[char]
  );
}

// Mengubah kode entitas kembali menjadi karakter agar tampil rapi di dashboard.
// Aman karena React selalu menampilkan teks sebagai teks, bukan sebagai kode HTML.
export function decodeText<T extends string | null | undefined>(value: T): T {
  if (typeof value !== "string") return value;
  return value.replace(/&(?:amp|lt|gt|quot|#39|#59|#96);/g, (entity) => DECODE_MAP[entity] ?? entity) as T;
}

export class InputValidationError extends Error {}

// Membersihkan satu isian. maxLength mengikuti panjang kolom pada basis data (dihitung setelah dibersihkan).
export function cleanField(
  raw: unknown,
  label: string,
  options: { maxLength?: number; required?: boolean } = {}
): string | null {
  const text = typeof raw === "string" ? raw : raw == null ? "" : String(raw);
  const cleaned = neutralizeText(text);
  if (!cleaned) {
    if (options.required) throw new InputValidationError(`${label} wajib diisi.`);
    return null;
  }
  if (options.maxLength && cleaned.length > options.maxLength) {
    throw new InputValidationError(`${label} terlalu panjang.`);
  }
  return cleaned;
}

const EMAIL_PATTERN = /^[^\s@<>"'`;]+@[^\s@<>"'`;]+\.[^\s@<>"'`;]+$/;

export function cleanEmail(raw: unknown, label = "Email"): string {
  const email = (typeof raw === "string" ? raw : "").trim();
  if (!email) throw new InputValidationError(`${label} wajib diisi.`);
  if (email.length > 255 || !EMAIL_PATTERN.test(email)) {
    throw new InputValidationError(`${label} tidak valid.`);
  }
  return email;
}

export function cleanDate(raw: unknown, label = "Tanggal"): string {
  const value = (typeof raw === "string" ? raw : "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(new Date(`${value}T00:00:00Z`).getTime())) {
    throw new InputValidationError(`${label} tidak valid.`);
  }
  return value;
}

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuidV4(value: unknown): value is string {
  return typeof value === "string" && UUID_V4.test(value);
}
