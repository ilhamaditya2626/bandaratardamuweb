import { db } from "@/db";
import {
  flights,
  passengerStats,
  ticketPrices,
  news,
  urgentInformation,
  informationRequests,
  publicDocuments,
  penginapan,
  feedbackSubmissions,
} from "@/db/schema";
import { getStats } from "@/services/passengers.service";
import { sql, desc, eq } from "drizzle-orm";
import Link from "next/link";
import {
  Plane,
  Users,
  TrendingUp,
  Tags,
  Newspaper,
  Siren,
  FileText,
  BedDouble,
  MessageSquareText,
  Calendar,
  ArrowRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Activity,
  Layers,
  Sparkles,
  PlaneTakeoff,
  PlaneLanding,
} from "lucide-react";
import StatsChart from "@/components/admin/StatsChart";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Query data dari seluruh tabel admin secara paralel
  const [
    stats,
    flightCountRes,
    recentFlightsRes,
    ticketPricesCountRes,
    newsCountRes,
    urgentInfoCountRes,
    ppidTotalRes,
    ppidPendingRes,
    documentsCountRes,
    penginapanCountRes,
    feedbackCountRes,
  ] = await Promise.all([
    getStats("monthly"),
    db.execute(sql`SELECT COUNT(*) as count FROM flights`),
    db
      .select()
      .from(flights)
      .orderBy(desc(flights.flight_date), desc(flights.scheduled_time))
      .limit(6),
    db.execute(sql`SELECT COUNT(*) as count FROM ticket_prices`),
    db.execute(sql`SELECT COUNT(*) as count FROM news`),
    db.execute(sql`SELECT COUNT(*) as count FROM urgent_information`),
    db.execute(sql`SELECT COUNT(*) as count FROM information_requests`),
    db.execute(
      sql`SELECT COUNT(*) as count FROM information_requests WHERE status = 'pending'`
    ),
    db.execute(sql`SELECT COUNT(*) as count FROM public_documents`),
    db.execute(sql`SELECT COUNT(*) as count FROM penginapan`),
    db.execute(sql`SELECT COUNT(*) as count FROM feedback_submissions`),
  ]);

  const totalFlights = Number((flightCountRes[0] as any)?.[0]?.count ?? 0);
  const totalTicketPrices = Number((ticketPricesCountRes[0] as any)?.[0]?.count ?? 0);
  const totalNews = Number((newsCountRes[0] as any)?.[0]?.count ?? 0);
  const totalUrgentInfo = Number((urgentInfoCountRes[0] as any)?.[0]?.count ?? 0);
  const totalPpid = Number((ppidTotalRes[0] as any)?.[0]?.count ?? 0);
  const pendingPpid = Number((ppidPendingRes[0] as any)?.[0]?.count ?? 0);
  const totalDocuments = Number((documentsCountRes[0] as any)?.[0]?.count ?? 0);
  const totalPenginapan = Number((penginapanCountRes[0] as any)?.[0]?.count ?? 0);
  const totalFeedback = Number((feedbackCountRes[0] as any)?.[0]?.count ?? 0);

  const chartData = stats.trendChart.labels.map((label: string, index: number) => ({
    name: label,
    kedatangan: stats.trendChart.arrivals[index] || 0,
    keberangkatan: stats.trendChart.departures[index] || 0,
  }));

  const todayFormatted = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Modul admin katalog untuk navigasi komprehensif
  const adminModules = [
    {
      title: "Jadwal Penerbangan",
      href: "/admin/flights",
      icon: Plane,
      count: `${totalFlights.toLocaleString("id-ID")} Penerbangan`,
      description: "Kelola data jadwal keberangkatan & kedatangan pesawat.",
      color: "bg-blue-500",
      lightColor: "bg-blue-50 text-blue-700 ring-blue-600/20",
    },
    {
      title: "Statistik Trafik",
      href: "/admin/stats",
      icon: TrendingUp,
      count: `${stats.kpiCards.totalPassengers.toLocaleString("id-ID")} Penumpang (Bln Ini)`,
      description: "Akumulasi bulanan, tren penumpang, dan load factor.",
      color: "bg-indigo-500",
      lightColor: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
    },
    {
      title: "Log Penumpang (DAU)",
      href: "/admin/passengers",
      icon: Users,
      count: `${stats.kpiCards.totalFlights} Catatan Rute`,
      description: "Input manifest harian perintis/reguler & sinkronisasi Telegram.",
      color: "bg-violet-500",
      lightColor: "bg-violet-50 text-violet-700 ring-violet-600/20",
    },
    {
      title: "Tarif & Harga Tiket",
      href: "/admin/ticket-prices",
      icon: Tags,
      count: `${totalTicketPrices} Rute Terdaftar`,
      description: "Kelola daftar harga tiket resmi maskapai Susi Air dsb.",
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    },
    {
      title: "Layanan PPID",
      href: "/admin/information-services",
      icon: FileText,
      count: pendingPpid > 0 ? `${pendingPpid} Perlu Respon` : `${totalPpid} Permohonan`,
      description: "Tindak lanjut permohonan informasi publik & keberatan.",
      color: "bg-amber-500",
      lightColor:
        pendingPpid > 0
          ? "bg-rose-50 text-rose-700 ring-rose-600/20"
          : "bg-amber-50 text-amber-700 ring-amber-600/20",
    },
    {
      title: "Dokumen Publik",
      href: "/admin/documents",
      icon: Layers,
      count: `${totalDocuments} Berkas Resmi`,
      description: "Upload dan kelola LAKIP, LHKPN, Laporan Keuangan, & DIP.",
      color: "bg-teal-500",
      lightColor: "bg-teal-50 text-teal-700 ring-teal-600/20",
    },
    {
      title: "Berita & Pengumuman",
      href: "/admin/news",
      icon: Newspaper,
      count: `${totalNews} Artikel Terbit`,
      description: "Publikasikan kabar terbaru seputar kegiatan bandar udara.",
      color: "bg-sky-500",
      lightColor: "bg-sky-50 text-sky-700 ring-sky-600/20",
    },
    {
      title: "Info Serta Merta",
      href: "/admin/urgent-information",
      icon: Siren,
      count: `${totalUrgentInfo} Pengumuman`,
      description: "Peringatan darurat, kendala cuaca, & informasi darurat publik.",
      color: "bg-rose-500",
      lightColor: "bg-rose-50 text-rose-700 ring-rose-600/20",
    },
    {
      title: "Akomodasi Penginapan",
      href: "/admin/penginapan",
      icon: BedDouble,
      count: `${totalPenginapan} Tempat Menginap`,
      description: "Kelola info hotel, homestay, & fasilitas di Sabu Raijua.",
      color: "bg-fuchsia-500",
      lightColor: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-600/20",
    },
    {
      title: "Kritik & Saran",
      href: "/admin/feedback",
      icon: MessageSquareText,
      count: `${totalFeedback} Aspirasi Masuk`,
      description: "Pantau masukan serta aspirasi masyarakat pengguna jasa.",
      color: "bg-slate-700",
      lightColor: "bg-slate-100 text-slate-700 ring-slate-600/20",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Executive Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 p-6 md:p-8 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Portal Manajemen Operasional Terpadu</span>
            </div>
            <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl lg:text-4xl font-display">
              Ringkasan Operasional Bandara
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              Pusat kendali dan monitoring terpadu seluruh modul administrasi UPBU Kelas III
              Tardamu Sabu Raijua.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm">
                <Calendar className="h-3.5 w-3.5 text-amber-400" />
                {todayFormatted}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-300 backdrop-blur-sm border border-emerald-500/30">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Operasional 07.00 - 15.00 WITA
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 sm:flex-nowrap">
            <Link
              href="/admin/flights"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-400 transition-all"
            >
              <Plane className="h-4 w-4" />
              <span>Jadwal Penerbangan</span>
            </Link>
            <Link
              href="/admin/stats"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-white/20 transition-all border border-white/10"
            >
              <TrendingUp className="h-4 w-4 text-amber-400" />
              <span>Statistik Detail</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Top 4 Core Highlight Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Penumpang Bulan Ini */}
        <Link
          href="/admin/stats"
          className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 hover:shadow-lg hover:ring-amber-500/40 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Penumpang Bulan Ini
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-transform group-hover:scale-110">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900">
              {stats.kpiCards.totalPassengers.toLocaleString("id-ID")}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <PlaneLanding className="h-3.5 w-3.5" />
                {stats.kpiCards.arrivalCount} Datang
              </span>
              <span className="flex items-center gap-1 text-amber-600 font-medium">
                <PlaneTakeoff className="h-3.5 w-3.5" />
                {stats.kpiCards.departureCount} Berangkat
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-semibold text-indigo-600 group-hover:text-indigo-700">
            <span>Buka Analisis Statistik</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </Link>

        {/* Total Jadwal Penerbangan */}
        <Link
          href="/admin/flights"
          className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 hover:shadow-lg hover:ring-blue-500/40 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Database Jadwal
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-110">
              <Plane className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900">
              {totalFlights.toLocaleString("id-ID")}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Jadwal penerbangan perintis &amp; reguler
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-semibold text-blue-600 group-hover:text-blue-700">
            <span>Kelola Jadwal Penerbangan</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </Link>

        {/* Permohonan PPID */}
        <Link
          href="/admin/information-services"
          className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 hover:shadow-lg hover:ring-amber-500/40 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Layanan PPID
            </span>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                pendingPpid > 0
                  ? "bg-rose-50 text-rose-600"
                  : "bg-amber-50 text-amber-600"
              } transition-transform group-hover:scale-110`}
            >
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900">
              {totalPpid.toLocaleString("id-ID")}
            </div>
            <div className="mt-2 text-xs font-medium">
              {pendingPpid > 0 ? (
                <span className="text-rose-600 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {pendingPpid} permohonan menunggu respon
                </span>
              ) : (
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Semua permohonan terselesaikan
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-semibold text-amber-600 group-hover:text-amber-700">
            <span>Tinjau Permohonan Informasi</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </Link>

        {/* Load Factor Capacity */}
        <Link
          href="/admin/stats"
          className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 hover:shadow-lg hover:ring-purple-500/40 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Rata-rata Load Factor
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-transform group-hover:scale-110">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-purple-600">
              {stats.kpiCards.avgLoadFactor}%
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-purple-600 transition-all"
                style={{ width: `${Math.min(100, stats.kpiCards.avgLoadFactor)}%` }}
              ></div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-semibold text-purple-600 group-hover:text-purple-700">
            <span>Efisiensi Kapasitas Armada</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </Link>
      </div>

      {/* Main 2-Column: Live Flight Operations & Quick Stats */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Cols: Flight Operations & Traffic Trend */}
        <div className="lg:col-span-2 space-y-8">
          {/* Live Flight Schedule Preview */}
          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4 bg-slate-50/50">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Plane className="h-4 w-4 text-amber-500" />
                  Jadwal Penerbangan Terjadwal Terbaru
                </h2>
                <p className="text-xs text-slate-500">
                  Data penerbangan aktif terkini yang melayani rute Bandara Tardamu Sabu
                </p>
              </div>
              <Link
                href="/admin/flights"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700"
              >
                <span>Lihat Seluruh Jadwal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50 font-semibold text-slate-600">
                  <tr>
                    <th className="py-3 pl-6 pr-3">No. Penerbangan</th>
                    <th className="px-3 py-3">Maskapai</th>
                    <th className="px-3 py-3">Rute</th>
                    <th className="px-3 py-3">Tipe</th>
                    <th className="px-3 py-3">Jadwal</th>
                    <th className="py-3 pl-3 pr-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {recentFlightsRes.length > 0 ? (
                    recentFlightsRes.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="whitespace-nowrap py-3 pl-6 pr-3 font-mono font-bold text-slate-900">
                          {f.flight_no}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 font-semibold text-slate-800">
                          {f.airline}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-slate-700 font-medium">
                          {f.type === "arrival"
                            ? `${f.origin || "-"} → Sabu (SAU)`
                            : `Sabu (SAU) → ${f.destination || "-"}`}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                              f.type === "arrival"
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                                : "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20"
                            }`}
                          >
                            {f.type === "arrival" ? "Kedatangan" : "Keberangkatan"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-slate-600 font-mono">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-400" />
                            <span>{f.scheduled_time} WITA</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap py-3 pl-3 pr-6 text-center">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                              f.status === "ontime"
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                                : f.status === "delayed"
                                ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                                : "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
                            }`}
                          >
                            {f.status_label || f.status || "Ontime"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Belum ada jadwal penerbangan di database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Traffic Trend Chart Preview */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Grafik Tren Trafik Penumpang Bulan Ini
                </h2>
                <p className="text-xs text-slate-500">
                  Pergerakan mingguan kedatangan dan keberangkatan penumpang
                </p>
              </div>
              <Link
                href="/admin/stats"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700"
              >
                <span>Lihat Laporan Lengkap</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <StatsChart data={chartData} />
          </div>
        </div>

        {/* Right 1 Col: Quick Status of Public & Admin Content */}
        <div className="space-y-6">
          {/* Layanan Publik & Transparansi Card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Layers className="h-4 w-4 text-amber-500" />
              Transparansi &amp; Layanan Publik
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Status pengajuan permohonan informasi &amp; publikasi resmi
            </p>

            <div className="space-y-3.5">
              <Link
                href="/admin/information-services"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-amber-50/50 transition-colors border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Permohonan PPID</h3>
                    <p className="text-[11px] text-slate-500">
                      {pendingPpid > 0
                        ? `${pendingPpid} permohonan pending`
                        : "Seluruh tiket terjawab"}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  {totalPpid} total
                </span>
              </Link>

              <Link
                href="/admin/documents"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-teal-50/50 transition-colors border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Dokumen Publik</h3>
                    <p className="text-[11px] text-slate-500">LAKIP, LHKPN, Laporan Tahunan</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  {totalDocuments} file
                </span>
              </Link>

              <Link
                href="/admin/news"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-sky-50/50 transition-colors border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                    <Newspaper className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Berita &amp; Rilis</h3>
                    <p className="text-[11px] text-slate-500">Artikel pengumuman resmi</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  {totalNews} artikel
                </span>
              </Link>

              <Link
                href="/admin/urgent-information"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-rose-50/50 transition-colors border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
                    <Siren className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Info Serta Merta</h3>
                    <p className="text-[11px] text-slate-500">Banner peringatan darurat</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  {totalUrgentInfo} aktif
                </span>
              </Link>
            </div>
          </div>

          {/* Fasilitas, Mitra & Umpan Balik */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-fuchsia-500" />
              Mitra Wisata &amp; Aspirasi
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Akomodasi penginapan daerah &amp; masukan masyarakat
            </p>

            <div className="space-y-3.5">
              <Link
                href="/admin/penginapan"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-fuchsia-50/50 transition-colors border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-fuchsia-100 text-fuchsia-700">
                    <BedDouble className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Akomodasi / Hotel</h3>
                    <p className="text-[11px] text-slate-500">Katalog penginapan Sabu</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  {totalPenginapan} mitra
                </span>
              </Link>

              <Link
                href="/admin/feedback"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-200 text-slate-800">
                    <MessageSquareText className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Kritik &amp; Saran</h3>
                    <p className="text-[11px] text-slate-500">Umpan balik masyarakat</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  {totalFeedback} pesan
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Module Directory Grid (All Admin Pages) */}
      <div className="pt-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 font-display">
              Direktori Seluruh Modul Administrasi
            </h2>
            <p className="text-xs text-slate-500">
              Akses cepat dan ringkasan data dari seluruh halaman operasional di portal admin
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            10 Modul Terhubung
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {adminModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className="group relative flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:ring-amber-500/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${mod.color} text-white shadow-sm transition-transform group-hover:scale-105`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${mod.lightColor}`}
                    >
                      {mod.count}
                    </span>
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 line-clamp-2">
                    {mod.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-semibold text-slate-600 group-hover:text-amber-600 transition-colors">
                  <span>Kelola Modul</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
