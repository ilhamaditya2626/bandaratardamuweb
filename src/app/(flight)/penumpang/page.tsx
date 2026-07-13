"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  PassengersClientService,
  type StatRange,
  type StatsData,
  type PassengerLog,
} from "@/services/client/passengers.client";

type PassengerRange = Extract<StatRange, "weekly" | "monthly" | "yearly">;

function getPassengerCount(row: PassengerLog) {
  return Number(row.passenger_count ?? 0);
}

function getLoadFactor(row: PassengerLog) {
  return Number(row.load_factor ?? 0);
}

function getRoute(row: PassengerLog) {
  return row.flight_type === "arrival"
    ? `${row.city}-Sabu`
    : `Sabu-${row.city}`;
}


const sansStyle = { fontFamily: "'Poppins', sans-serif" } as const;
const serifStyle = { fontFamily: "'Playfair Display', serif" } as const;
const rangeOptions: { value: PassengerRange; label: string }[] = [
  { value: "weekly", label: "Mingguan" },
  { value: "monthly", label: "Bulanan" },
  { value: "yearly", label: "Tahunan" },
];
const donutColors = ["#3b82f6", "#facc15"];

function formatDateISO(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shiftDate(baseDate: string, range: PassengerRange, step: number) {
  const next = new Date(`${baseDate}T00:00:00`);
  if (range === "weekly") {
    next.setDate(next.getDate() + step * 7);
  } else if (range === "monthly") {
    next.setMonth(next.getMonth() + step);
  } else {
    next.setFullYear(next.getFullYear() + step);
  }
  return formatDateISO(next);
}

function shiftDay(baseDate: string, step: number) {
  const next = new Date(`${baseDate}T00:00:00`);
  next.setDate(next.getDate() + step);
  return formatDateISO(next);
}

function formatRangeLabel(meta?: StatsData["meta"]) {
  if (!meta) return "Memuat data...";

  const start = new Date(`${meta.startDate}T00:00:00`);
  const end = new Date(`${meta.endDate}T00:00:00`);

  if (meta.range === "weekly") {
    return `${start.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
    })} - ${end.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`;
  }

  if (meta.range === "monthly") {
    return start.toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  }

  return start.toLocaleDateString("id-ID", {
    year: "numeric",
  });
}

function formatDisplayDate(dateString: string) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function PassengerPage() {
  const [range, setRange] = useState<PassengerRange>("monthly");
  const [selectedDate, setSelectedDate] = useState(() => formatDateISO(new Date()));
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-passenger-page", range, selectedDate],
    queryFn: () => PassengersClientService.getStats(range, selectedDate),
    refetchInterval: 30_000,
    refetchOnWindowFocus: false,
  });

  const {
    data: dailyData,
    isLoading: isDailyLoading,
    isError: isDailyError,
  } = useQuery({
    queryKey: ["public-passenger-daily-log", selectedDate],
    queryFn: () => PassengersClientService.getStats("daily", selectedDate),
    refetchInterval: 30_000,
    refetchOnWindowFocus: false,
  });


  const stats = data?.data;
  const dailyStats = dailyData?.data;
  const dailyLogs: PassengerLog[] = useMemo(() => {
    return (dailyStats?.logs || []).filter((row) => {
      return (
        row.airline &&
        row.flight_type &&
        row.city &&
        getPassengerCount(row) > 0
      );
    });
  }, [dailyStats]);

  const trendData = useMemo(() => {
    if (!stats) return [];
    return stats.trendChart.labels.map((label, index) => {
      const arrivals = stats.trendChart.arrivals[index] || 0;
      const departures = stats.trendChart.departures[index] || 0;
      const total = arrivals + departures;
      return {
        label,
        arrivals,
        departures,
        total,
        loadFactor: stats.trendChart.loadFactors[index] || 0,
      };
    });
  }, [stats]);

  const dailyTrendData = useMemo(() => {
    if (!dailyStats) return [];

    return dailyStats.trendChart.labels.map((label, index) => {
      const arrivals = dailyStats.trendChart.arrivals[index] || 0;
      const departures = dailyStats.trendChart.departures[index] || 0;
      const total = arrivals + departures;

      return {
        label,
        arrivals,
        departures,
        total,
        loadFactor: dailyStats.trendChart.loadFactors[index] || 0,
      };
    });
  }, [dailyStats]);


  const donutData = useMemo(
    () => [
      { name: "Kedatangan", value: stats?.donutChart.arrival || 0 },
      { name: "Keberangkatan", value: stats?.donutChart.departure || 0 },
    ],
    [stats]
  );

  const loadFactor = stats?.kpiCards.avgLoadFactor || 0;


  const totalRatio =
    (stats?.donutChart.departure || 0) > 0
      ? ((stats?.donutChart.arrival || 0) / (stats?.donutChart.departure || 1)).toFixed(2)
      : "-";

  return (
    <div className="overflow-x-hidden bg-[#111928] text-gray-200" style={sansStyle}>
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #111928;
        }

        ::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 10px;
        }

        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
      `}</style>

      <section
        className="relative overflow-hidden px-6 pb-12 pt-32"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(17,25,40,0.92) 0%, rgba(17,25,40,1) 100%), url('https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded-full border border-[#facc15]/20 bg-[#facc15]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#facc15]">
                  Operational Center
                </span>
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-bold uppercase tracking-tight text-gray-500">
                  Live Traffic
                </span>
              </div>
              <h1
                className="text-4xl font-bold leading-tight text-white md:text-6xl"
                style={serifStyle}
              >
                Analitik <span className="italic text-[#facc15]">Penumpang</span>
              </h1>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[rgba(31,41,55,0.4)] p-4 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="px-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Tipe Filter
                  </label>
                  <div className="flex gap-1 rounded-2xl border border-white/5 bg-black/30 p-1">
                    {rangeOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setRange(option.value)}
                        className={`rounded-xl cursor-pointer px-5 py-2.5 text-xs font-bold transition-all ${range === option.value
                          ? "bg-[#facc15] text-[#111928] shadow-[0_0_20px_rgba(250,204,21,0.3)]"
                          : "text-gray-400"
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="px-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Input Tanggal
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(event) => setSelectedDate(event.target.value)}
                      className="min-w-[160px] appearance-none rounded-2xl border border-white/10 bg-black/30 px-4 py-2.5 pr-11 text-sm text-white focus:border-[#facc15] focus:outline-none"
                    />
                    <i className="fa-solid pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1400px] px-6 py-12">
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSelectedDate((value) => shiftDate(value, range, -1))}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition hover:text-[#facc15]"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <span className="min-w-[300px] rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-center text-xs font-bold uppercase tracking-widest text-[#facc15]">
            {formatRangeLabel(stats?.meta)}
          </span>
          <button
            type="button"
            onClick={() => setSelectedDate((value) => shiftDate(value, range, 1))}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition hover:text-[#facc15]"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        <section className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[2.5rem] border border-white/8 bg-[rgba(31,41,55,0.4)] p-7 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
              Total Penumpang
            </h3>
            <p className="text-4xl font-bold tracking-tight text-white tabular-nums">
              {isLoading ? "..." : stats?.kpiCards.totalPassengers.toLocaleString("id-ID") || "0"}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-500">
              <i className="fa-solid fa-users"></i>
              <span>Periode {rangeOptions.find((item) => item.value === range)?.label}</span>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white/8 bg-[rgba(31,41,55,0.4)] p-7 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
              Kedatangan
            </h3>
            <p className="text-4xl font-bold tracking-tight text-[#3b82f6] tabular-nums">
              {isLoading ? "..." : stats?.kpiCards.arrivalCount.toLocaleString("id-ID") || "0"}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-500">
              <i className="fa-solid fa-plane-arrival"></i>
              <span>{stats?.kpiCards.arrivalPct ?? 0}% dari total</span>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white/8 bg-[rgba(31,41,55,0.4)] p-7 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
              Keberangkatan
            </h3>
            <p className="text-4xl font-bold tracking-tight text-[#facc15] tabular-nums">
              {isLoading ? "..." : stats?.kpiCards.departureCount.toLocaleString("id-ID") || "0"}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-red-400">
              <i className="fa-solid fa-plane-departure"></i>
              <span>{stats?.kpiCards.departurePct ?? 0}% dari total</span>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white/8 bg-[rgba(31,41,55,0.4)] p-7 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
              Avg. Load Factor
            </h3>
            <div className="flex items-end gap-1">
              <p className="text-4xl font-bold tracking-tight text-white tabular-nums">
                {isLoading ? "..." : stats?.kpiCards.avgLoadFactor.toFixed(1) || "0"}
              </p>
              <span className="mb-1 text-xl font-bold text-gray-600">%</span>
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full bg-cyan-400 transition-all duration-1000"
                style={{ width: `${loadFactor}%` }}
              ></div>
            </div>
          </div>
        </section>

        <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="rounded-[3rem] border border-white/8 bg-[rgba(31,41,55,0.4)] p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl lg:col-span-8">
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-2xl font-bold text-white" style={serifStyle}>
                Tren Pergerakan
              </h3>
              <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-[#3b82f6]"></span>
                  <span>Datang</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-[#facc15]"></span>
                  <span>Berangkat</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-0.5 w-5 bg-white"></span>
                  <span>Load Factor</span>
                </div>
              </div>
            </div>

            <div className="h-[350px]">
              {isClient ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={trendData}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <YAxis yAxisId="left" tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 100]}
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#111928",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 12,
                        color: "#fff",
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="arrivals" name="Datang" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="left" dataKey="departures" name="Berangkat" fill="#facc15" radius={[4, 4, 0, 0]} />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="loadFactor"
                      name="Load Factor"
                      stroke="#ffffff"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full rounded-[2rem] border border-white/5 bg-black/10" />
              )}
            </div>
          </div>

          <div className="rounded-[3rem] border border-white/8 bg-[rgba(31,41,55,0.4)] p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl lg:col-span-4">
            <h3 className="mb-8 text-2xl font-bold text-white" style={serifStyle}>
              Ratio Arus
            </h3>
            <div className="relative mb-8 flex items-center justify-center">
              <div className="absolute flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase text-gray-500">Ratio</span>
                <span className="text-4xl font-bold text-white">{isLoading ? "..." : totalRatio}</span>
              </div>
              <div className="h-56 w-56">
                {isClient ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutData}
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="#1f2937"
                        strokeWidth={8}
                      >
                        {donutData.map((entry, index) => (
                          <Cell key={entry.name} fill={donutColors[index]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "#111928",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 12,
                          color: "#fff",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full rounded-full border border-white/5 bg-black/10" />
                )}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between rounded-2xl border border-white/5 bg-white/5 p-4">
                <span className="text-xs font-bold uppercase text-gray-500">Kedatangan</span>
                <span className="font-bold text-[#3b82f6]">
                  {stats?.kpiCards.arrivalPct ?? 0}%
                </span>
              </div>
              <div className="flex justify-between rounded-2xl border border-white/5 bg-white/5 p-4">
                <span className="text-xs font-bold uppercase text-gray-500">Keberangkatan</span>
                <span className="font-bold text-[#facc15]">
                  {stats?.kpiCards.departurePct ?? 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[3rem] border border-white/8 bg-[rgba(31,41,55,0.4)] p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-white" style={serifStyle}>
                Log Operasional Harian
              </h3>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[#facc15]">
                {formatDisplayDate(selectedDate)}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-500/10 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              {isDailyError ? "Data Error" : "Operational Success"}

            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
            <div className="space-y-6 lg:col-span-1">
              <div className="rounded-3xl border border-white/5 bg-black/20 p-6">
                <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Ringkasan Periode
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Label</span>
                    <span className="text-sm font-bold text-white">{dailyLogs.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Pax Datang</span>
                    <span className="text-sm font-bold text-[#3b82f6]">
                      {dailyStats?.kpiCards.arrivalCount.toLocaleString("id-ID") || "0"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Pax Berangkat</span>
                    <span className="text-sm font-bold text-[#facc15]">
                      {dailyStats?.kpiCards.departureCount.toLocaleString("id-ID") || "0"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="overflow-x-auto">
                <table className="min-w-[600px] w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] font-bold uppercase text-gray-500">
                      <th className="pb-4">Maskapai</th>
                      <th className="pb-4">Rute</th>
                      <th className="pb-4">Jumlah Penumpang</th>
                      <th className="pb-4">Load Factor (%)</th>

                    </tr>
                  </thead>
                  <tbody>
                    {isDailyLoading ? (
                      <tr>
                        <td colSpan={4} className="py-10 text-center text-gray-500 italic">
                          Memuat data penumpang...
                        </td>
                      </tr>
                    ) : isDailyError ? (
                      <tr>
                        <td colSpan={4} className="py-10 text-center text-red-400 italic">
                          Gagal memuat statistik penumpang.
                        </td>
                      </tr>
                    ) : dailyLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-10 text-center text-gray-500 italic">
                          Tidak ada data operasional untuk periode ini.
                        </td>
                      </tr>
                    ) : (
                      dailyLogs.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-white/5 text-white transition hover:bg-white/[0.02]"
                        >
                          <td className="py-5 font-bold text-white">
                            {row.airline || "-"}
                          </td>

                          <td className="py-5 font-mono text-xs text-gray-400">
                            {row.city ? getRoute(row) : "-"}
                          </td>

                          <td className="py-5 font-bold text-[#facc15]">
                            {getPassengerCount(row).toLocaleString("id-ID")}
                          </td>

                          <td className="min-w-[150px] py-5">
                            <div className="flex items-center gap-3">
                              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                                <div
                                  className="h-full bg-emerald-400"
                                  style={{ width: `${Math.min(getLoadFactor(row), 100)}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-emerald-400">
                                {getLoadFactor(row).toFixed(1)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))

                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-10 flex items-center justify-between border-t border-white/5 pt-8">
                <button
                  type="button"
                  onClick={() => setSelectedDate((value) => shiftDay(value, -1))}

                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-xs font-bold text-gray-400 transition hover:bg-white/10"
                >
                  <i className="fa-solid fa-arrow-left"></i> Hari Sebelumnya
                </button>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                  Passenger Traffic Control
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedDate((value) => shiftDay(value, 1))}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-xs font-bold text-gray-400 transition hover:bg-white/10"
                >
                  Hari Sesudahnya <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
