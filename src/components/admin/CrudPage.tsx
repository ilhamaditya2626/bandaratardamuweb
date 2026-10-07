/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormEvent, ReactNode, useCallback, useEffect, useState } from "react";
import { Edit2, Plus, Trash2, X } from "lucide-react";

type Row = Record<string, any>;
type Option = { value: number | string; label: string };

export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "datetime" | "checkbox" | "select" | "file" | "readonly";
  required?: boolean;
  options?: Option[]; // pilihan tetap
  optionsFrom?: string; // pilihan dari tabel lain: divisi | role | maskapai | pegawai
  defaultValue?: string | boolean;
  accept?: string; // khusus type "file"
  fileNameField?: string; // kolom yang diisi nama asli berkas
};
export type ColumnConfig = { key: string; label: string; render?: (row: Row) => ReactNode };

type Props = {
  title: string;
  description: string;
  endpoint: string;
  fields: FieldConfig[];
  columns: ColumnConfig[];
  canCreate?: boolean;
  addLabel?: string;
};

const inputClass = "mt-1 w-full rounded-md border border-gray-300 px-3 py-2";
const pad = (n: number) => String(n).padStart(2, "0");

function toLocalInput(raw: unknown) {
  const d = new Date(String(raw));
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function CrudPage({ title, description, endpoint, fields, columns, canCreate = true, addLabel = "Tambah Data" }: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Row>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [optionMap, setOptionMap] = useState<Record<string, Option[]>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(endpoint);
      const json = await response.json();
      setRows(json.data || []);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => { void load(); }, [load]);

  const sourceKey = fields.map((f) => f.optionsFrom || "").join("|");
  useEffect(() => {
    Array.from(new Set(sourceKey.split("|").filter(Boolean))).forEach(async (name) => {
      try {
        const response = await fetch(`/api/admin/options/${name}`);
        const json = await response.json();
        setOptionMap((prev) => ({ ...prev, [name]: json.data || [] }));
      } catch {
        /* pilihan gagal dimuat: dropdown dibiarkan kosong */
      }
    });
  }, [sourceKey]);

  const optionsOf = (field: FieldConfig): Option[] => field.options ?? (field.optionsFrom ? optionMap[field.optionsFrom] ?? [] : []);

  const emptyForm = () => {
    const values: Row = {};
    fields.forEach((f) => {
      if (f.type === "readonly") return;
      values[f.name] = f.type === "checkbox" ? Boolean(f.defaultValue ?? false) : f.defaultValue ?? "";
    });
    return values;
  };

  const toForm = (row: Row) => {
    const values: Row = {};
    fields.forEach((f) => {
      if (f.type === "readonly") return;
      const raw = row[f.name];
      if (f.type === "checkbox") values[f.name] = Boolean(raw);
      else if (raw === null || raw === undefined) values[f.name] = "";
      else if (f.type === "date") values[f.name] = String(raw).slice(0, 10);
      else if (f.type === "datetime") values[f.name] = toLocalInput(raw);
      else values[f.name] = String(raw);
    });
    return values;
  };

  const showCreate = () => { setEditing(null); setForm(emptyForm()); setError(""); setOpen(true); };
  const showEdit = (row: Row) => { setEditing(row); setForm(toForm(row)); setError(""); setOpen(true); };

  const upload = async (field: FieldConfig, file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error || "Gagal mengunggah berkas");
      setForm((prev) => ({ ...prev, [field.name]: json.url, ...(field.fileNameField ? { [field.fileNameField]: json.name } : {}) }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah berkas");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const missing = fields.find((f) => f.required && f.type !== "readonly" && f.type !== "checkbox" && String(form[f.name] ?? "").trim() === "");
    if (missing) { setError(`${missing.label} wajib diisi`); return; }
    setSaving(true);
    try {
      const payload: Row = { ...form };
      if (editing) payload.id = editing.id;
      const response = await fetch(endpoint, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok || json.success === false) throw new Error(json.error || "Gagal menyimpan data");
      setOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Hapus data ini?")) return;
    const response = await fetch(endpoint, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (!response.ok) {
      const json = await response.json().catch(() => ({}));
      alert(json.error || "Gagal menghapus data.");
      return;
    }
    await load();
  };

  const cell = (row: Row, col: ColumnConfig): ReactNode => {
    if (col.render) return col.render(row);
    const value = row[col.key];
    const field = fields.find((f) => f.name === col.key);
    if (field && (field.options || field.optionsFrom)) {
      const found = optionsOf(field).find((o) => String(o.value) === String(value));
      return found ? found.label : value ?? "-";
    }
    if (typeof value === "boolean") return value ? "Ya" : "Tidak";
    return value === null || value === undefined || value === "" ? "-" : String(value);
  };

  const renderField = (f: FieldConfig) => {
    const value = form[f.name];
    if (f.type === "readonly") {
      const raw = editing?.[f.name];
      const text = raw === null || raw === undefined || raw === "" ? "-" : String(raw);
      return (
        <div key={f.name} className="block text-sm font-medium">
          {f.label}
          <div className="mt-1 whitespace-pre-wrap rounded-md bg-gray-50 px-3 py-2 text-sm font-normal text-gray-700">
            {text.startsWith("/api/") ? <a href={text} target="_blank" rel="noreferrer" className="text-blue-600 underline">Buka berkas</a> : text}
          </div>
        </div>
      );
    }
    if (f.type === "checkbox") {
      return (
        <label key={f.name} className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => setForm({ ...form, [f.name]: e.target.checked })} />
          {f.label}
        </label>
      );
    }
    return (
      <label key={f.name} className="block text-sm font-medium">
        {f.label}{f.required ? " *" : ""}
        {f.type === "textarea" ? (
          <textarea rows={4} value={value ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} className={inputClass} />
        ) : f.type === "select" ? (
          <select value={value ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} className={inputClass}>
            <option value="">- Pilih -</option>
            {optionsOf(f).map((o) => <option key={String(o.value)} value={String(o.value)}>{o.label}</option>)}
          </select>
        ) : f.type === "file" ? (
          <div>
            <input type="file" accept={f.accept} onChange={(e) => void upload(f, e.target.files?.[0])} className={inputClass} />
            {value ? <p className="mt-1 text-xs font-normal text-gray-500">Berkas saat ini: {String(value)}</p> : null}
            {uploading ? <p className="mt-1 text-xs font-normal text-gray-500">Mengunggah...</p> : null}
          </div>
        ) : (
          <input
            type={f.type === "text" ? "text" : f.type === "datetime" ? "datetime-local" : f.type}
            value={value ?? ""}
            onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
            className={inputClass}
          />
        )}
      </label>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        {canCreate && (
          <button onClick={showCreate} className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />{addLabel}
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((c) => <th key={c.key} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{c.label}</th>)}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={columns.length + 1} className="px-6 py-8 text-center text-sm text-gray-500">Memuat data...</td></tr>
            ) : !rows.length ? (
              <tr><td colSpan={columns.length + 1} className="px-6 py-8 text-center text-sm text-gray-500">Belum ada data.</td></tr>
            ) : rows.map((row) => (
              <tr key={row.id}>
                {columns.map((c) => <td key={c.key} className="max-w-xs px-4 py-3 text-sm text-gray-700">{cell(row, c)}</td>)}
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <button onClick={() => showEdit(row)} className="mr-3 text-blue-600 hover:text-blue-900"><Edit2 className="h-5 w-5" /></button>
                  <button onClick={() => void remove(row.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <button aria-label="Tutup" onClick={() => setOpen(false)} className="fixed inset-0 bg-slate-900/60" />
            <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-xl">
              <form onSubmit={submit} className="p-6">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{editing ? "Ubah Data" : addLabel}</h3>
                  <button type="button" onClick={() => setOpen(false)}><X className="h-6 w-6 text-gray-400" /></button>
                </div>
                <div className="max-h-[65vh] space-y-4 overflow-y-auto pr-1">{fields.map(renderField)}</div>
                {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-gray-300 px-4 py-2 text-sm">Batal</button>
                  <button disabled={saving || uploading} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{saving ? "Menyimpan..." : "Simpan"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}