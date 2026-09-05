"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const base = [
  { name: "email", label: "Email", type: "email" },
  { name: "name", label: "Nama Lengkap" },
  { name: "phone", label: "No. Telepon / WhatsApp" },
  { name: "address", label: "Alamat Lengkap", area: true },
  { name: "occupation", label: "Pekerjaan" },
];

const reasons = [
  "Permohonan informasi ditolak",
  "Informasi berkala tidak disediakan",
  "Permintaan informasi tidak ditanggapi",
  "Permintaan informasi ditanggapi tidak sebagaimana diminta",
  "Permintaan informasi tidak dipenuhi",
  "Biaya yang dikenakan tidak wajar",
  "Informasi disampaikan melebihi jangka waktu ditentukan",
  "Yang lain",
];

function Field({
  name,
  label,
  type = "text",
  area = false,
  required = true,
}: {
  name: string;
  label: string;
  type?: string;
  area?: boolean;
  required?: boolean;
}) {
  const cls =
    "mt-2 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-[#facc15] transition";
  return (
    <label className="block text-sm font-semibold text-gray-200">
      {label}
      {required && <span className="text-red-400"> *</span>}
      {area ? (
        <textarea name={name} required={required} rows={4} className={cls} />
      ) : (
        <input name={name} type={type} required={required} className={cls} />
      )}
    </label>
  );
}

type PpidFormsProps = {
  /** Pre-select the form type. When set, the tab switcher is completely hidden. */
  defaultKind?: "information" | "objection";
  /** Called when user clicks close or wants to hide the form */
  onClose?: () => void;
};

export function PpidForms({ defaultKind, onClose }: PpidFormsProps = {}) {
  const [kind, setKind] = useState<"information" | "objection">(
    defaultKind || "information"
  );
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (defaultKind) {
      setKind(defaultKind);
    }
  }, [defaultKind]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setSending(true);
    setMessage("");
    try {
      const res = await fetch("/api/information-requests", {
        method: "POST",
        body: new FormData(form),
      });
      const json = await res.json();
      setSending(false);
      setMessage(json.message || json.error || "Tanggapan diterima.");
      if (res.ok) form.reset();
    } catch (err) {
      console.error("Form submit error:", err);
      setSending(false);
      setMessage("Terjadi kesalahan jaringan saat mengirim formulir.");
    }
  }

  const showTabs = !defaultKind;

  return (
    <div className="mx-auto max-w-5xl" ref={formRef}>
      {/* Top Bar when opened with a specific form type */}
      {defaultKind ? (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#facc15]/30 bg-[#facc15]/10 p-5 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#facc15] text-xl text-[#111928] shadow-md">
              <i
                className={`fa-solid ${
                  defaultKind === "information"
                    ? "fa-file-invoice"
                    : "fa-file-shield"
                }`}
              />
            </div>
            <div>
              <span className="rounded bg-[#facc15]/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#facc15]">
                {defaultKind === "information"
                  ? "Formulir Permohonan Informasi"
                  : "Formulir Pengajuan Keberatan"}
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {defaultKind === "information"
                  ? "Pengajuan Permintaan Informasi Publik"
                  : "Pernyataan Keberatan Pelayanan Informasi"}
              </h3>
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 self-start sm:self-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold text-gray-300 transition hover:border-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <i className="fa-solid fa-xmark text-xs" /> Tutup Formulir
            </button>
          )}
        </div>
      ) : (
        /* Standalone tab buttons only shown if no specific defaultKind */
        showTabs && (
          <div className="mb-8 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setKind("information")}
              className={`rounded-full px-6 py-3 text-sm font-bold transition ${
                kind === "information"
                  ? "bg-[#facc15] text-[#111928] shadow-lg"
                  : "border border-white/10 text-white hover:border-[#facc15]/50"
              }`}
            >
              Permohonan Informasi
            </button>
            <button
              type="button"
              onClick={() => setKind("objection")}
              className={`rounded-full px-6 py-3 text-sm font-bold transition ${
                kind === "objection"
                  ? "bg-[#facc15] text-[#111928] shadow-lg"
                  : "border border-white/10 text-white hover:border-[#facc15]/50"
              }`}
            >
              Pengajuan Keberatan
            </button>
          </div>
        )
      )}

      {/* Main Form Container */}
      <form
        onSubmit={submit}
        className="rounded-[30px] border border-white/10 bg-[#1f2937]/80 p-6 shadow-2xl md:p-10"
      >
        <input type="hidden" name="request_type" value={kind} />

        <div className="grid gap-5 md:grid-cols-2">
          {base.map((x) => (
            <Field key={x.name} {...x} />
          ))}
          <label className="block text-sm font-semibold text-gray-200">
            Jenis Identitas <span className="text-red-400">*</span>
            <select
              name="identity_type"
              required
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#111928] px-4 py-3 text-sm text-white focus:border-[#facc15] outline-none"
            >
              <option value="KTP">KTP</option>
              <option value="NPWP">NPWP</option>
              <option value="SIM">SIM</option>
              <option value="Paspor">Paspor</option>
            </select>
          </label>
          <Field
            name="identity_number"
            label="Nomor Identitas (NPWP/KTP/SIM/Paspor)"
          />
          <label className="block text-sm font-semibold text-gray-200">
            Unggah Foto Identitas <span className="text-red-400">*</span>
            <input
              name="identity_file"
              type="file"
              required
              accept="image/*,.pdf"
              className="mt-2 block w-full text-sm text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-[#facc15] file:px-4 file:py-2 file:font-bold file:text-[#111928]"
            />
          </label>
          <Field
            name="institution"
            label="Asal Instansi / Lembaga (isi '-' jika pribadi)"
            required={false}
          />
        </div>

        {kind === "information" ? (
          <div className="mt-5 grid gap-5 border-t border-white/10 pt-5">
            <Field
              name="information_detail"
              label="Rincian Informasi yang Dibutuhkan"
              area
            />
            <Field
              name="purpose"
              label="Tujuan Penggunaan Informasi"
              area
            />
            <label className="text-sm font-semibold text-gray-200">
              Dokumen Pendukung Tambahan (Opsional)
              <input
                name="supporting_file"
                type="file"
                accept="image/*,.pdf"
                className="mt-2 block w-full text-sm text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:font-semibold file:text-white"
              />
            </label>
          </div>
        ) : (
          <div className="mt-5 grid gap-5 border-t border-white/10 pt-5">
            <label className="text-sm font-semibold text-gray-200">
              Alasan Pengajuan Keberatan <span className="text-red-400">*</span>
              <select
                name="objection_reason"
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#111928] px-4 py-3 text-sm text-white focus:border-[#facc15] outline-none"
              >
                {reasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
            <Field
              name="objection_reason_other"
              label="Keterangan Alasan Lain (jika memilih 'Yang lain')"
              required={false}
            />
            <Field
              name="case_position"
              label="Kasus Posisi (Ringkasan persoalan / kronologi)"
              area
            />
          </div>
        )}

        <div className="mt-6 max-w-sm">
          <Field
            name="submitted_on"
            label={
              kind === "information"
                ? "Tanggal Permohonan"
                : "Tanggal Keberatan"
            }
            type="date"
          />
        </div>

        {message && (
          <div
            className={`mt-6 rounded-2xl p-4 text-sm font-medium ${
              message.includes("berhasil") || message.includes("sukses")
                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="flex items-start gap-2 text-xs leading-relaxed text-gray-400">
            <i className="fa-solid fa-shield-halved mt-0.5 shrink-0 text-[#facc15]" />
            <span>
              Data pribadi Anda akan dijaga dengan aman dan tidak disebarluaskan
              kepada pihak lain tanpa persetujuan atau dasar hukum yang sah.
            </span>
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center gap-2 rounded-full bg-[#facc15] px-8 py-3.5 text-sm font-bold text-[#111928] shadow-[0_4px_20px_rgba(250,204,21,0.25)] transition hover:scale-105 disabled:opacity-60"
          >
            {sending ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin" />
                Mengirim Formulir...
              </>
            ) : (
              <>
                <i className="fa-solid fa-paper-plane" />
                Kirim Formulir Sekarang
              </>
            )}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-gray-300 transition hover:border-white/30 hover:text-white"
            >
              Batal & Tutup
            </button>
          )}
          </div>
        </div>
      </form>
    </div>
  );
}

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

export function RequestStatistics() {
  const now = new Date();
  const currentMonthStr = String(now.getMonth() + 1);
  const currentYearStr = String(now.getFullYear());
  const years = Array.from({ length: 6 }, (_, i) => String(now.getFullYear() - i));

  // Default otomatis bulan dan tahun berjalan
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);
  const [selectedYear, setSelectedYear] = useState<string>(currentYearStr);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<{
    total: number;
    accepted: number;
    rejected: number;
    rows: any[];
  } | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (selectedYear) params.set("year", selectedYear);
    if (selectedMonth) params.set("month", selectedMonth);
    const query = params.toString() ? `?${params.toString()}` : "";

    fetch(`/api/information-requests${query}`)
      .then((r) => r.json())
      .then((x) => setData(x.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [selectedMonth, selectedYear]);

  const handleResetToCurrent = () => {
    setSelectedMonth(currentMonthStr);
    setSelectedYear(currentYearStr);
  };

  const handleShowAll = () => {
    setSelectedMonth("");
    setSelectedYear("");
  };

  const getPeriodLabel = () => {
    if (!selectedMonth && !selectedYear) return "Semua Periode";
    if (selectedMonth && selectedYear) {
      const m = months.find((x) => x.value === selectedMonth)?.label;
      return `${m} ${selectedYear}`;
    }
    if (selectedMonth) {
      const m = months.find((x) => x.value === selectedMonth)?.label;
      return `Bulan ${m}`;
    }
    return `Tahun ${selectedYear}`;
  };

  const isCurrentMonth = selectedMonth === currentMonthStr && selectedYear === currentYearStr;
  const isAll = !selectedMonth && !selectedYear;
  const isFiltered = Boolean(selectedMonth || selectedYear);

  const total = data?.total || 0;
  const accepted = data?.accepted || 0;
  const rate = total ? Math.round((accepted / total) * 100) : 0;

  return (
    <section className="mx-auto mt-12 max-w-5xl rounded-[30px] border border-white/10 bg-[#1f2937]/70 p-6 md:p-8">
      {/* Header & Filter Controls */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-400">
            <i className="fa-solid fa-chart-column" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-2xl text-white font-bold">
                Statistik Permohonan Informasi
              </h3>
              <span className="rounded-full bg-[#facc15]/15 border border-[#facc15]/30 px-3 py-0.5 text-xs font-semibold text-[#facc15]">
                {getPeriodLabel()}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-0.5">
              Rekapitulasi permohonan informasi publik secara transparan
            </p>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Month Dropdown */}
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none rounded-xl border border-white/10 bg-[#111928] pl-3.5 pr-8 py-2.5 text-xs font-semibold text-white focus:border-[#facc15] outline-none transition cursor-pointer hover:border-white/20"
            >
              <option value="">Semua Bulan</option>
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400" />
          </div>

          {/* Year Dropdown */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="appearance-none rounded-xl border border-white/10 bg-[#111928] pl-3.5 pr-8 py-2.5 text-xs font-semibold text-white focus:border-[#facc15] outline-none transition cursor-pointer hover:border-white/20"
            >
              <option value="">Semua Tahun</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400" />
          </div>

          {/* Reset / Shortcut Buttons */}
          {!isCurrentMonth && (
            <button
              type="button"
              onClick={handleResetToCurrent}
              title="Kembali ke bulan berjalan saat ini"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#facc15]/30 bg-[#facc15]/10 px-3.5 py-2.5 text-xs font-bold text-[#facc15] transition hover:bg-[#facc15]/20"
            >
              <i className="fa-solid fa-calendar-day text-[10px]" />
              <span>Bulan Sekarang</span>
            </button>
          )}

          {!isAll && (
            <button
              type="button"
              onClick={handleShowAll}
              title="Tampilkan semua data tanpa filter"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs font-bold text-gray-300 transition hover:border-white/25 hover:text-white"
            >
              <i className="fa-solid fa-list text-[10px]" />
              <span>Semua Periode</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`mt-6 grid gap-6 lg:grid-cols-[.7fr_1.3fr] transition-opacity duration-200 ${isLoading ? "opacity-60" : "opacity-100"}`}>
        <div className="rounded-2xl border border-white/10 bg-[#111928]/50 p-6 text-center">
          <p className="text-5xl font-bold text-white">{total}</p>
          <p className="mt-1 text-sm text-gray-400">
            Total permohonan {isFiltered ? `(${getPeriodLabel()})` : ""}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <span className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400 border border-emerald-500/20">
              Diterima
              <br />
              <b className="text-lg">{accepted}</b>
            </span>
            <span className="rounded-xl bg-red-500/10 p-3 text-red-400 border border-red-500/20">
              Ditolak
              <br />
              <b className="text-lg">{data?.rejected || 0}</b>
            </span>
          </div>
          <p className="mt-4 text-sm text-blue-300">
            Tingkat penerimaan: <b>{rate}%</b>
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-400 border-b border-white/10">
              <tr>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Pemohon</th>
                <th className="p-3">Informasi</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data?.rows.map((r: any) => (
                <tr key={r.id} className="text-gray-200 hover:bg-white/[0.02] transition">
                  <td className="p-3 whitespace-nowrap text-xs text-gray-400">
                    {r.submitted_on}
                  </td>
                  <td className="p-3 font-medium">{r.name}</td>
                  <td className="max-w-40 truncate p-3 text-gray-300">
                    {r.detail || "-"}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        r.status === "accepted"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : r.status === "rejected"
                          ? "bg-red-500/15 text-red-400"
                          : "bg-yellow-500/15 text-yellow-400"
                      }`}
                    >
                      {r.status === "accepted"
                        ? "Diterima"
                        : r.status === "rejected"
                        ? "Ditolak"
                        : "Diproses"}
                    </span>
                  </td>
                </tr>
              ))}
              {!data?.rows.length && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-sm text-gray-500"
                  >
                    {isFiltered
                      ? `Belum ada data permohonan untuk ${getPeriodLabel()}.`
                      : "Belum ada data permohonan yang tercatat."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
