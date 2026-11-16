"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, RefreshCw, Save } from "lucide-react";
import type { RekapKepegawaian } from "@/lib/rekap-kepegawaian";

type Group = "status" | "usia" | "golongan";

const groups: { key: Group; title: string; suffix?: string }[] = [
  { key: "status", title: "Status Kepegawaian" },
  { key: "usia", title: "Kelompok Usia", suffix: " tahun" },
  { key: "golongan", title: "Pangkat / Golongan" },
];

export default function RekapKepegawaianPanel() {
  const [rekap, setRekap] = useState<RekapKepegawaian | null>(null);
  const [totalPegawai, setTotalPegawai] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async (keepRekap = false) => {
    try {
      const response = await fetch("/api/admin/rekap-kepegawaian");
      const json = await response.json();
      if (!json.success) throw new Error(json.error);
      if (!keepRekap) setRekap(json.data);
      setTotalPegawai(json.totalPegawai ?? 0);
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Gagal memuat rekap kepegawaian");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const updateValue = (group: Group, index: number, value: string) => {
    if (!rekap) return;
    const items = rekap[group].map((item, i) => (i === index ? { ...item, value: Number(value) } : item));
    setRekap({ ...rekap, [group]: items });
    setSuccess("");
  };

  const handleSave = async () => {
    if (!rekap) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/admin/rekap-kepegawaian", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rekap),
      });
      const json = await response.json();
      if (!json.success) throw new Error(json.error);
      setRekap(json.data);
      setSuccess("Rekap kepegawaian berhasil disimpan.");
      void load(true);
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Gagal menyimpan rekap kepegawaian");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" /> Memuat rekap kepegawaian...
      </div>
    );
  }

  return (
    <section className="space-y-6 border-t border-slate-200 pt-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Rekap Kepegawaian</h2>
          <p className="mt-1 text-sm text-slate-500">
            Kelola rekap status kepegawaian, kelompok usia, dan golongan yang ditampilkan pada halaman Informasi Berkala.
            Jumlah pegawai pada daftar di atas: <b className="text-slate-800">{totalPegawai} orang</b>.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load(true)}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 md:self-auto"
        >
          <RefreshCw className="h-4 w-4" /> Perbarui Jumlah Pegawai
        </button>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4" /> {success}
        </div>
      )}

      {rekap && (
        <>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <label className="block text-sm font-medium text-slate-700">
              Periode Rekap
              <input
                type="text"
                value={rekap.periode}
                maxLength={50}
                onChange={(event) => { setRekap({ ...rekap, periode: event.target.value }); setSuccess(""); }}
                placeholder="Contoh: November 2026"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 md:w-80"
              />
            </label>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {groups.map((group) => {
              const sum = rekap[group.key].reduce((total, item) => total + (Number.isFinite(item.value) ? item.value : 0), 0);
              const match = sum === totalPegawai;
              return (
                <div key={group.key} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 font-semibold text-slate-900">{group.title}</h3>
                  <div className="space-y-3">
                    {rekap[group.key].map((item, index) => (
                      <label key={item.name} className="flex items-center justify-between gap-3 text-sm text-slate-700">
                        <span>{item.name}{group.suffix ?? ""}</span>
                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={Number.isFinite(item.value) ? item.value : ""}
                          onChange={(event) => updateValue(group.key, index, event.target.value)}
                          className="w-24 rounded-md border border-gray-300 px-3 py-1.5 text-right"
                        />
                      </label>
                    ))}
                  </div>
                  <div className={`mt-4 flex items-start gap-2 rounded-lg px-3 py-2 text-xs ${match ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                    {match ? <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" /> : <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />}
                    <span>
                      Jumlah: <b>{sum}</b> orang.
                      {match ? " Sesuai dengan jumlah pegawai." : ` Belum sama dengan jumlah pegawai (${totalPegawai} orang).`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Simpan Rekap
          </button>
        </>
      )}
    </section>
  );
}
