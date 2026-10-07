"use client";

import { FormEvent, useEffect, useState } from "react";
import { Edit2, Plus, Trash2, X } from "lucide-react";

type Item = {
  id: number; maskapai_id: number | null; pilot_id: number | null; destinasi_id: number | null; penumpang_id: number | null;
  tanggal: string | null; jam: string | null; seat: string | null; harga_tiket: number | null;
  nama_maskapai: string | null; nama_pilot: string | null; nama_kota: string | null; nama_penumpang: string | null;
};
type Option = { id: number; nama: string };
const empty = { maskapai_id: "", pilot_id: "", destinasi_id: "", penumpang_id: "", tanggal: "", jam: "", seat: "", harga_tiket: "" };

function formatCurrency(value: number | null) {
  if (value === null) return "-";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

export default function PenerbanganTerpaduAdminPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [options, setOptions] = useState<{ maskapaiList: Option[]; pilotList: Option[]; destinasiList: Option[]; penumpangList: Option[] }>({ maskapaiList: [], pilotList: [], destinasiList: [], penumpangList: [] });
  const [loading, setLoading] = useState(true); const [editing, setEditing] = useState<Item | null>(null); const [open, setOpen] = useState(false); const [form, setForm] = useState(empty); const [saving, setSaving] = useState(false);

  const load = async () => { setLoading(true); try { const response = await fetch("/api/admin/penerbangan"); const json = await response.json(); setItems(json.data || []); if (json.options) setOptions(json.options); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);
  const showCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const showEdit = (item: Item) => { setEditing(item); setForm({ maskapai_id: item.maskapai_id ? String(item.maskapai_id) : "", pilot_id: item.pilot_id ? String(item.pilot_id) : "", destinasi_id: item.destinasi_id ? String(item.destinasi_id) : "", penumpang_id: item.penumpang_id ? String(item.penumpang_id) : "", tanggal: item.tanggal || "", jam: item.jam || "", seat: item.seat || "", harga_tiket: item.harga_tiket ? String(item.harga_tiket) : "" }); setOpen(true); };
  const submit = async (event: FormEvent) => { event.preventDefault(); setSaving(true); try { const body = new FormData(); Object.entries(form).forEach(([key, value]) => body.append(key, value)); if (editing) body.append("id", String(editing.id)); const response = await fetch("/api/admin/penerbangan", { method: editing ? "PUT" : "POST", body }); if (!response.ok) throw new Error(); setOpen(false); await load(); } catch { alert("Gagal menyimpan data."); } finally { setSaving(false); } };
  const remove = async (id: number) => { if (!confirm("Hapus data ini?")) return; const response = await fetch("/api/admin/penerbangan", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); if (!response.ok) return alert("Gagal menghapus data."); await load(); };

  return <div className="space-y-6">
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div><h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Data Penerbangan Terpadu</h2><p className="mt-1 text-sm text-gray-500">Relasi Maskapai-Pilot-Destinasi-Penumpang sesuai rancangan ERD Chen.</p></div>
      <button onClick={showCreate} className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"><Plus className="mr-2 h-4 w-4" />Tambah Data</button>
    </div>
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr>
        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Maskapai</th>
        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Pilot</th>
        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Destinasi</th>
        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Penumpang</th>
        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tanggal/Jam</th>
        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Seat</th>
        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Harga</th>
        <th className="px-4 py-3" />
      </tr></thead><tbody className="divide-y divide-gray-200">
        {loading ? <tr><td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">Memuat data...</td></tr> : !items.length ? <tr><td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">Belum ada data penerbangan.</td></tr> : items.map((item) => <tr key={item.id}>
          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{item.nama_maskapai || "-"}</td>
          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{item.nama_pilot || "-"}</td>
          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{item.nama_kota || "-"}</td>
          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{item.nama_penumpang || "-"}</td>
          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">{item.tanggal || "-"} {item.jam || ""}</td>
          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">{item.seat || "-"}</td>
          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">{formatCurrency(item.harga_tiket)}</td>
          <td className="whitespace-nowrap px-4 py-3 text-right"><button onClick={() => showEdit(item)} className="mr-3 text-blue-600 hover:text-blue-900"><Edit2 className="h-5 w-5" /></button><button onClick={() => void remove(item.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5" /></button></td>
        </tr>)}
      </tbody></table>
    </div>
    {open && <div className="fixed inset-0 z-50 overflow-y-auto"><div className="flex min-h-screen items-center justify-center p-4"><button aria-label="Tutup" onClick={() => setOpen(false)} className="fixed inset-0 bg-slate-900/60" /><div className="relative w-full max-w-2xl rounded-xl bg-white shadow-xl"><form onSubmit={submit} className="p-6">
      <div className="mb-5 flex items-center justify-between"><h3 className="text-lg font-semibold">{editing ? "Edit Data Penerbangan" : "Tambah Data Penerbangan"}</h3><button type="button" onClick={() => setOpen(false)}><X className="h-6 w-6 text-gray-400" /></button></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">Maskapai<select value={form.maskapai_id} onChange={(e) => setForm({ ...form, maskapai_id: e.target.value })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"><option value="">- Pilih -</option>{options.maskapaiList.map((o) => <option key={o.id} value={o.id}>{o.nama}</option>)}</select></label>
        <label className="block text-sm font-medium">Pilot<select value={form.pilot_id} onChange={(e) => setForm({ ...form, pilot_id: e.target.value })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"><option value="">- Pilih -</option>{options.pilotList.map((o) => <option key={o.id} value={o.id}>{o.nama}</option>)}</select></label>
        <label className="block text-sm font-medium">Destinasi<select value={form.destinasi_id} onChange={(e) => setForm({ ...form, destinasi_id: e.target.value })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"><option value="">- Pilih -</option>{options.destinasiList.map((o) => <option key={o.id} value={o.id}>{o.nama}</option>)}</select></label>
        <label className="block text-sm font-medium">Penumpang<select value={form.penumpang_id} onChange={(e) => setForm({ ...form, penumpang_id: e.target.value })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"><option value="">- Pilih -</option>{options.penumpangList.map((o) => <option key={o.id} value={o.id}>{o.nama}</option>)}</select></label>
        <label className="block text-sm font-medium">Tanggal<input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
        <label className="block text-sm font-medium">Jam<input type="time" value={form.jam} onChange={(e) => setForm({ ...form, jam: e.target.value })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
        <label className="block text-sm font-medium">Seat<input value={form.seat} onChange={(e) => setForm({ ...form, seat: e.target.value })} placeholder="Contoh: 12A" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
        <label className="block text-sm font-medium">Harga Tiket (Rp)<input type="number" value={form.harga_tiket} onChange={(e) => setForm({ ...form, harga_tiket: e.target.value })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></label>
      </div>
      <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setOpen(false)} className="rounded-md border border-gray-300 px-4 py-2 text-sm">Batal</button><button disabled={saving} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{saving ? "Menyimpan..." : "Simpan"}</button></div>
    </form></div></div></div>}
  </div>;
}
