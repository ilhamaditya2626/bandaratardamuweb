import { getStats } from "@/services/passengers.service";
import { Users, PlaneTakeoff, PlaneLanding, TrendingUp } from "lucide-react";
import StatsChart from "@/components/admin/StatsChart";

export default async function AdminStatsPage() {
  const stats = await getStats("monthly");
  
  const chartData = stats.trendChart.labels.map((label: string, index: number) => ({
    name: label,
    kedatangan: stats.trendChart.arrivals[index],
    keberangkatan: stats.trendChart.departures[index],
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight font-display">
        Statistik Penerbangan dan Penumpang
      </h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { name: 'Total Penumpang', stat: stats.kpiCards.totalPassengers, icon: Users, color: 'bg-indigo-600' },
          { name: 'Kedatangan', stat: stats.kpiCards.arrivalCount, icon: PlaneLanding, color: 'bg-emerald-600' },
          { name: 'Keberangkatan', stat: stats.kpiCards.departureCount, icon: PlaneTakeoff, color: 'bg-amber-600' },
          { name: 'Load Factor Avg', stat: '82%', icon: TrendingUp, color: 'bg-sky-600' },
        ].map((item) => (
          <div key={item.name} className="relative overflow-hidden rounded-xl bg-white px-4 pb-12 pt-5 shadow-sm ring-1 ring-slate-200 sm:px-6 sm:pt-6 hover:shadow-md transition-shadow">
            <dt>
              <div className={`absolute rounded-lg ${item.color} p-3 shadow-lg ring-4 ring-white`}>
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-slate-500 uppercase tracking-wider">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-bold text-slate-900">{item.stat.toLocaleString('id-ID')}</p>
            </dd>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white shadow-sm ring-1 ring-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold leading-6 text-slate-900">
            Trend Penumpang <span className="text-slate-400 font-normal">({stats.meta.range})</span>
          </h3>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Kedatangan</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Keberangkatan</span>
          </div>
        </div>
        <StatsChart data={chartData} />
      </div>
    </div>
  );
}
