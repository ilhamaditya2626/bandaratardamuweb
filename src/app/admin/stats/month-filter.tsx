"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, ChevronDown } from "lucide-react";

interface MonthOption {
  yearMonth: string;
  label: string;
  count: number;
}

interface MonthFilterProps {
  availableMonths: MonthOption[];
  selectedMonth: string;
}

export default function MonthFilter({ availableMonths, selectedMonth }: MonthFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("month", value);
    } else {
      params.delete("month");
    }
    router.push(`/admin/stats?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative inline-flex items-center">
        <Calendar className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className="appearance-none pl-10 pr-10 py-2 text-sm font-semibold bg-white border border-slate-300 rounded-lg shadow-sm text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors cursor-pointer"
        >
          {availableMonths.map((m) => (
            <option key={m.yearMonth} value={m.yearMonth}>
              {m.label} ({m.count} rute)
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}
