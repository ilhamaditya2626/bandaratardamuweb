"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FlightsClientService, type Flight } from "@/services/client/flights.client";
import {
  TicketPricesClientService,
  type TicketPrice,
} from "@/services/client/ticket-prices.client";

type FlightTab = "arrival" | "departure";

const serifStyle = { fontFamily: "'Playfair Display', serif" } as const;
const sansStyle = { fontFamily: "'Poppins', sans-serif" } as const;

type TicketPriceCardItem = Pick<
  TicketPrice,
  "origin" | "destination" | "flight_type" | "operating_days" | "price"
>;

const defaultTicketPrices: TicketPriceCardItem[] = [
  {
    origin: "Kupang",
    destination: "Sabu",
    flight_type: "reguler",
    operating_days: ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"],
    price: 1250000,
  },
  {
    origin: "Sabu",
    destination: "Kupang",
    flight_type: "reguler",
    operating_days: ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"],
    price: 1180000,
  },
  {
    origin: "Ende",
    destination: "Sabu",
    flight_type: "perintis",
    operating_days: ["senin", "rabu", "jumat"],
    price: 850000,
  },
  {
    origin: "Sabu",
    destination: "Waingapu",
    flight_type: "perintis",
    operating_days: ["selasa", "kamis"],
    price: 920000,
  },
];

const dayLabels: Record<string, string> = {
  senin: "Senin",
  selasa: "Selasa",
  rabu: "Rabu",
  kamis: "Kamis",
  jumat: "Jumat",
  sabtu: "Sabtu",
  minggu: "Minggu",
};

function formatDateISO(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatTravelokaDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return formatTravelokaDate(formatDateISO(new Date()));
  }

  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

function formatDateDisplay(dateString: string) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getStatusClasses(status?: string | null) {
  switch ((status || "").toLowerCase()) {
    case "ontime":
    case "landed":
      return "bg-green-500/20 text-green-400";
    case "delayed":
      return "bg-yellow-400/20 text-yellow-300";
    case "cancelled":
      return "bg-red-500/20 text-red-400";
    case "boarding":
      return "bg-violet-500/20 text-violet-300";
    default:
      return "bg-slate-500/20 text-slate-300";
  }
}

function FlightStatusBadge({
  status,
  label,
}: {
  status?: string | null;
  label?: string | null;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${getStatusClasses(status)}`}
    >
      <i className="fa-solid fa-circle mr-1 text-[6px]"></i>
      {label || status || "-"}
    </span>
  );
}

function getFlightTypeLabel(type?: string | null) {
  switch (type) {
    case "reguler":
      return "Reguler";
    case "extra_flight":
      return "Extra Flight";
    case "charter_flight":
      return "Charter Flight";
    case "perintis":
      return "Perintis";
    default:
      return "-";
  }
}

function getFlightTypeClasses(type?: string | null) {
  switch (type) {
    case "perintis":
      return "bg-purple-500/20 text-purple-300";
    case "charter_flight":
      return "bg-indigo-500/20 text-indigo-300";
    case "extra_flight":
      return "bg-orange-400/20 text-orange-300";
    case "reguler":
    default:
      return "bg-blue-500/20 text-blue-300";
  }
}

function formatTicketPrice(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function getTicketTypeClasses(type?: string | null) {
  return type === "perintis"
    ? "border-purple-400/30 bg-purple-500/20 text-purple-200"
    : "border-blue-400/30 bg-blue-500/20 text-blue-200";
}

function formatTicketDays(days: string[]) {
  if (days.length === 7) return "Setiap hari";
  if (days.length === 0) return "Menyesuaikan jadwal";

  return days.map((day) => dayLabels[day] || day).join(", ");
}

const travelokaAirportCodes: Record<string, string> = {
  ende: "ENE",
  kupang: "KOE",
  rote: "RTI",
  sabu: "SAU",
  "sabu raijua": "SAU",
  waingapu: "WGP",
};

function getAirportCode(city: string) {
  const cityCode = city.match(/\(([A-Z]{3})\)/)?.[1];

  if (cityCode) return cityCode;

  return travelokaAirportCodes[city.trim().toLowerCase()];
}

function getTravelokaFlightUrl(item: TicketPriceCardItem, dateString: string) {
  const origin = getAirportCode(item.origin);
  const destination = getAirportCode(item.destination);

  if (!origin || !destination) {
    return "https://www.traveloka.com/id-id/flight";
  }

  const params = new URLSearchParams({
    ap: `${origin}.${destination}`,
    dt: `${formatTravelokaDate(dateString)}.NA`,
    ps: "1.0.0",
    sc: "ECONOMY",
  });

  return `https://www.traveloka.com/id-id/flight/fullsearch?${params.toString()}`;
}

function TicketRouteCard({
  item,
  selectedDate,
}: {
  item: TicketPriceCardItem;
  selectedDate: string;
}) {
  const travelokaUrl = getTravelokaFlightUrl(item, selectedDate);

  return (
    <a
      href={travelokaUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={`Cari tiket ${item.origin} ke ${item.destination} di Traveloka`}
      className="group relative block min-h-[230px] cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-[#151e2d] p-6 shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-[#facc15]/40 focus:outline-none focus:ring-2 focus:ring-[#facc15]/70 focus:ring-offset-2 focus:ring-offset-[#111928]"
    >
      <div className="pointer-events-none absolute right-0 top-0 h-28 w-14 rounded-bl-[56px] bg-white/[0.04] transition group-hover:bg-[#facc15]/10"></div>
      <div className="pointer-events-none absolute inset-x-6 top-[106px] border-t border-white/10"></div>

      <div className="relative flex items-start justify-between gap-4">
        <span
          className={`inline-flex rounded-lg border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${getTicketTypeClasses(
            item.flight_type
          )}`}
        >
          {item.flight_type}
        </span>
        <span className="max-w-[120px] text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          {formatTicketDays(item.operating_days)}
        </span>
      </div>

      <div className="relative mt-7 grid grid-cols-[1fr_auto_1fr] items-end gap-3">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Asal
          </p>
          <h3 className="text-xl font-black text-white">{item.origin}</h3>
        </div>
        <div className="mb-1 flex h-7 w-7 items-center justify-center rounded-full border border-[#facc15]/30 bg-[#facc15]/10 text-[10px] text-[#facc15]">
          <i className="fa-solid fa-chevron-right"></i>
        </div>
        <div className="text-right">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Tujuan
          </p>
          <h3 className="text-xl font-black text-white">{item.destination}</h3>
        </div>
      </div>

      <div className="relative mt-11 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Mulai dari
          </p>
          <p className="text-2xl font-black text-[#facc15]" style={serifStyle}>
            <span className="mr-1 text-xs italic">IDR</span>
            {formatTicketPrice(item.price)}
          </p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-white transition group-hover:bg-[#facc15] group-hover:text-[#111928]">
          <i className="fa-solid fa-arrow-right text-sm"></i>
        </div>
      </div>
    </a>
  );
}

function FlightRow({
  flight,
  tab,
}: {
  flight: Flight;
  tab: FlightTab;
}) {
  return (
    <tr className="transition hover:bg-white/[0.02]">
      <td className="px-6 py-4 font-semibold">{flight.airline}</td>

      <td className="px-6 py-4">
        <strong>{flight.flight_no}</strong>
      </td>

      <td className="px-6 py-4">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${getFlightTypeClasses(flight.flight_type)}`}>
          {getFlightTypeLabel(flight.flight_type)}
        </span>
      </td>

      <td className="px-6 py-4">
        {tab === "arrival" ? flight.origin || "-" : flight.destination || "-"}
      </td>

      <td className="px-6 py-4 text-center font-mono">
        {flight.scheduled_time}
      </td>

      <td className="px-6 py-4 text-center font-mono">
        {flight.estimated_time || flight.scheduled_time}
      </td>
    </tr>
  );
}

function SkeletonRows() {
  return (
    <tr>
      <td colSpan={6} className="px-6 py-10">
        <div className="flex animate-pulse flex-col gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="h-4 w-32 rounded bg-white/10"></div>
              <div className="h-4 w-24 rounded bg-white/10"></div>
              <div className="h-4 w-28 rounded bg-white/10"></div>
              <div className="ml-auto h-4 w-16 rounded bg-white/10"></div>
            </div>
          ))}
        </div>
      </td>
    </tr>
  );
}

export default function FlightsPage() {
  const [activeTab, setActiveTab] = useState<FlightTab>("arrival");
  const [selectedDate, setSelectedDate] = useState(() => formatDateISO(new Date()));

  const today = useMemo(() => formatDateISO(new Date()), []);
  const displayDate = useMemo(() => formatDateDisplay(selectedDate), [selectedDate]);

  const { data: flightResponse, isLoading, isError } = useQuery({
    queryKey: ["public-flight-page", selectedDate, activeTab],
    queryFn: () => FlightsClientService.getFlights(selectedDate, activeTab),
    refetchInterval: 30_000,
    refetchOnWindowFocus: false,
  });

  const { data: ticketPriceResponse, isLoading: isPriceLoading } = useQuery({
    queryKey: ["public-ticket-prices"],
    queryFn: () => TicketPricesClientService.getPublicPrices(),
    refetchInterval: 60_000,
    refetchOnWindowFocus: false,
  });

  const flights = flightResponse?.data || [];
  const ticketPrices =
    ticketPriceResponse?.data && ticketPriceResponse.data.length > 0
      ? ticketPriceResponse.data
      : defaultTicketPrices;

  const cityOrder = ["kupang", "waingapu", "ende", "rote"];
  const sortedTicketPrices = [...ticketPrices].sort((a, b) => {
    const getIndex = (item: typeof ticketPrices[0]) => {
      const o = item.origin.toLowerCase();
      const d = item.destination.toLowerCase();
      for (let i = 0; i < cityOrder.length; i++) {
        if (o.includes(cityOrder[i]) || d.includes(cityOrder[i])) return i;
      }
      return 999;
    };
    return getIndex(a) - getIndex(b);
  });

  const tableLabel = activeTab === "arrival" ? "kedatangan" : "keberangkatan";

  return (
    <>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #111928;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #facc15;
        }

        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }

        input[type="date"] {
          appearance: none;
          -webkit-appearance: none;
        }
      `}</style>

      <div className="overflow-x-hidden bg-[#111928] text-white" style={sansStyle}>
        <section className="relative px-6 pb-16 pt-32">
          <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
            <nav className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-400">
              <Link href="/" className="transition hover:text-[#facc15]">
                Beranda
              </Link>
              <i className="fa-solid fa-chevron-right text-[8px]"></i>
              <span className="text-[#facc15]">Jadwal Penerbangan</span>
            </nav>
            <h1 className="mb-6 text-4xl font-bold italic md:text-6xl" style={serifStyle}>
              Flight <span className="italic text-[#facc15]">Information</span>
            </h1>
            <p className="max-w-2xl font-light italic text-gray-400">
              Informasi real-time kedatangan dan keberangkatan di pintu gerbang udara Pulau
              Sabu Raijua.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 pb-24">
          <div className="mb-10 flex flex-col items-stretch gap-6 lg:flex-row">
            <div className="flex flex-1 rounded-2xl border border-white/10 bg-[#1f2937]/50 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("departure")}
                className={`flex-1 rounded-xl py-4 transition-all duration-300 cursor-pointer ${activeTab === "departure"
                  ? "bg-[#facc15] font-bold text-[#111928] shadow-lg"
                  : "text-gray-400 hover:text-white"
                  }`}
              >
                <span className="flex items-center justify-center gap-3">
                  <i className="fa-solid fa-plane-departure"></i> Keberangkatan
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("arrival")}
                className={`flex-1 rounded-xl py-4 transition-all duration-300 cursor-pointer ${activeTab === "arrival"
                  ? "bg-[#facc15] font-bold text-[#111928] shadow-lg"
                  : "text-gray-400 hover:text-white"
                  }`}
              >
                <span className="flex items-center justify-center gap-3">
                  <i className="fa-solid fa-plane-arrival"></i> Kedatangan
                </span>
              </button>
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex items-center rounded-2xl border border-white/10 bg-[#1f2937] px-4 py-2">
                <i className="fa-solid fa-calendar mr-3 text-[#facc15]"></i>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  className="w-full border-none bg-transparent text-sm font-medium focus:ring-0 lg:w-auto"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedDate(today);
                }}
                className="flex items-center cursor-pointer justify-center gap-2 rounded-2xl border border-white/5 bg-gray-800 px-6 py-4 text-gray-300 transition hover:bg-gray-700"
              >
                <i className="fa-solid fa-rotate"></i> <span className="text-sm">Reset</span>
              </button>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap items-center justify-between rounded-r-xl border-l-4 border-[#facc15] bg-[#facc15]/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#facc15] opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-[#facc15]"></span>
              </span>
              <span className="text-sm font-bold uppercase tracking-widest text-[#facc15]">
                Data Penerbangan Langsung
              </span>
            </div>
            <div className="text-xs font-medium text-gray-300">
              {isLoading ? (
                <span className="mr-4">Memuat data...</span>
              ) : isError ? (
                <span className="mr-4 text-red-400">Gagal memuat data. Coba lagi.</span>
              ) : flights.length === 0 ? (
                <span className="mr-4 underline decoration-[#facc15] underline-offset-4">Tidak ada penerbangan</span>
              ) : (
                <span className="mr-4 underline decoration-[#facc15] underline-offset-4">
                  Menampilkan <strong>{flights.length}</strong> penerbangan
                </span>
              )}
              <span className="opacity-60">{displayDate}</span>
            </div>
          </div>

          <div className="relative min-h-[400px]">
            <div className="rounded-3xl border border-white/10 bg-[#1f2937] shadow-2xl">
              <div className="custom-scrollbar overflow-x-auto rounded-3xl">
                <table className="min-w-[800px] w-full border-collapse text-center">
                  <thead className="border-b border-white/10 bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-5 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
                        Maskapai
                      </th>
                      <th className="px-6 py-5 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
                        No. Penerbangan
                      </th>
                      <th className="px-6 py-5 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
                        Jenis Penerbangan
                      </th>
                      <th className="px-6 py-5 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
                        {activeTab === "arrival" ? "Asal" : "Tujuan"}
                      </th>
                      <th className="px-6 py-5 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
                        {activeTab === "arrival" ? "STA" : "STD"}
                      </th>
                      <th className="px-6 py-5 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
                        {activeTab === "arrival" ? "ETD" : "ETA"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-medium">
                    {isLoading ? (
                      <SkeletonRows />
                    ) : isError || flights.length === 0 ? null : (
                      flights.map((flight) => (
                        <FlightRow key={flight.id} flight={flight} tab={activeTab} />
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {!isLoading && (
                <div
                  className={`${isError || flights.length === 0 ? "flex" : "hidden"} flex-col items-center py-20 text-center text-gray-500`}
                >
                  <i className="fa-solid fa-plane-slash mb-4 text-4xl opacity-20"></i>
                  <p className="italic">
                    {isError
                      ? "Gagal memuat jadwal penerbangan. Coba lagi."
                      : `Tidak ada jadwal ${tableLabel} pada tanggal dipilih.`}
                  </p>
                </div>
              )}
            </div>
          </div>

          <section className="mt-16">
            <div className="mb-10 text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#facc15]">
                Estimasi Tarif
              </p>
              <h2 className="text-3xl font-bold italic md:text-5xl" style={serifStyle}>
                Rute & <span className="text-[#facc15]">Harga Tiket</span>
              </h2>
              <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#facc15]"></div>
              <p className="mx-auto mt-6 max-w-2xl text-sm italic leading-relaxed text-slate-400 md:text-base">
                Estimasi harga tiket untuk penerbangan dari Bandar Udara Tardamu Sabu Raijua. Harga dapat
                berubah sewaktu-waktu sesuai kebijakan maskapai.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {isPriceLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="min-h-[230px] animate-pulse rounded-3xl border border-white/10 bg-white/[0.04] p-6"
                  >
                    <div className="h-5 w-20 rounded bg-white/10"></div>
                    <div className="mt-10 h-8 rounded bg-white/10"></div>
                    <div className="mt-16 h-9 w-36 rounded bg-white/10"></div>
                  </div>
                ))
                : sortedTicketPrices.map((item) => (
                  <TicketRouteCard
                    key={`${item.origin}-${item.destination}-${item.flight_type}`}
                    item={item}
                    selectedDate={selectedDate}
                  />
                ))}
            </div>
          </section>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 – Informasi Jadwal */}
            <div className="flex flex-col gap-6 rounded-3xl border border-white/5 bg-gray-900/40 p-8 transition hover:border-[#facc15]/30">
              <div className="flex flex-col items-center w-full">
                <div className="w-fit rounded-2xl bg-[#facc15]/20 p-4 text-[#facc15] mb-4">
                  <i className="fa-regular fa-clock text-2xl"></i>
                </div>
                <h4 className="text-lg font-bold text-white">Informasi Jadwal</h4>
              </div>
              <div>
                <p className="text-sm leading-relaxed text-gray-400 text-center">
                  Jadwal dapat berubah sewaktu-waktu karena alasan operasional atau cuaca. Kami menyarankan tiba <strong className="text-[#facc15]">90 menit lebih awal</strong> di bandara sebelum jadwal keberangkatan.
                </p>
              </div>
            </div>

            {/* Card 2 – Aturan Bagasi */}
            <div className="flex flex-col gap-6 rounded-3xl border border-white/5 bg-gray-900/40 p-8 transition hover:border-[#facc15]/30">
              <div className="flex flex-col items-center w-full">
                <div className="w-fit rounded-2xl bg-[#facc15]/20 p-4 text-[#facc15] mb-4">
                  <i className="fa-solid fa-suitcase-rolling text-2xl"></i>
                </div>
                <h4 className="text-lg font-bold text-white">Ketentuan Penerbangan</h4>
              </div>

              <div className="w-full">
                <ul className="flex flex-col space-y-3 text-sm text-gray-400">

                  <li className="flex items-start gap-3">
                    <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#facc15]/20 text-[8px] text-[#facc15]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#facc15]"></div>
                    </div>
                    <span>
                      Free Baggage <strong className="text-white">5 KG</strong>
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#facc15]/20 text-[8px] text-[#facc15]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#facc15]"></div>
                    </div>
                    <span>
                      Free Hand Carry <strong className="text-white">5 KG</strong>
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                      <i className="fa-solid fa-user text-[9px]"></i>
                    </div>
                    <span className="text-xs leading-relaxed text-justify">
                      Demi menjaga keselamatan dan keseimbangan pesawat, penumpang dengan berat badan diatas{" "}
                      <strong className="text-white">100 KG</strong> akan dikenakan biaya tiket{" "}
                      <strong className="text-blue-400">2 kursi / 2 tiket</strong> sesuai kebijakan operasional maskapai.
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-400">
                      <i className="fa-solid fa-info text-[10px]"></i>
                    </div>
                    <span className="text-xs leading-relaxed text-left">
                      Kelebihan bagasi akan dikenakan{" "}
                      <strong className="text-red-400">biaya tambahan</strong> (Extra Baggage).
                    </span>
                  </li>

                </ul>
              </div>
            </div>

            {/* Card 3 – Butuh Bantuan? */}
            <div className="flex flex-col justify-between rounded-3xl bg-gradient-to-br from-[#facc15] to-yellow-600 p-8 text-[#111928]">
              <div>
                <h4 className="mb-4 text-xl font-bold">Butuh Bantuan?</h4>
                <p className="mb-6 text-sm font-medium">
                  Hubungi Customer Service Maskapai untuk konfirmasi tiket dan info operasional
                  tambahan.
                </p>

                <div className="flex flex-col gap-3">
                  <a
                    href="https://wa.me/628112113090"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#111928] py-3 font-bold text-white transition hover:scale-105"
                  >
                    <i className="fa-regular fa-comment-dots"></i> Chat Susi Air
                  </a>

                  <a
                    href="https://susiair.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-2xl border border-[#111928]/20 bg-white py-3 font-bold text-[#111928] transition hover:scale-105"
                  >
                    <i className="fa-solid fa-globe"></i> Website Susi Air
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
