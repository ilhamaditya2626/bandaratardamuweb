"use client";

import { FormEvent, useEffect, useState } from "react";
import { 
  FileText, 
  Upload, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  Loader2 
} from "lucide-react";

const labels: Record<string, string> = {
  annual_report: "Laporan Tahunan",
  work_budget: "Rencana Kerja Anggaran",
  financial_report: "Laporan Keuangan",
  lakip: "LAKIP",
  dip: "DIP",
  dik: "DIK",
};

interface PublicDoc {
  id: number;
  category: string;
  title: string;
  description?: string | null;
  document_date?: string | null;
  file_url: string;
  file_name: string;
  total_pages: number;
  is_published: boolean;
  created_at: string;
}

export default function DocumentsAdminPage() {
  const [documents, setDocuments] = useState<PublicDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/documents");
      if (response.ok) {
        const json = await response.json();
        setDocuments(Array.isArray(json.data) ? json.data : []);
      } else {
        console.error("Failed to load documents:", response.status);
      }
    } catch (err) {
      console.error("Error loading documents:", err);
      setNotice({ type: "error", message: "Gagal memuat dokumen dari server." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  async function upload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsUploading(true);
    setNotice(null);

    const formEl = e.currentTarget;
    try {
      const response = await fetch("/api/admin/documents", {
        method: "POST",
        body: new FormData(formEl),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setNotice({
          type: "success",
          message: `Dokumen berhasil dipublikasikan (${data.total_pages || "jumlah halaman terdeteksi"} halaman).`,
        });
        formEl.reset();
        loadDocuments();
      } else {
        setNotice({ type: "error", message: data.error || "Unggahan dokumen gagal." });
      }
    } catch (err) {
      console.error("Upload error:", err);
      setNotice({ type: "error", message: "Terjadi kesalahan jaringan saat mengunggah." });
    } finally {
      setIsUploading(false);
    }
  }

  async function remove(id: number, title: string) {
    if (!confirm(`Hapus dokumen "${title}"?`)) return;

    try {
      const response = await fetch("/api/admin/documents", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setNotice({ type: "success", message: "Dokumen berhasil dihapus." });
        loadDocuments();
      } else {
        setNotice({ type: "error", message: data.error || "Gagal menghapus dokumen." });
      }
    } catch (err) {
      console.error("Delete document error:", err);
      setNotice({ type: "error", message: "Terjadi kesalahan saat menghapus dokumen." });
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Dokumen Publik</h2>
        <p className="mt-1 text-sm text-gray-500">
          Unggah dan kelola arsip dokumen transparansi informasi publik Bandara Tardamu.
        </p>
      </div>

      {notice && (
        <div
          className={`flex items-center justify-between rounded-xl p-4 text-sm ${
            notice.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-3">
            {notice.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
            )}
            <span>{notice.message}</span>
          </div>
          <button
            onClick={() => setNotice(null)}
            className="text-gray-400 hover:text-gray-600 text-xs font-semibold"
          >
            Tutup
          </button>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Upload Form */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Upload className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Unggah Dokumen Baru</h3>
              <p className="text-xs text-gray-500">Jumlah halaman PDF terdeteksi otomatis saat unggah</p>
            </div>
          </div>

          <form onSubmit={upload} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Judul Dokumen <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                required
                placeholder="Contoh: Laporan Kinerja Instansi Pemerintah (LAKIP) 2025"
                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  required
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                >
                  {Object.entries(labels).map(([key, label]) => (
                    <option value={key} key={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Tanggal Dokumen
                </label>
                <input
                  name="document_date"
                  type="date"
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                File PDF <span className="text-red-500">*</span>
              </label>
              <input
                name="file"
                required
                accept="application/pdf"
                type="file"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Keterangan Singkat (Opsional)
              </label>
              <textarea
                name="description"
                rows={2}
                placeholder="Keterangan isi ringkas dokumen..."
                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mengunggah...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Unggah & Publikasikan
                </>
              )}
            </button>
          </form>
        </section>

        {/* Existing Documents */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Daftar Dokumen</h3>
                <p className="text-xs text-gray-500">{documents.length} dokumen tersimpan</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex-1 overflow-y-auto max-h-[460px] divide-y divide-gray-100">
            {isLoading ? (
              <div className="py-12 text-center text-sm text-gray-400">
                <Loader2 className="mx-auto h-6 w-6 animate-spin mb-2 text-gray-400" />
                Memuat dokumen...
              </div>
            ) : documents.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-400">
                Belum ada dokumen yang diunggah.
              </div>
            ) : (
              documents.map((d) => (
                <div key={d.id} className="flex items-center justify-between gap-4 py-3.5 group">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-gray-900 text-sm">{d.title}</div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                      <span className="rounded bg-gray-100 px-2 py-0.5 font-medium text-gray-700">
                        {labels[d.category] || d.category}
                      </span>
                      <span>{d.total_pages || "-"} halaman</span>
                      {d.document_date && <span>• {d.document_date}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={d.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                      title="Lihat file"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => remove(d.id, d.title)}
                      className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                      title="Hapus dokumen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
