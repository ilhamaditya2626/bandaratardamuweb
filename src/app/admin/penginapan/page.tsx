"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { BedDouble, Check, Edit2, Plus, Trash2, X } from "lucide-react";
import {
  useCreatePenginapan,
  useDeletePenginapan,
  useGetPenginapan,
  useUpdatePenginapan,
} from "@/hooks/usePenginapan";
import { Penginapan } from "@/services/client/penginapan.client";
import { FACILITY_CATALOG } from "@/lib/penginapan-facilities";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

interface NewPhoto {
  file: File;
  preview: string;
}

export default function PenginapanAdminPage() {
  const { data: response, isLoading, isError } = useGetPenginapan();
  const items = response?.data ?? [];

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [phone, setPhone] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [customFacility, setCustomFacility] = useState("");

  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [newPhotos, setNewPhotos] = useState<NewPhoto[]>([]);

  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Revoke object URLs saat komponen unmount.
  useEffect(() => {
    return () => {
      newPhotos.forEach((p) => URL.revokeObjectURL(p.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createMutation = useCreatePenginapan({
    onSuccess: () => {
      setStatusMsg({ type: "success", text: "Penginapan berhasil ditambahkan." });
      closeModal();
    },
    onError: (error) =>
      setStatusMsg({ type: "error", text: error.message || "Gagal menyimpan." }),
  });

  const updateMutation = useUpdatePenginapan({
    onSuccess: () => {
      setStatusMsg({ type: "success", text: "Penginapan berhasil diperbarui." });
      closeModal();
    },
    onError: (error) =>
      setStatusMsg({ type: "error", text: error.message || "Gagal memperbarui." }),
  });

  const deleteMutation = useDeletePenginapan({
    onSuccess: () =>
      setStatusMsg({ type: "success", text: "Penginapan berhasil dihapus." }),
    onError: (error) =>
      setStatusMsg({ type: "error", text: error.message || "Gagal menghapus." }),
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  function resetForm() {
    setEditingId(null);
    setCategory("");
    setName("");
    setDescription("");
    setPrice(0);
    setPhone("");
    setIsActive(true);
    setFacilities([]);
    setCustomFacility("");
    setExistingPhotos([]);
    newPhotos.forEach((p) => URL.revokeObjectURL(p.preview));
    setNewPhotos([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function openCreate() {
    resetForm();
    setStatusMsg(null);
    setIsModalOpen(true);
  }

  function openEdit(item: Penginapan) {
    resetForm();
    setEditingId(item.id);
    setCategory(item.category);
    setName(item.name);
    setDescription(item.description ?? "");
    setPrice(item.price);
    setPhone(item.phone ?? "");
    setIsActive(item.is_active);
    setFacilities(item.facilities);
    setExistingPhotos(item.photos);
    setStatusMsg(null);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    resetForm();
  }

  function toggleFacility(value: string) {
    setFacilities((current) =>
      current.includes(value)
        ? current.filter((f) => f !== value)
        : [...current, value],
    );
  }

  function addCustomFacility() {
    const value = customFacility.trim();
    if (!value) return;
    if (!facilities.some((f) => f.toLowerCase() === value.toLowerCase())) {
      setFacilities((current) => [...current, value]);
    }
    setCustomFacility("");
  }

  function removeFacility(value: string) {
    setFacilities((current) => current.filter((f) => f !== value));
  }

  function handleFilesSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const mapped = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewPhotos((current) => [...current, ...mapped]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeExistingPhoto(url: string) {
    setExistingPhotos((current) => current.filter((p) => p !== url));
  }

  function removeNewPhoto(preview: string) {
    setNewPhotos((current) => {
      const target = current.find((p) => p.preview === preview);
      if (target) URL.revokeObjectURL(target.preview);
      return current.filter((p) => p.preview !== preview);
    });
  }

  // Katalog + fasilitas custom (yang tidak ada di katalog).
  const customFacilities = facilities.filter(
    (f) => !FACILITY_CATALOG.some((c) => c.name.toLowerCase() === f.toLowerCase()),
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMsg(null);

    const totalPhotos = existingPhotos.length + newPhotos.length;
    if (totalPhotos === 0) {
      setStatusMsg({ type: "error", text: "Unggah minimal 1 foto penginapan." });
      return;
    }

    const formData = new FormData();
    formData.append("category", category);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", String(price));
    formData.append("phone", phone);
    formData.append("is_active", String(isActive));
    formData.append("facilities", JSON.stringify(facilities));
    formData.append("existing_photos", JSON.stringify(existingPhotos));
    newPhotos.forEach((p) => formData.append("photos", p.file));

    if (editingId) {
      formData.append("id", String(editingId));
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  }

  function handleDelete(id: number) {
    if (!confirm("Hapus penginapan ini?")) return;
    deleteMutation.mutate(id);
  }

  const activeCount = items.filter((i) => i.is_active).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
            Akomodasi
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Manajemen Penginapan
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Kelola daftar penginapan (kategori, foto, fasilitas, harga, dan nomor
            WhatsApp) yang tampil pada halaman Akomodasi Penginapan publik.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:w-[320px]">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase text-slate-500">Total</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{items.length}</p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase text-emerald-700">Aktif</p>
            <p className="mt-2 text-2xl font-bold text-emerald-900">{activeCount}</p>
          </div>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`rounded-lg border p-4 text-sm font-medium ${
            statusMsg.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-bold text-slate-950">Daftar Penginapan</h3>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Tambah Penginapan
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide text-slate-500">
                  Penginapan
                </th>
                <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide text-slate-500">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide text-slate-500">
                  Harga
                </th>
                <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide text-slate-500">
                  Fasilitas
                </th>
                <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="px-6 py-3 text-right font-semibold uppercase tracking-wide text-slate-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                    Memuat data penginapan...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-red-500">
                    Gagal memuat data penginapan.
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                    Belum ada penginapan. Klik &quot;Tambah Penginapan&quot;.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-slate-100">
                          {item.photos[0] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.photos[0]}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-950">{item.name}</p>
                          <p className="text-xs text-slate-400">
                            {item.photos.length} foto
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold uppercase text-amber-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-bold text-slate-950">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {item.facilities.length}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                          item.is_active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="rounded-md p-2 text-blue-600 transition hover:bg-blue-50"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          disabled={deleteMutation.isPending}
                          className="rounded-md p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div className="flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-amber-500" />
                <h3 className="text-lg font-bold text-slate-950">
                  {editingId ? "Edit Penginapan" : "Tambah Penginapan"}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              id="penginapanForm"
              onSubmit={handleSubmit}
              className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-5"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Kategori (badge)
                  </label>
                  <input
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="mis. Terpopuler, Beachfront"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Nama Penginapan
                  </label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="mis. Hotel Raijua Permai"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Deskripsi
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Deskripsi singkat penginapan..."
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Harga per malam
                  </label>
                  <div className="mt-2 flex overflow-hidden rounded-lg border border-slate-300 shadow-sm focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20">
                    <span className="flex items-center bg-slate-50 px-3 text-sm font-bold text-slate-500">
                      IDR
                    </span>
                    <input
                      required
                      type="number"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      placeholder="450000"
                      className="w-full border-0 px-3 py-2.5 text-sm text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Nomor WhatsApp
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="mis. 081234567890"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    Tombol telepon publik mengarah ke WhatsApp nomor ini.
                  </p>
                </div>
              </div>

              {/* Fasilitas */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Fasilitas
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {FACILITY_CATALOG.map((facility) => {
                    const checked = facilities.some(
                      (f) => f.toLowerCase() === facility.name.toLowerCase(),
                    );
                    return (
                      <label
                        key={facility.name}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                          checked
                            ? "border-amber-300 bg-amber-50 text-amber-900"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleFacility(facility.name)}
                          className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                        />
                        {facility.name}
                      </label>
                    );
                  })}
                </div>

                {/* Fasilitas custom */}
                {customFacilities.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {customFacilities.map((f) => (
                      <span
                        key={f}
                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-white"
                      >
                        {f}
                        <button
                          type="button"
                          onClick={() => removeFacility(f)}
                          className="text-white/70 hover:text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex gap-2">
                  <input
                    value={customFacility}
                    onChange={(e) => setCustomFacility(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomFacility();
                      }
                    }}
                    placeholder="Tambah fasilitas lain..."
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                  <button
                    type="button"
                    onClick={addCustomFacility}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-400"
                  >
                    Tambah
                  </button>
                </div>
              </div>

              {/* Foto */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Foto Penginapan
                </label>
                <p className="mb-2 text-xs text-slate-400">
                  Bisa memilih beberapa foto sekaligus. Format gambar, maks 15MB per
                  foto.
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFilesSelected}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-amber-400 hover:text-amber-700"
                >
                  <Plus className="h-4 w-4" />
                  Pilih Foto
                </button>

                {(existingPhotos.length > 0 || newPhotos.length > 0) && (
                  <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {existingPhotos.map((url) => (
                      <div
                        key={url}
                        className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt="Foto penginapan"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingPhoto(url)}
                          className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                          title="Hapus foto"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    {newPhotos.map((p) => (
                      <div
                        key={p.preview}
                        className="group relative aspect-square overflow-hidden rounded-lg border border-emerald-300 bg-slate-100"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.preview}
                          alt="Foto baru"
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute left-1 top-1 rounded bg-emerald-500 px-1 text-[9px] font-bold uppercase text-white">
                          Baru
                        </span>
                        <button
                          type="button"
                          onClick={() => removeNewPhoto(p.preview)}
                          className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                          title="Hapus foto"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                Tampilkan di halaman publik
              </label>
            </form>

            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="submit"
                form="penginapanForm"
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editingId ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {isSaving
                  ? "Menyimpan..."
                  : editingId
                    ? "Update Penginapan"
                    : "Simpan Penginapan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
