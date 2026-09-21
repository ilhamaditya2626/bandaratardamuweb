"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface StatsChartProps {
  data: Array<{
    name: string;
    kedatangan: number;
    keberangkatan: number;
    loadFactor?: number;
  }>;
}

export default function StatsChart({ data }: StatsChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
            tick={{ fill: "#64748b", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
            tick={{ fill: "#64748b", fontSize: 12 }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              borderRadius: "10px",
              border: "none",
              color: "#fff",
              fontSize: "12px",
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value: any, name: any) => [
              `${Number(value || 0).toLocaleString("id-ID")} Penumpang`,
              name === "kedatangan" ? "Kedatangan" : "Keberangkatan",
            ]}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ paddingBottom: "12px", fontSize: "12px" }}
            formatter={(val) => (val === "kedatangan" ? "Kedatangan" : "Keberangkatan")}
          />
          <Bar
            dataKey="kedatangan"
            fill="#10b981"
            name="kedatangan"
            radius={[6, 6, 0, 0]}
            maxBarSize={45}
          />
          <Bar
            dataKey="keberangkatan"
            fill="#f59e0b"
            name="keberangkatan"
            radius={[6, 6, 0, 0]}
            maxBarSize={45}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
