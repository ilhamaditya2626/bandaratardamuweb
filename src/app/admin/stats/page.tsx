import { getStats, getAvailableStatsMonths } from "@/services/passengers.service";
import {
  Users,
  PlaneTakeoff,
  PlaneLanding,
  TrendingUp,
  Plane,
  Package,
  Calendar,
  ArrowRight,
  ExternalLink,
  Layers,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import StatsChart from "@/components/admin/StatsChart";
import MonthFilter from "./month-filter";

interface AdminStatsPageProps {
  searchParams?: Promise<{ month?: string }>;
}

export default async function AdminStatsPage({ searchParams }: AdminStatsPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const availableMonths = await getAvailableStatsMonths();

  // Tentukan bulan terpilih:
  // 1. Dari query param ?month=
  // 2. Bulan ini (jika ada di DB)
  // 3. Bulan terbaru yang tersedia di DB
  const todayYm = new Date().toISOString().slice(0, 7);
  let selectedMonth = resolvedParams.month || "";

  if (!selectedMonth || !availableMonths.some((m) => m.yearMonth === selectedMonth)) {
    if (availableMonths.some((m) => m.yearMonth === todayYm)) {
      selectedMonth = todayYm;
    } else if (availableMonths.length > 0) {
      selectedMonth = availableMonths[0].yearMonth;
    } else {
      selectedMonth = todayYm;
    }
  }

  const anchorDate = `${selectedMonth}-01`;
  const stats = await getStats("monthly", anchorDate);

  const selectedMonthObj = availableMonths.find((m) => m.yearMonth === selectedMonth);
  const monthDisplayTitle = selectedMonthObj ? selectedMonthObj.label : selectedMonth;

  const chartData = stats.trendChart.labels.map((label: string, index: number) => ({
    name: label,
    kedatangan: stats.trendChart.arrivals[index] || 0,
    keberangkatan: stats.trendChart.departures[index] || 0,
    loadFactor: stats.trendChart.loadFactors[index] || 0,
  }));

  const startDateObj = new Date(`${stats.meta.startDate}T00:00:00`);
  const endDateObj = new Date(`${stats.meta.endDate}T00:00:00`);
  const periodDateRange = `${startDateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
  })} – ${endDateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}`;

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
            <Layers className="h-4 w-4" />
            <span>Laporan Trafik &amp; Kinerja</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl font-display">
            Statistik Penerbangan dan Penumpang
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Data akumulasi operasional penerbangan perintis dan komersial Bandara Tardamu Sabu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {availableMonths.length > 0 && (
            <MonthFilter
              availableMonths={availableMonths}
              selectedMonth={selectedMonth}
            />
          )}

          <Link
            href="/admin/passengers"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
          >
            <span>Log Penumpang</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <Link
            href="/penumpang"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
            title="Lihat tampilan halaman publik"
          >
            <span>Web Publik</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Active Period Notice */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-xs text-amber-900">
        <div className="flex items-center gap-2 font-medium">
          <Calendar className="h-4 w-4 text-amber-600" />
          <span>
            Periode Data Terpilih: <strong>{monthDisplayTitle}</strong> ({periodDateRange})
          </span>
        </div>
        <span className="font-semibold text-amber-700">
          Total {stats.kpiCards.totalFlights} Penerbangan Tercatat di Database
        </span>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Total Penumpang */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Penumpang
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              {stats.kpiCards.totalPassengers.toLocaleString("id-ID")}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Akumulasi datang &amp; berangkat
            </p>
          </div>
        </div>

        {/* Kedatangan */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Kedatangan
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <PlaneLanding className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-600">
              {stats.kpiCards.arrivalCount.toLocaleString("id-ID")}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {stats.kpiCards.arrivalPct}% dari total penumpang
            </p>
          </div>
        </div>

        {/* Keberangkatan */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Keberangkatan
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <PlaneTakeoff className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-600">
              {stats.kpiCards.departureCount.toLocaleString("id-ID")}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {stats.kpiCards.departurePct}% dari total penumpang
            </p>
          </div>
        </div>

        {/* Total Operasi Penerbangan */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Penerbangan
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <Plane className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              {stats.kpiCards.totalFlights.toLocaleString("id-ID")}
            </div>
            <p className="mt-1 text-xs text-slate-500">Operasi rute di {monthDisplayTitle}</p>
          </div>
        </div>

        {/* Load Factor Average */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Avg Load Factor
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-purple-600">
              {stats.kpiCards.avgLoadFactor}%
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-purple-600"
                style={{ width: `${Math.min(100, stats.kpiCards.avgLoadFactor)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Total Bagasi & Kargo */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Bagasi
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              {(stats.kpiCards.totalBaggage || 0).toLocaleString("id-ID")}
              <span className="text-xs font-normal text-slate-500 ml-1">kg</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Kargo: {(stats.kpiCards.totalCargo || 0).toLocaleString("id-ID")} kg
            </p>
          </div>
        </div>
      </div>

      {/* Chart Section & Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Tren Mingguan Trafik Penumpang
              </h3>
              <p className="text-xs text-slate-500">
                Distribusi kedatangan dan keberangkatan pada bulan {monthDisplayTitle}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              {monthDisplayTitle}
            </span>
          </div>

          <StatsChart data={chartData} />
        </div>

        {/* Ratio & Route Summary */}
        <div className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Rasio Trafik Kedatangan vs Keberangkatan
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Perbandingan arus penumpang di Bandara Tardamu
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-700 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    Kedatangan
                  </span>
                  <span className="text-slate-800">
                    {stats.kpiCards.arrivalCount} pax ({stats.kpiCards.arrivalPct}%)
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${stats.kpiCards.arrivalPct}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-amber-700 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    Keberangkatan
                  </span>
                  <span className="text-slate-800">
                    {stats.kpiCards.departureCount} pax ({stats.kpiCards.departurePct}%)
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${stats.kpiCards.departurePct}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Routes in this month */}
          <div className="border-t border-slate-100 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              Destinasi / Rute Teraktif
            </h4>

            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {stats.routeBreakdown && stats.routeBreakdown.length > 0 ? (
                stats.routeBreakdown.slice(0, 5).map((r, idx) => (
                  <div
                    key={`${r.city}-${r.flight_type}-${idx}`}
                    className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          r.flight_type === "arrival" ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      ></span>
                      <span className="font-semibold text-slate-800">{r.city}</span>
                      <span className="text-[10px] text-slate-400 uppercase">
                        ({r.flight_type === "arrival" ? "Datang" : "Berangkat"})
                      </span>
                    </div>
                    <div className="text-right font-medium text-slate-600">
                      <span className="font-bold text-slate-900">{r.passengers}</span> pax{" "}
                      <span className="text-[10px] text-slate-400">({r.flights} penerbangan)</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">Belum ada rute tercatat</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Log Table for Selected Month */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Rincian Log Penerbangan — {monthDisplayTitle}
            </h3>
            <p className="text-xs text-slate-500">
              Menampilkan {stats.logs.length} data rute penerbangan yang tercatat di database
            </p>
          </div>

          <Link
            href="/admin/passengers"
            className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            <span>Kelola / Edit Log Penumpang</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 font-semibold text-slate-600">
              <tr>
                <th className="py-3.5 pl-6 pr-3">Tanggal</th>
                <th className="px-3 py-3.5">Maskapai</th>
                <th className="px-3 py-3.5">Tipe</th>
                <th className="px-3 py-3.5">Kota / Rute</th>
                <th className="px-3 py-3.5 text-center">Penumpang (Pax)</th>
                <th className="px-3 py-3.5 text-center">Rincian (D / A / B)</th>
                <th className="px-3 py-3.5 text-center">Bagasi (kg)</th>
                <th className="py-3.5 pl-3 pr-6 text-center">Load Factor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {stats.logs.length > 0 ? (
                stats.logs.map((row) => {
                  const isZero = (row.passenger_count || 0) === 0;
                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isZero ? "bg-red-50/20" : ""
                      }`}
                    >
                      <td className="whitespace-nowrap py-3 pl-6 pr-3 font-medium text-slate-900">
                        {row.date}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 font-semibold text-slate-800">
                        {row.airline}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                            row.flight_type === "arrival"
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                              : "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20"
                          }`}
                        >
                          {row.flight_type === "arrival" ? "Kedatangan" : "Keberangkatan"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 font-medium text-slate-900">
                        {row.city}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-center">
                        <span
                          className={`font-bold ${
                            isZero ? "text-rose-600" : "text-slate-900"
                          }`}
                        >
                          {row.passenger_count}
                        </span>
                        {isZero && (
                          <span className="ml-1 text-[10px] text-rose-500 font-semibold">
                            (Nihil)
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-center text-slate-500">
                        {row.pax_adult} / {row.pax_child} / {row.pax_infant}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-center font-medium text-slate-600">
                        {row.baggage_kg || 0}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-3 pr-6 text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            isZero
                              ? "bg-rose-50 text-rose-600 ring-1 ring-rose-200"
                              : Number(row.load_factor) >= 75
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {row.load_factor}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    Tidak ada data log penerbangan untuk bulan {monthDisplayTitle}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
