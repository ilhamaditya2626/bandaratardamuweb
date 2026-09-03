"use client";

import { FormEvent, useEffect, useState } from "react";
import { 
  FileText, 
  Pencil,
  Trash2,
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Building2,
  Phone,
  Mail,
  User,
  ExternalLink,
  Loader2
} from "lucide-react";

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

export default function InformationServicesAdmin() {
  const [requests, setRequests] = useState<InformationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<InformationRequest | null>(null);
  const [editingRequest, setEditingRequest] = useState<InformationRequest | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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
      const resRequests = await fetch("/api/admin/information-requests");

      if (resRequests.ok) {
        const jsonRequests = await resRequests.json();
        setRequests(Array.isArray(jsonRequests.data) ? jsonRequests.data : []);
      } else {
        console.error("Failed to fetch information requests:", resRequests.status);
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

  async function handleRemoveRequest(id: number, name: string) {
    if (!confirm(`Hapus permohonan dari "${name}"?`)) return;
    try {
      const res = await fetch("/api/admin/information-requests", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotice({ type: "success", message: "Permohonan berhasil dihapus." });
        setSelectedRequest(null);
        loadData();
      } else {
        setNotice({ type: "error", message: data.error || "Gagal menghapus permohonan." });
      }
    } catch (err) {
      console.error("Delete request error:", err);
      setNotice({ type: "error", message: "Terjadi kesalahan saat menghapus permohonan." });
    }
  }

  async function handleEditRequest(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingRequest) return;
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const fields = Object.fromEntries(formData.entries());
    try {
      const res = await fetch("/api/admin/information-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingRequest.id, ...fields }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotice({ type: "success", message: "Permohonan berhasil diperbarui." });
        setEditingRequest(null);
        loadData();
      } else {
        setNotice({ type: "error", message: data.error || "Gagal memperbarui permohonan." });
      }
    } catch (err) {
      console.error("Edit request error:", err);
      setNotice({ type: "error", message: "Terjadi kesalahan saat memperbarui permohonan." });
    } finally {
      setIsSaving(false);
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
            Kelola permohonan informasi publik dan pernyataan keberatan masyarakat.
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
                      <button
                        onClick={() => setEditingRequest(r)}
                        className="inline-flex items-center gap-1 rounded bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                        title="Edit permohonan"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemoveRequest(r.id, r.name)}
                        className="inline-flex items-center gap-1 rounded bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-red-50 hover:text-red-700"
                        title="Hapus permohonan"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Hapus
                      </button>
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
              <button
                onClick={() => setEditingRequest(selectedRequest)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                onClick={() => handleRemoveRequest(selectedRequest.id, selectedRequest.name)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" /> Hapus
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

      {editingRequest && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleEditRequest} className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h3 className="text-lg font-bold text-gray-900">Edit Permohonan #{editingRequest.id}</h3>
              <button type="button" onClick={() => setEditingRequest(null)} className="text-gray-400 hover:text-gray-700" title="Tutup">✕</button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {(["name", "email", "phone", "occupation"] as const).map((field) => (
                <label key={field} className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                  {field === "name" ? "Nama" : field === "email" ? "Email" : field === "phone" ? "No. Telepon" : "Pekerjaan"}
                  <input name={field} required defaultValue={editingRequest[field]} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500" />
                </label>
              ))}
            </div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
              Alamat
              <textarea name="address" required rows={2} defaultValue={editingRequest.address} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500" />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
              Instansi / Lembaga
              <input name="institution" defaultValue={editingRequest.institution || ""} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500" />
            </label>
            {editingRequest.request_type === "information" ? (
              <>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">Rincian Informasi<textarea name="information_detail" rows={3} defaultValue={editingRequest.information_detail || ""} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500" /></label>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">Tujuan Penggunaan<textarea name="purpose" rows={2} defaultValue={editingRequest.purpose || ""} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500" /></label>
              </>
            ) : (
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">Kasus Posisi<textarea name="case_position" rows={3} defaultValue={editingRequest.case_position || ""} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500" /></label>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">Tanggal Pengajuan<input name="submitted_on" type="date" required defaultValue={editingRequest.submitted_on} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500" /></label>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">Catatan Admin<textarea name="admin_note" rows={1} defaultValue={editingRequest.admin_note || ""} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500" /></label>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
              <button type="button" onClick={() => setEditingRequest(null)} className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">Batal</button>
              <button type="submit" disabled={isSaving} className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
