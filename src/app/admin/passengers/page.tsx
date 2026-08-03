"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { ApiClient } from "@/lib/api-client";

type FlightType = "arrival" | "departure";

type PassengerLog = {
  id: string | number;
  date: string;
  airline: string | null;
  flight_type: FlightType | null;
  city: string | null;
  passenger_count: number | null;
  load_factor: string | number | null;
  pax_adult?: number | null;
  pax_child?: number | null;
  pax_infant?: number | null;
  pax_transit_adult?: number | null;
  pax_transit_child?: number | null;
  pax_transit_infant?: number | null;
  baggage_kg?: number | null;
  cargo_kg?: number | null;
  mail_kg?: number | null;
};

// Payload rincian yang dikirim ke API (passenger_count dihitung di server).
type RincianPayload = {
  date: string;
  airline: string;
  flight_type: FlightType;
  city: string;
  pax_adult: number;
  pax_child: number;
  pax_infant: number;
  pax_transit_adult: number;
  pax_transit_child: number;
  pax_transit_infant: number;
  baggage_kg: number;
  cargo_kg: number;
  mail_kg: number;
};

const airlineOptions = [
  "Susi Air",
];

const cityOptions = [
  "Kupang",
  "Ende",
  "Rote",
  "Waingapu",
];

function NumField({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="number"
        min="0"
        required={required}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
      />
    </div>
  );
}

function getPassengerCount(row: PassengerLog) {
  // Dewasa + anak (bayi tidak dihitung); fallback ke passenger_count lama.
  const rincian = Number(row.pax_adult ?? 0) + Number(row.pax_child ?? 0);
  return rincian > 0 ? rincian : Number(row.passenger_count ?? 0);
}

function getLoadFactor(row: PassengerLog) {
  return Number(row.load_factor ?? 0);
}

function getRoute(row: PassengerLog) {
  return row.flight_type === "arrival"
    ? `${row.city}-Sabu`
    : `Sabu-${row.city}`;
}

export default function PassengersPage() {
  const queryClient = useQueryClient();

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showForm, setShowForm] = useState(false);
  const [airline, setAirline] = useState("");
  const [flightType, setFlightType] = useState<FlightType>("arrival");
  const [city, setCity] = useState("");
  const [paxAdult, setPaxAdult] = useState(0);
  const [paxChild, setPaxChild] = useState(0);
  const [paxInfant, setPaxInfant] = useState(0);
  const [paxTransitAdult, setPaxTransitAdult] = useState(0);
  const [paxTransitChild, setPaxTransitChild] = useState(0);
  const [paxTransitInfant, setPaxTransitInfant] = useState(0);
  const [baggageKg, setBaggageKg] = useState(0);
  const [cargoKg, setCargoKg] = useState(0);
  const [mailKg, setMailKg] = useState(0);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  // Total penumpang = dewasa + anak (bayi tidak dihitung).
  const totalPenumpang = Number(paxAdult) + Number(paxChild);

  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-passengers", date],
    queryFn: () => ApiClient.get(`/stats?range=daily&date=${date}`),
  });

  const logs: PassengerLog[] = useMemo(() => {
    const response = data as any;
    const rows: PassengerLog[] = response?.data?.logs || [];

    return rows.filter((row) => {
      return (
        row.airline &&
        row.flight_type &&
        row.city &&
        getPassengerCount(row) > 0
      );
    });
  }, [data]);

  const passengerMutation = useMutation({
    mutationFn: (payload: RincianPayload) =>
      ApiClient.post("/admin/passengers", payload),
  });

  const updatePassengerMutation = useMutation({
    mutationFn: (payload: RincianPayload & { id: string | number }) =>
      ApiClient.put("/admin/passengers", payload),
  });

  const deletePassengerMutation = useMutation({
    mutationFn: (id: string | number) =>
      ApiClient.delete("/admin/passengers", { id }),
  });


  const resetForm = () => {
    setEditingId(null);
    setAirline("");
    setFlightType("arrival");
    setCity("");
    setPaxAdult(0);
    setPaxChild(0);
    setPaxInfant(0);
    setPaxTransitAdult(0);
    setPaxTransitChild(0);
    setPaxTransitInfant(0);
    setBaggageKg(0);
    setCargoKg(0);
    setMailKg(0);
  };

  const refreshPassengerQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-passengers", date] });
    queryClient.invalidateQueries({ queryKey: ["public-passengers"] });
    queryClient.invalidateQueries({ queryKey: ["public-passenger-page"] });
    queryClient.invalidateQueries({ queryKey: ["public-passenger-daily-log"] });
    queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
  };

  const handleEdit = (row: PassengerLog) => {
    setEditingId(row.id);
    setAirline(row.airline || "");
    setFlightType(row.flight_type || "arrival");
    setCity(row.city || "");
    setPaxAdult(Number(row.pax_adult ?? 0));
    setPaxChild(Number(row.pax_child ?? 0));
    setPaxInfant(Number(row.pax_infant ?? 0));
    setPaxTransitAdult(Number(row.pax_transit_adult ?? 0));
    setPaxTransitChild(Number(row.pax_transit_child ?? 0));
    setPaxTransitInfant(Number(row.pax_transit_infant ?? 0));
    setBaggageKg(Number(row.baggage_kg ?? 0));
    setCargoKg(Number(row.cargo_kg ?? 0));
    setMailKg(Number(row.mail_kg ?? 0));
    setShowForm(true);
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Hapus data ini?")) return;

    try {
      await deletePassengerMutation.mutateAsync(id);
      refreshPassengerQueries();

      setStatusMsg({
        type: "success",
        text: "Data penumpang berhasil dihapus!",
      });
    } catch (err: any) {
      setStatusMsg({
        type: "error",
        text: err?.message || "Gagal menghapus data penumpang.",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    const payload: RincianPayload = {
      date,
      airline,
      flight_type: flightType,
      city,
      pax_adult: Number(paxAdult),
      pax_child: Number(paxChild),
      pax_infant: Number(paxInfant),
      pax_transit_adult: Number(paxTransitAdult),
      pax_transit_child: Number(paxTransitChild),
      pax_transit_infant: Number(paxTransitInfant),
      baggage_kg: Number(baggageKg),
      cargo_kg: Number(cargoKg),
      mail_kg: Number(mailKg),
    };

    try {
      if (editingId) {
        await updatePassengerMutation.mutateAsync({ id: editingId, ...payload });
      } else {
        await passengerMutation.mutateAsync(payload);
      }

      refreshPassengerQueries();


      setStatusMsg({
        type: "success",
        text: editingId
          ? "Data penumpang berhasil diperbarui!"
          : "Data penumpang berhasil disimpan!",
      });

      resetForm();
      setShowForm(false);
    } catch (err: any) {
      const message =
        err?.message || "Gagal menyimpan data penumpang. Silakan coba lagi.";
      setStatusMsg({ type: "error", text: message });
      console.error("Passenger save error:", err);
    }
  };

  const isSaving =
    passengerMutation.isPending ||
    updatePassengerMutation.isPending ||
    deletePassengerMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
          Manajemen Data Penumpang Harian
        </h2>

        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {showForm ? "Tutup Form" : "Tambah Data"}
        </button>
      </div>

      {statusMsg && (
        <div
          className={`rounded-md border p-4 ${statusMsg.type === "success"
            ? "border-green-200 bg-green-50 text-green-800"
            : "border-red-200 bg-red-50 text-red-800"
            }`}
        >
          <p className="text-sm font-medium">{statusMsg.text}</p>
        </div>
      )}

      <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
        <label className="block text-sm font-medium text-gray-700">
          Tanggal
        </label>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        />
      </div>

      {showForm && (
        <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maskapai
              </label>
              <select
                required
                value={airline}
                onChange={(e) => setAirline(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Pilih Maskapai</option>
                {airlineOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipe Penerbangan
              </label>
              <select
                value={flightType}
                onChange={(e) => setFlightType(e.target.value as FlightType)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="arrival">Kedatangan</option>
                <option value="departure">Keberangkatan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {flightType === "arrival" ? "Kota Asal" : "Kota Tujuan"}
              </label>
              <select
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Pilih Kota</option>
                {cityOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Penumpang — dewasa + anak dihitung, bayi tidak */}
            <div>
              <p className="mb-2 text-sm font-semibold text-gray-800">Penumpang</p>
              <div className="grid grid-cols-3 gap-4">
                <NumField label="Dewasa" value={paxAdult} onChange={setPaxAdult} required />
                <NumField label="Anak" value={paxChild} onChange={setPaxChild} required />
                <NumField label="Bayi" value={paxInfant} onChange={setPaxInfant} />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Total penumpang dihitung:{" "}
                <span className="font-semibold text-gray-800">
                  {totalPenumpang.toLocaleString("id-ID")}
                </span>{" "}
                (Dewasa + Anak — bayi tidak dihitung)
              </p>
            </div>

            {/* Transit */}
            <div>
              <p className="mb-2 text-sm font-semibold text-gray-800">Transit</p>
              <div className="grid grid-cols-3 gap-4">
                <NumField label="Dewasa" value={paxTransitAdult} onChange={setPaxTransitAdult} />
                <NumField label="Anak" value={paxTransitChild} onChange={setPaxTransitChild} />
                <NumField label="Bayi" value={paxTransitInfant} onChange={setPaxTransitInfant} />
              </div>
            </div>

            {/* Muatan */}
            <div>
              <p className="mb-2 text-sm font-semibold text-gray-800">Muatan (kg)</p>
              <div className="grid grid-cols-3 gap-4">
                <NumField label="Bagasi" value={baggageKg} onChange={setBaggageKg} />
                <NumField label="Kargo" value={cargoKg} onChange={setCargoKg} />
                <NumField label="Pos" value={mailKg} onChange={setMailKg} />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? "Menyimpan..." : editingId ? "Update Data" : "Simpan Data"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Tabel Hasil Inputan
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Maskapai
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Rute
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Jumlah Penumpang
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Load Factor
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-red-500">
                    Gagal memuat data.
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Belum ada data untuk tanggal ini.
                  </td>
                </tr>
              ) : (
                logs.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {row.airline || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {row.city ? getRoute(row) : "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {getPassengerCount(row).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {getLoadFactor(row).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(row)}
                          className="rounded bg-amber-500 px-3 py-1 text-xs font-medium text-white hover:bg-amber-600"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(row.id)}
                          disabled={deletePassengerMutation.isPending}
                          className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
