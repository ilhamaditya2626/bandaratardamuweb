import { getStats } from "@/services/passengers.service";
import { Users, PlaneTakeoff, PlaneLanding, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const stats = await getStats("monthly");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        Dashboard
      </h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { name: 'Total Penumpang', stat: stats.kpiCards.totalPassengers, icon: Users, color: 'bg-blue-500' },
          { name: 'Kedatangan', stat: stats.kpiCards.arrivalCount, icon: PlaneLanding, color: 'bg-green-500' },
          { name: 'Keberangkatan', stat: stats.kpiCards.departureCount, icon: PlaneTakeoff, color: 'bg-yellow-500' },
          { name: 'Load Factor Avg', stat: '82%', icon: TrendingUp, color: 'bg-indigo-500' },
        ].map((item) => (
          <div key={item.name} className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
            <dt>
              <div className={`absolute rounded-md ${item.color} p-3`}>
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
            </dd>
          </div>
        ))}
      </div>

      {/* Chart mock / List */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Statistik Penumpang {stats.meta.range}</h3>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-md">
            <p className="text-gray-500">API Data Ready: {stats.trendChart.labels.length} titik data tersedia.</p>
        </div>
      </div>
    </div>
  );
}
