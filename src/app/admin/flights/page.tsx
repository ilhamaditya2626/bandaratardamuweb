"use client";

import { useState } from "react";
import { Edit2, MessageSquare, Plus, Trash2, X } from "lucide-react";
import { useGetFlights, useCreateFlight, useUpdateFlight, useDeleteFlight } from "@/hooks/useFlights";

const airlineOptions = [
  { value: "Susi Air", label: "Susi Air" },
];

const airportOptions = [
  { value: "Kupang (KOE)", label: "Kupang (KOE)" },
  { value: "Waingapu (WGP)", label: "Waingapu (WGP)" },
  { value: "Ende (ENE)", label: "Ende (ENE)" },
  { value: "Rote (RTI)", label: "Rote (RTI)" },
];

const flightTypeOptions = [
  { value: "reguler", label: "Reguler" },
  { value: "extra_flight", label: "Extra Flight" },
  { value: "charter_flight", label: "Charter Flight" },
  { value: "perintis", label: "Perintis" },
];

type FlightType = "reguler" | "extra_flight" | "charter_flight" | "perintis";

export default function FlightsPage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [flightNo, setFlightNo] = useState("");
  const [airline, setAirline] = useState("");
  const [origin, setOrigin] = useState("");
  const [dest, setDest] = useState("");
  const [type, setType] = useState<"arrival" | "departure">("arrival");
  const [flightType, setFlightType] = useState<FlightType>("reguler");
  const [timeType, setTimeType] = useState<"STA" | "ETA" | "STD" | "ETD">("STA");
  const [sta, setSta] = useState("");
  const [eta, setEta] = useState("");
  const [std, setStd] = useState("");
  const [etd, setEtd] = useState("");


  const [status, setStatus] = useState("ontime");
  const [notes, setNotes] = useState("");

  const { data: response, isLoading: isFetching } = useGetFlights(date);

  const flights = response?.data || [];

  const timeTypeOptions =
    type === "arrival"
      ? [
        { value: "STA", label: "STA" },
        { value: "ETA", label: "ETA" },
      ]
      : [
        { value: "STD", label: "STD" },
        { value: "ETD", label: "ETD" },
      ];

  const handleTypeChange = (value: "arrival" | "departure") => {
    setType(value);
    setTimeType(value === "arrival" ? "STA" : "STD");
  };


  const createMutation = useCreateFlight({
    onSuccess: () => {
      alert("Jadwal penerbangan ditambahkan!");
      setIsModalOpen(false);
      resetForm();
    },
    onError: () => alert("Gagal menyimpan jadwal."),
  });

  const updateMutation = useUpdateFlight({
    onSuccess: () => {
      alert("Jadwal penerbangan diperbarui!");
      setIsModalOpen(false);
      resetForm();
    },
    onError: () => alert("Gagal menyimpan jadwal."),
  });

  const deleteMutation = useDeleteFlight({
    onError: () => alert("Gagal menghapus jadwal."),
  });

  const resetForm = () => {
    setEditingId(null);
    setFlightNo("");
    setAirline("");
    setOrigin("");
    setDest("");
    setType("arrival");
    setTimeType("STA");
    setSta("");
    setEta("");
    setStd("");
    setEtd("");
    setFlightType("reguler");

    setStatus("ontime");
    setNotes("");
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (flight: any) => {
    setEditingId(flight.id);
    setFlightNo(flight.flight_no);
    setAirline(flight.airline);
    setOrigin(flight.origin || "");
    setDest(flight.destination || "");
    setType(flight.type);
    setTimeType(flight.type === "arrival" ? "STA" : "STD");
    setSta(flight.type === "arrival" ? flight.scheduled_time : "");
    setEtd(flight.type === "arrival" ? (flight.estimated_time || "") : "");
    setStd(flight.type === "departure" ? flight.scheduled_time : "");
    setEta(flight.type === "departure" ? (flight.estimated_time || "") : "");

    setStatus(flight.status || "ontime");
    setNotes(flight.notes || "");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      flight_no: flightNo,
      airline,
      origin,
      destination: dest,
      type,
      flight_type: flightType,
      scheduled_time: type === "arrival" ? sta : std,
      estimated_time: type === "arrival" ? (etd || undefined) : (eta || undefined),
      status,
      status_label: status.toUpperCase(),
      notes: notes.trim() || null,
      flight_date: date,
    };



    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Hapus jadwal ini?")) return;
    deleteMutation.mutate(id);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header & Date Picker */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Jadwal Penerbangan
        </h2>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Jadwal
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Penerbangan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maskapai / Flight No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rute</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catatan</th>
                    <th className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isFetching ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">Memuat data...</td>
                    </tr>
                  ) : flights.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">
                        Tidak ada aktivitas penerbangan pada tanggal {date}.
                      </td>
                    </tr>
                  ) : (
                    flights.map((f) => (
                      <tr key={f.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${f.type === 'arrival' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {f.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${f.flight_type === "perintis" ? "bg-purple-100 text-purple-800" :
                              f.flight_type === "charter_flight" ? "bg-indigo-100 text-indigo-800" :
                                f.flight_type === "extra_flight" ? "bg-orange-100 text-orange-800" :
                                  "bg-blue-100 text-blue-800"
                            } capitalize`}>
                            {f.flight_type}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          {f.type === "arrival" ? (
                            <div>
                              <div>STA: {f.scheduled_time || "-"}</div>
                              <div className="text-gray-500">ETD: {f.estimated_time || "-"}</div>
                            </div>
                          ) : (
                            <div>
                              <div>STD: {f.scheduled_time || "-"}</div>
                              <div className="text-gray-500">ETA: {f.estimated_time || "-"}</div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {f.airline} <span className="text-gray-500">({f.flight_no})</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {f.origin ? `${f.origin} → SAU` : `SAU → ${f.destination}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {f.status_label || f.status}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {f.notes ? (
                            <div className="flex max-w-xs items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900 shadow-sm">
                              <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                              <span className="line-clamp-2 leading-relaxed">{f.notes}</span>
                            </div>
                          ) : (
                            <span className="text-xs italic text-gray-400">Tidak ada</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap right-0 text-right text-sm font-medium flex justify-end gap-2">
                          <button onClick={() => openEditModal(f)} className="text-blue-600 hover:text-blue-900">
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDelete(f.id)} className="text-red-600 hover:text-red-900">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 z-40 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="relative z-50 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {editingId ? "Edit Jadwal Penerbangan" : "Tambah Jadwal Penerbangan"}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form id="flightForm" onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Maskapai</label>
                    <select
                      required
                      value={airline}
                      onChange={(e) => setAirline(e.target.value)}
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Pilih Maskapai</option>
                      {airlineOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">No. Flight</label>
                    <input required type="text" value={flightNo} onChange={(e) => setFlightNo(e.target.value)} placeholder="PK-BVQ" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Tipe Penerbangan</label>
                    <div className="mt-2 flex gap-4">
                      <label className="inline-flex items-center">
                        <input type="radio" value="arrival" checked={type === "arrival"} onChange={() => handleTypeChange("arrival")}
                          className="form-radio text-blue-600 focus:ring-blue-500 rounded-full h-4 w-4" />
                        <span className="ml-2 text-sm text-gray-700">Kedatangan (Arrival)</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input type="radio" value="departure" checked={type === "departure"} onChange={() => handleTypeChange("departure")}
                          className="form-radio text-blue-600 focus:ring-blue-500 rounded-full h-4 w-4" />
                        <span className="ml-2 text-sm text-gray-700">Keberangkatan (Departure)</span>
                      </label>
                    </div>
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Jenis Penerbangan
                    </label>
                    <select
                      required
                      value={flightType}
                      onChange={(e) => setFlightType(e.target.value as FlightType)}
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      {flightTypeOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {type === "arrival" ? (
                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">Kota Asal (Origin)</label>
                      <select
                        required
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Pilih Kota Asal</option>
                        {airportOptions.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">Kota Tujuan (Destination)</label>
                      <select
                        required
                        value={dest}
                        onChange={(e) => setDest(e.target.value)}
                        className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Pilih Kota Tujuan</option>
                        {airportOptions.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {type === "arrival" ? (
                    <>
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">STA</label>
                        <input
                          required
                          type="time"
                          value={sta}
                          onChange={(e) => setSta(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">ETD</label>
                        <input
                          type="time"
                          value={etd}
                          onChange={(e) => setEtd(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />


                      </div>
                    </>
                  ) : (
                    <>
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">STD</label>
                        <input
                          required
                          type="time"
                          value={std}
                          onChange={(e) => setStd(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">ETA</label>
                        <input
                          type="time"
                          value={eta}
                          onChange={(e) => setEta(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />

                      </div>
                    </>
                  )}

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select required value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      <option value="On Time">On Time</option>
                      <option value="Delayed">Delayed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Scheduled">Scheduled</option>
                    </select>
                  </div>

                  <div className="sm:col-span-6">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <MessageSquare className="h-4 w-4 text-amber-500" />
                      Catatan Penerbangan
                    </label>
                    <div className="mt-2 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-3 shadow-sm focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100">
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        maxLength={280}
                        placeholder="Contoh: Penerbangan mengalami delay karena cuaca di rute tujuan."
                        className="block w-full resize-none border-0 bg-transparent p-0 text-sm leading-relaxed text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
                      />
                      <div className="mt-3 flex items-center justify-between gap-3 border-t border-amber-100 pt-3 text-xs text-gray-500">
                        <span>Opsional, akan tampil di halaman utama jika diisi.</span>
                        <span className="font-medium text-amber-700">{notes.length}/280</span>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="submit" form="flightForm" disabled={isSaving} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                  {isSaving ? "Menyimpan..." : "Simpan"}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
