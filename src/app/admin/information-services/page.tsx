"use client";

import { FormEvent, useEffect, useState } from "react";
import { 
  FileText, 
  Upload, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  FileCheck,
  Building2,
  Phone,
  Mail,
  User,
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

const months = [
  { value: "1", label: "Januari" },
  { value: "2", label: "Februari" },
  { value: "3", label: "Maret" },
  { value: "4", label: "April" },
  { value: "5", label: "Mei" },
  { value: "6", label: "Juni" },
  { value: "7", label: "Juli" },
  { value: "8", label: "Agustus" },
  { value: "9", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

interface InformationRequest {
  id: number;
  request_type: "information" | "objection";
  name: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  identity_type: string;
  identity_number: string;
  identity_file_url: string;
  institution?: string | null;
  information_detail?: string | null;
  purpose?: string | null;
  supporting_file_url?: string | null;
  objection_reason?: string | null;
  objection_reason_other?: string | null;
  case_position?: string | null;
  submitted_on: string;
  status: "pending" | "accepted" | "rejected";
  admin_note?: string | null;
  created_at: string;
}

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

export default function InformationServicesAdmin() {
  const [requests, setRequests] = useState<InformationRequest[]>([]);
  const [docs, setDocs] = useState<PublicDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<InformationRequest | null>(null);

  const now = new Date();
  const currentMonthStr = String(now.getMonth() + 1);
  const currentYearStr = String(now.getFullYear());

  const [filterMonth, setFilterMonth] = useState<string>(currentMonthStr);
  const [filterYear, setFilterYear] = useState<string>(currentYearStr);

  const years = Array.from({ length: 6 }, (_, i) => String(now.getFullYear() - i));

  const filteredRequests = requests.filter((r) => {
    if (!r.submitted_on) return true;
    const parts = r.submitted_on.split("-");
    if (filterYear && parts[0] !== filterYear) return false;
    if (filterMonth && String(parseInt(parts[1], 10)) !== filterMonth) return false;
    return true;
  });

  const handleResetToCurrent = () => {
    setFilterMonth(currentMonthStr);
    setFilterYear(currentYearStr);
  };

  const handleShowAll = () => {
    setFilterMonth("");
    setFilterYear("");
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [resRequests, resDocs] = await Promise.all([
        fetch("/api/admin/information-requests"),
        fetch("/api/admin/documents"),
      ]);

      if (resRequests.ok) {
        const jsonRequests = await resRequests.json();
        setRequests(Array.isArray(jsonRequests.data) ? jsonRequests.data : []);
      } else {
        console.error("Failed to fetch information requests:", resRequests.status);
      }

      if (resDocs.ok) {
        const jsonDocs = await resDocs.json();
        setDocs(Array.isArray(jsonDocs.data) ? jsonDocs.data : []);
      } else {
        console.error("Failed to fetch documents:", resDocs.status);
      }
    } catch (err) {
      console.error("Error loading PPID admin data:", err);
      setNotice({ type: "error", message: "Gagal memuat data dari server." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  async function handleStatusUpdate(id: number, newStatus: "accepted" | "rejected") {
    try {
      const res = await fetch("/api/admin/information-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotice({
          type: "success",
          message: `Permohonan #${id} berhasil di-${newStatus === "accepted" ? "terima" : "tolak"}.`,
        });
        loadData();
      } else {
        setNotice({ type: "error", message: data.error || "Gagal mengubah status." });
      }
    } catch (err) {
      console.error("Status update error:", err);
      setNotice({ type: "error", message: "Terjadi kesalahan koneksi saat memperbarui status." });
    }
  }

  async function handleUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsUploading(true);
    setNotice(null);

    const formEl = e.currentTarget;
    try {
      const formData = new FormData(formEl);
      const res = await fetch("/api/admin/documents", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setNotice({
          type: "success",
          message: `Dokumen berhasil dipublikasikan (${data.total_pages || 0} halaman).`,
        });
        formEl.reset();
        loadData();
      } else {
        setNotice({ type: "error", message: data.error || "Unggahan gagal dilakukan." });
      }
    } catch (err) {
      console.error("Upload error:", err);
      setNotice({ type: "error", message: "Terjadi kesalahan jaringan saat mengunggah." });
    } finally {
      setIsUploading(false);
    }
  }

  async function handleRemoveDoc(id: number, title: string) {
    if (!confirm(`Hapus dokumen "${title}"?`)) return;

    try {
      const res = await fetch("/api/admin/documents", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setNotice({ type: "success", message: "Dokumen berhasil dihapus." });
        loadData();
      } else {
        setNotice({ type: "error", message: data.error || "Gagal menghapus dokumen." });
      }
    } catch (err) {
      console.error("Delete doc error:", err);
      setNotice({ type: "error", message: "Terjadi kesalahan saat menghapus dokumen." });
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Layanan Informasi PPID
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Kelola permohonan informasi publik, keberatan, serta publikasi dokumen resmi bandara.
          </p>
        </div>
      </div>

      {/* Notice Banner */}
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

      {/* Grid: Upload & Document List */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Upload Form */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Upload className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Unggah Dokumen Publik</h3>
              <p className="text-xs text-gray-500">Publikasikan file PDF dokumen transparansi</p>
            </div>
          </div>

          <form onSubmit={handleUpload} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Judul Dokumen <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                required
                placeholder="Contoh: Laporan Tahunan Pelayanan Bandara 2025"
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
                  {Object.entries(labels).map(([k, v]) => (
                    <option value={k} key={k}>
                      {v}
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
                Keterangan Singkat (Opsional)
              </label>
              <textarea
                name="description"
                rows={2}
                placeholder="Ringkasan atau keterangan isi dokumen..."
                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
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
                <FileCheck className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Dokumen Terpublikasi</h3>
                <p className="text-xs text-gray-500">{docs.length} dokumen tersedia</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex-1 overflow-y-auto max-h-[420px] divide-y divide-gray-100">
            {isLoading ? (
              <div className="py-12 text-center text-sm text-gray-400">
                <Loader2 className="mx-auto h-6 w-6 animate-spin mb-2 text-gray-400" />
                Memuat dokumen...
              </div>
            ) : docs.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-400">
                Belum ada dokumen yang dipublikasikan.
              </div>
            ) : (
              docs.map((d) => (
                <div key={d.id} className="flex items-center justify-between gap-4 py-3 group">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-gray-900">
                        {d.title}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                      <span className="rounded bg-gray-100 px-2 py-0.5 font-medium text-gray-700">
                        {labels[d.category] || d.category}
                      </span>
                      <span>{d.total_pages} halaman</span>
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
                      onClick={() => handleRemoveDoc(d.id, d.title)}
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

      {/* Requests Table */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-gray-100 gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Daftar Permohonan Informasi Masuk</h3>
              <p className="text-xs text-gray-500">Permohonan informasi dan pernyataan keberatan publik</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Bulan */}
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:border-blue-500"
            >
              <option value="">Semua Bulan</option>
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            {/* Filter Tahun */}
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:border-blue-500"
            >
              <option value="">Semua Tahun</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            {/* Shortcut Buttons */}
            {!(filterMonth === currentMonthStr && filterYear === currentYearStr) && (
              <button
                type="button"
                onClick={handleResetToCurrent}
                title="Filter ke bulan berjalan"
                className="rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 text-xs font-semibold text-blue-700 transition"
              >
                Bulan Sekarang
              </button>
            )}

            {(filterMonth || filterYear) && (
              <button
                type="button"
                onClick={handleShowAll}
                title="Tampilkan semua tanpa filter"
                className="rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition"
              >
                Semua Periode
              </button>
            )}

            <span className="text-xs font-semibold rounded-full bg-blue-50 text-blue-700 px-3 py-1 ml-2">
              {filteredRequests.length} dari {requests.length}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200">
              <tr>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Pemohon</th>
                <th className="p-4">Jenis</th>
                <th className="p-4">Rincian Permohonan</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm text-gray-500">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin mb-2 text-gray-400" />
                    Memuat data permohonan...
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm text-gray-500">
                    {filterMonth || filterYear
                      ? "Tidak ada permohonan pada periode bulan/tahun yang dipilih."
                      : "Belum ada permohonan informasi masuk."}
                  </td>
                </tr>
              ) : (
                filteredRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50">
                    <td className="p-4 whitespace-nowrap text-xs text-gray-500">
                      {r.submitted_on}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">{r.name}</div>
                      <div className="text-xs text-gray-500">{r.email}</div>
                      <div className="text-xs text-gray-500">{r.phone}</div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          r.request_type === "objection"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-sky-100 text-sky-800"
                        }`}
                      >
                        {r.request_type === "objection" ? "Keberatan" : "Informasi"}
                      </span>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="line-clamp-2 text-gray-700 text-xs leading-relaxed">
                        {r.request_type === "information"
                          ? r.information_detail || "-"
                          : r.case_position || r.objection_reason || "-"}
                      </div>
                      <button
                        onClick={() => setSelectedRequest(r)}
                        className="mt-1 text-xs text-blue-600 hover:underline font-medium"
                      >
                        Lihat detail lengkap →
                      </button>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          r.status === "accepted"
                            ? "bg-emerald-100 text-emerald-800"
                            : r.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {r.status === "accepted" && <CheckCircle className="h-3.5 w-3.5" />}
                        {r.status === "rejected" && <XCircle className="h-3.5 w-3.5" />}
                        {r.status === "pending" && <Clock className="h-3.5 w-3.5" />}
                        {r.status === "accepted" ? "Diterima" : r.status === "rejected" ? "Ditolak" : "Menunggu"}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap text-right space-x-2">
                      {r.status !== "accepted" && (
                        <button
                          onClick={() => handleStatusUpdate(r.id, "accepted")}
                          className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Terima
                        </button>
                      )}
                      {r.status !== "rejected" && (
                        <button
                          onClick={() => handleStatusUpdate(r.id, "rejected")}
                          className="inline-flex items-center gap-1 rounded bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Tolak
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Detail Permohonan #{selectedRequest.id}
              </h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm text-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-500 font-semibold block">Jenis Permohonan</span>
                  <span className="font-medium capitalize">{selectedRequest.request_type}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-semibold block">Tanggal Pengajuan</span>
                  <span className="font-medium">{selectedRequest.submitted_on}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-semibold block">Nama Pemohon</span>
                  <span className="font-medium">{selectedRequest.name}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-semibold block">Pekerjaan</span>
                  <span className="font-medium">{selectedRequest.occupation}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-semibold block">Kontak</span>
                  <span className="font-medium">{selectedRequest.phone} / {selectedRequest.email}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-semibold block">Identitas</span>
                  <span className="font-medium">{selectedRequest.identity_type.toUpperCase()} - {selectedRequest.identity_number}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-gray-500 font-semibold block">Alamat</span>
                <p className="mt-0.5 rounded-lg bg-gray-50 p-2.5 text-xs text-gray-800">{selectedRequest.address}</p>
              </div>

              {selectedRequest.institution && (
                <div>
                  <span className="text-xs text-gray-500 font-semibold block">Instansi / Organisasi</span>
                  <p className="mt-0.5 text-xs text-gray-800">{selectedRequest.institution}</p>
                </div>
              )}

              {selectedRequest.request_type === "information" ? (
                <>
                  <div>
                    <span className="text-xs text-gray-500 font-semibold block">Rincian Informasi yang Diminta</span>
                    <p className="mt-0.5 rounded-lg bg-gray-50 p-2.5 text-xs text-gray-800 whitespace-pre-wrap">{selectedRequest.information_detail || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-semibold block">Tujuan Penggunaan</span>
                    <p className="mt-0.5 rounded-lg bg-gray-50 p-2.5 text-xs text-gray-800 whitespace-pre-wrap">{selectedRequest.purpose || "-"}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-xs text-gray-500 font-semibold block">Alasan Keberatan</span>
                    <p className="mt-0.5 rounded-lg bg-gray-50 p-2.5 text-xs text-gray-800">{selectedRequest.objection_reason || selectedRequest.objection_reason_other || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-semibold block">Kasus Posisi</span>
                    <p className="mt-0.5 rounded-lg bg-gray-50 p-2.5 text-xs text-gray-800 whitespace-pre-wrap">{selectedRequest.case_position || "-"}</p>
                  </div>
                </>
              )}

              <div className="flex gap-4 pt-2 border-t border-gray-100">
                {selectedRequest.identity_file_url && (
                  <a
                    href={selectedRequest.identity_file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Lihat File Identitas
                  </a>
                )}
                {selectedRequest.supporting_file_url && (
                  <a
                    href={selectedRequest.supporting_file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Lihat Berkas Pendukung
                  </a>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4">
              <button
                onClick={() => setSelectedRequest(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Tutup
              </button>
              {selectedRequest.status !== "accepted" && (
                <button
                  onClick={() => {
                    handleStatusUpdate(selectedRequest.id, "accepted");
                    setSelectedRequest(null);
                  }}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Terima Permohonan
                </button>
              )}
              {selectedRequest.status !== "rejected" && (
                <button
                  onClick={() => {
                    handleStatusUpdate(selectedRequest.id, "rejected");
                    setSelectedRequest(null);
                  }}
                  className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
                >
                  Tolak Permohonan
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
