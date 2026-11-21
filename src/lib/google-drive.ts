// Penghubung ke Google Drive untuk menyimpan berkas permohonan dan keberatan informasi
// (KTP dan berkas pendukung). Website hanya menjadi perantara: berkas yang lolos pemeriksaan
// dikirim ke Drive dan tidak disimpan di server.
// Nilai kunci dibaca dari .env (GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET,
// GOOGLE_DRIVE_REFRESH_TOKEN, GOOGLE_DRIVE_FOLDER_ID).

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const FILES_URL = "https://www.googleapis.com/drive/v3/files";
const UPLOAD_URL = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id";
const FOLDER_MIME = "application/vnd.google-apps.folder";

export class GoogleDriveError extends Error {}

function config() {
  return {
    clientId: process.env.GOOGLE_DRIVE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET || "",
    refreshToken: process.env.GOOGLE_DRIVE_REFRESH_TOKEN || "",
    folderId: process.env.GOOGLE_DRIVE_FOLDER_ID || "",
  };
}

export function isDriveConfigured() {
  const c = config();
  return Boolean(c.clientId && c.clientSecret && c.refreshToken && c.folderId);
}

// ID berkas Google Drive hanya berisi huruf, angka, garis bawah, dan tanda hubung.
export function isDriveFileId(id: string) {
  return /^[a-zA-Z0-9_-]{10,200}$/.test(id);
}

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;
  const c = config();
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: c.clientId,
      client_secret: c.clientSecret,
      refresh_token: c.refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!response.ok) {
    throw new GoogleDriveError(`Gagal mendapatkan izin Google Drive (${response.status}).`);
  }
  const data = (await response.json()) as { access_token: string; expires_in: number };
  // Token diperbarui satu menit sebelum masa berlakunya habis.
  cachedToken = { value: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 };
  return data.access_token;
}

const subfolderCache = new Map<string, string>();

// Mencari subfolder (misalnya "ppid") di dalam folder utama; dibuat otomatis jika belum ada.
async function getSubfolderId(name: string): Promise<string> {
  const cached = subfolderCache.get(name);
  if (cached) return cached;
  const { folderId } = config();
  const token = await getAccessToken();
  const query = `name='${name}' and '${folderId}' in parents and mimeType='${FOLDER_MIME}' and trashed=false`;
  const searchResponse = await fetch(`${FILES_URL}?q=${encodeURIComponent(query)}&fields=files(id)`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!searchResponse.ok) throw new GoogleDriveError(`Gagal membaca folder Google Drive (${searchResponse.status}).`);
  const found = (await searchResponse.json()) as { files: { id: string }[] };
  let id = found.files[0]?.id;
  if (!id) {
    const createResponse = await fetch(`${FILES_URL}?fields=id`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ name, mimeType: FOLDER_MIME, parents: [folderId] }),
    });
    if (!createResponse.ok) throw new GoogleDriveError(`Gagal membuat folder Google Drive (${createResponse.status}).`);
    id = ((await createResponse.json()) as { id: string }).id;
  }
  subfolderCache.set(name, id);
  return id;
}

export async function uploadToDrive(buffer: Buffer, fileName: string, mimeType: string, subfolder: string): Promise<string> {
  const token = await getAccessToken();
  const parentId = await getSubfolderId(subfolder);
  const boundary = `tardamu-${Date.now().toString(36)}`;
  const metadata = JSON.stringify({ name: fileName, parents: [parentId] });
  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n`),
    Buffer.from(`--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n`),
    buffer,
    Buffer.from(`\r\n--${boundary}--`),
  ]);
  const response = await fetch(UPLOAD_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": `multipart/related; boundary=${boundary}` },
    body: new Uint8Array(body),
  });
  if (!response.ok) throw new GoogleDriveError(`Gagal mengunggah berkas ke Google Drive (${response.status}).`);
  return ((await response.json()) as { id: string }).id;
}

export async function downloadFromDrive(fileId: string): Promise<{ buffer: Buffer; contentType: string } | null> {
  if (!isDriveFileId(fileId)) return null;
  const token = await getAccessToken();
  const response = await fetch(`${FILES_URL}/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new GoogleDriveError(`Gagal mengambil berkas dari Google Drive (${response.status}).`);
  return {
    buffer: Buffer.from(await response.arrayBuffer()),
    contentType: response.headers.get("content-type") || "application/octet-stream",
  };
}
