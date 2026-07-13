"use client";

import { FormEvent, useMemo, useState } from "react";
import { Check, Edit2, Plus, Tag, Trash2, X } from "lucide-react";
import {
  useCreateTicketPrice,
  useDeleteTicketPrice,
  useGetTicketPrices,
  useUpdateTicketPrice,
} from "@/hooks/useTicketPrices";
import {
  TicketFlightType,
  TicketPrice,
} from "@/services/client/ticket-prices.client";

const routeOptions = [
  { origin: "Sabu", destination: "Kupang" },
  { origin: "Sabu", destination: "Ende" },
  { origin: "Sabu", destination: "Waingapu" },
  { origin: "Sabu", destination: "Rote" },
];

const dayOptions = [
  { value: "senin", label: "Senin" },
  { value: "selasa", label: "Selasa" },
  { value: "rabu", label: "Rabu" },
  { value: "kamis", label: "Kamis" },
  { value: "jumat", label: "Jumat" },
  { value: "sabtu", label: "Sabtu" },
  { value: "minggu", label: "Minggu" },
];

const flightTypeOptions: { value: TicketFlightType; label: string }[] = [
  { value: "reguler", label: "Reguler" },
  { value: "perintis", label: "Perintis" },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function routeValue(origin: string, destination: string) {
  return `${origin}|${destination}`;
}

function parseRoute(value: string) {
  const [origin, destination] = value.split("|");
  return { origin, destination };
}

function formatDays(days: string[]) {
  if (days.length === 7) return "Setiap hari";
  if (days.length === 0) return "Belum dipilih";

  return days
    .map((day) => dayOptions.find((item) => item.value === day)?.label || day)
    .join(", ");
}

export default function TicketPricesAdminPage() {
  const { data: response, isLoading, isError } = useGetTicketPrices();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedRoute, setSelectedRoute] = useState(routeValue("Kupang", "Sabu"));
  const [flightType, setFlightType] = useState<TicketFlightType>("reguler");
  const [operatingDays, setOperatingDays] = useState<string[]>([
    "senin",
    "selasa",
    "rabu",
    "kamis",
    "jumat",
    "sabtu",
    "minggu",
  ]);
  const [price, setPrice] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const prices = response?.data || [];

  const activeCount = useMemo(
    () => prices.filter((item) => item.is_active).length,
    [prices]
  );

  const createMutation = useCreateTicketPrice({
    onSuccess: () => {
      setStatusMsg({ type: "success", text: "Harga tiket berhasil ditambahkan." });
      resetForm();
    },
    onError: (error) =>
      setStatusMsg({
        type: "error",
        text: error.message || "Gagal menyimpan harga tiket.",
      }),
  });

  const updateMutation = useUpdateTicketPrice({
    onSuccess: () => {
      setStatusMsg({ type: "success", text: "Harga tiket berhasil diperbarui." });
      resetForm();
    },
    onError: (error) =>
      setStatusMsg({
        type: "error",
        text: error.message || "Gagal memperbarui harga tiket.",
      }),
  });

  const deleteMutation = useDeleteTicketPrice({
    onSuccess: () =>
      setStatusMsg({ type: "success", text: "Harga tiket berhasil dihapus." }),
    onError: (error) =>
      setStatusMsg({
        type: "error",
        text: error.message || "Gagal menghapus harga tiket.",
      }),
  });

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  function resetForm() {
    setEditingId(null);
    setSelectedRoute(routeValue("Kupang", "Sabu"));
    setFlightType("reguler");
    setOperatingDays(dayOptions.map((day) => day.value));
    setPrice(0);
    setIsActive(true);
  }

  function toggleDay(value: string) {
    setOperatingDays((current) =>
      current.includes(value)
        ? current.filter((day) => day !== value)
        : [...current, value]
    );
  }

  function selectEveryDay() {
    setOperatingDays(dayOptions.map((day) => day.value));
  }

  function handleEdit(item: TicketPrice) {
    setEditingId(item.id);
    setSelectedRoute(routeValue(item.origin, item.destination));
    setFlightType(item.flight_type);
    setOperatingDays(item.operating_days);
    setPrice(item.price);
    setIsActive(item.is_active);
    setStatusMsg(null);
  }

  function handleDelete(id: number) {
    if (!confirm("Hapus harga tiket ini?")) return;
    deleteMutation.mutate(id);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMsg(null);

    const { origin, destination } = parseRoute(selectedRoute);
    const payload = {
      origin,
      destination,
      flight_type: flightType,
      operating_days: operatingDays,
      price: Number(price),
      is_active: isActive,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload });
      return;
    }

    createMutation.mutate(payload);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
            Rute & Harga Tiket
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Manajemen Harga Penerbangan
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Atur harga, jenis penerbangan, dan hari operasi yang akan tampil pada
            halaman jadwal penerbangan publik.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:w-[360px]">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase text-slate-500">Total Rute</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{prices.length}</p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase text-emerald-700">Aktif</p>
            <p className="mt-2 text-2xl font-bold text-emerald-900">{activeCount}</p>
          </div>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`rounded-lg border p-4 text-sm font-medium ${statusMsg.type === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-red-200 bg-red-50 text-red-800"
            }`}
        >
          {statusMsg.text}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-950">
                {editingId ? "Edit Harga" : "Tambah Harga"}
              </h3>
              <p className="text-sm text-slate-500">
                Pilih rute, tipe, hari operasi, lalu isi harga.
              </p>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                title="Batal edit"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-slate-700">Rute</label>
              <select
                value={selectedRoute}
                onChange={(event) => setSelectedRoute(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                {routeOptions.map((route) => (
                  <option
                    key={routeValue(route.origin, route.destination)}
                    value={routeValue(route.origin, route.destination)}
                  >
                    {route.origin} ke {route.destination}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Jenis Penerbangan
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {flightTypeOptions.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFlightType(item.value)}
                    className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${flightType === item.value
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-amber-400"
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-semibold text-slate-700">
                  Hari Operasi
                </label>
                <button
                  type="button"
                  onClick={selectEveryDay}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-800"
                >
                  Setiap hari
                </button>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {dayOptions.map((day) => {
                  const checked = operatingDays.includes(day.value);

                  return (
                    <label
                      key={day.value}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${checked
                        ? "border-amber-300 bg-amber-50 text-amber-900"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleDay(day.value)}
                        className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                      />
                      {day.label}
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Harga</label>
              <div className="mt-2 flex overflow-hidden rounded-lg border border-slate-300 shadow-sm focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20">
                <span className="flex items-center bg-slate-50 px-3 text-sm font-bold text-slate-500">
                  IDR
                </span>
                <input
                  required
                  type="number"
                  min="0"
                  value={price}
                  onChange={(event) => setPrice(Number(event.target.value))}
                  className="w-full border-0 px-3 py-2.5 text-sm text-slate-900 focus:outline-none"
                  placeholder="1250000"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              Tampilkan di halaman publik
            </label>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {editingId ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {isSaving ? "Menyimpan..." : editingId ? "Update Harga" : "Tambah Harga"}
            </button>
          </form>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h3 className="text-lg font-bold text-slate-950">Daftar Harga</h3>
            </div>
            <Tag className="h-5 w-5 text-amber-500" />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide text-slate-500">
                    Rute
                  </th>
                  <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide text-slate-500">
                    Jenis
                  </th>
                  <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide text-slate-500">
                    Hari
                  </th>
                  <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide text-slate-500">
                    Harga
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
                      Memuat harga tiket...
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-red-500">
                      Gagal memuat data harga tiket.
                    </td>
                  </tr>
                ) : prices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                      Belum ada harga tiket. Tambahkan data dari form di samping.
                    </td>
                  </tr>
                ) : (
                  prices.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-950">
                        {item.origin} ke {item.destination}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase ${item.flight_type === "perintis"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                            }`}
                        >
                          {item.flight_type}
                        </span>
                      </td>
                      <td className="min-w-[220px] px-6 py-4 text-slate-600">
                        {formatDays(item.operating_days)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-bold text-slate-950">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${item.is_active
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
                            onClick={() => handleEdit(item)}
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
      </div>
    </div>
  );
}
