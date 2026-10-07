"use client";

import { FormEvent, useState } from "react";

type Kind = "permohonan" | "keberatan";

const inputClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-[#111928] px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#facc15] focus:outline-none";
const labelClass = "block text-sm font-semibold text-gray-300";

const identityTypes = ["KTP", "SIM", "NPWP", "Paspor", "Lainnya"];

const objectionReasons = [
  "Permohonan informasi ditolak",
  "Informasi berkala tidak disediakan",
  "Permintaan informasi tidak ditanggapi",
  "Permintaan informasi ditanggapi tidak sebagaimana yang diminta",
  "Permintaan informasi tidak dipenuhi",
  "Pengenaan biaya yang tidak wajar",
  "Penyampaian informasi melebihi waktu yang ditentukan",
];

export default function InformationRequestForm({ initialKind }: { initialKind: Kind }) {
  const [kind, setKind] = useState<Kind>(initialKind);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("sending");
    const data = new FormData(event.currentTarget);
    data.set("request_type", kind);
    try {
      const response = await fetch("/api/information-requests", { method: "POST", body: data });
      const json = await response.json().catch(() => ({}));
      if (!response.ok || !json.success) throw new Error(json.error || "Gagal mengirim formulir");
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim formulir");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-[28px] border border-emerald-500/30 bg-emerald-500/10 p-10 text-center">
        <h2 className="text-2xl text-white">Formulir berhasil dikirim</h2>
        <p className="mt-3 text-sm leading-7 text-gray-300">
          Terima kasih. Petugas PPID akan memproses {kind === "keberatan" ? "keberatan" : "permohonan"} Anda dan
          menghubungi Anda melalui email atau telepon yang dicantumkan.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex gap-3">
        {(["permohonan", "keberatan"] as Kind[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setKind(item)}
            className={`rounded-full px-6 py-3 text-sm font-bold transition ${
              kind === item ? "bg-[#facc15] text-[#111928]" : "border border-white/10 text-gray-300 hover:border-[#facc15]"
            }`}
          >
            {item === "permohonan" ? "Permohonan Informasi" : "Pengajuan Keberatan"}
          </button>
        ))}
      </div>

      <form key={kind} onSubmit={onSubmit} className="space-y-6 rounded-[28px] border border-white/5 bg-[#1f2937] p-8">
        {/* Kolom jebakan bot, disembunyikan dari pengunjung */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        <div className="grid gap-6 md:grid-cols-2">
          <label className={labelClass}>Nama Lengkap *
            <input name="name" required maxLength={150} className={inputClass} />
          </label>
          <label className={labelClass}>Email *
            <input name="email" type="email" required maxLength={255} className={inputClass} />
          </label>
          <label className={labelClass}>No. Telepon / WhatsApp
            <input name="phone" maxLength={40} className={inputClass} />
          </label>
          <label className={labelClass}>Pekerjaan
            <input name="occupation" maxLength={150} className={inputClass} />
          </label>
          <label className={`${labelClass} md:col-span-2`}>Instansi / Organisasi
            <input name="institution" maxLength={255} className={inputClass} />
          </label>
          <label className={`${labelClass} md:col-span-2`}>Alamat
            <textarea name="address" rows={2} maxLength={1000} className={inputClass} />
          </label>
        </div>

        {kind === "permohonan" ? (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              <label className={labelClass}>Jenis Identitas *
                <select name="identity_type" required className={inputClass} defaultValue="KTP">
                  {identityTypes.map((type) => <option key={type}>{type}</option>)}
                </select>
              </label>
              <label className={labelClass}>Nomor Identitas *
                <input name="identity_number" required maxLength={120} className={inputClass} />
              </label>
              <label className={`${labelClass} md:col-span-2`}>Unggah Berkas Identitas * (PDF/JPG/PNG, maks. 2 MB)
                <input name="identity_file" type="file" required accept="application/pdf,image/jpeg,image/png,image/webp" className={inputClass} />
              </label>
            </div>
            <label className={labelClass}>Rincian Informasi yang Dibutuhkan *
              <textarea name="information_detail" required rows={4} maxLength={5000} className={inputClass} />
            </label>
            <label className={labelClass}>Tujuan Penggunaan Informasi *
              <textarea name="purpose" required rows={3} maxLength={2000} className={inputClass} />
            </label>
          </>
        ) : (
          <>
            <label className={labelClass}>Alasan Pengajuan Keberatan *
              <select name="objection_reason" required className={inputClass} defaultValue="">
                <option value="" disabled>Pilih alasan</option>
                {objectionReasons.map((reason) => <option key={reason}>{reason}</option>)}
              </select>
            </label>
            <label className={labelClass}>Alasan Lainnya (jika ada)
              <textarea name="objection_reason_other" rows={2} maxLength={2000} className={inputClass} />
            </label>
            <label className={labelClass}>Kasus Posisi *
              <textarea name="case_position" required rows={5} maxLength={5000} className={inputClass} />
            </label>
            <div className="grid gap-6 md:grid-cols-2">
              <label className={labelClass}>Jenis Identitas
                <select name="identity_type" className={inputClass} defaultValue="KTP">
                  {identityTypes.map((type) => <option key={type}>{type}</option>)}
                </select>
              </label>
              <label className={labelClass}>Nomor Identitas
                <input name="identity_number" maxLength={120} className={inputClass} />
              </label>
            </div>
          </>
        )}

        <label className={labelClass}>Berkas Pendukung (opsional, PDF/JPG/PNG, maks. 2 MB)
          <input name="supporting_file" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" className={inputClass} />
        </label>

        {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</p>}

        <button
          disabled={status === "sending"}
          className="rounded-full bg-[#facc15] px-8 py-3 text-sm font-bold text-[#111928] transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {status === "sending" ? "Mengirim..." : "Kirim Formulir"}
        </button>
      </form>
    </div>
  );
}