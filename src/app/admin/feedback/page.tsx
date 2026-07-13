"use client";

import { Inbox, MessageSquareText, RefreshCw, Sparkles, UserRound } from "lucide-react";
import { useMemo } from "react";
import { useGetFeedback } from "@/hooks/useFeedback";

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const shortMonthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

function parseLocalTimestamp(value: string) {
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?/,
  );

  if (!match) {
    return null;
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: match[4],
    minute: match[5],
  };
}

function formatFeedbackDate(value: string) {
  const date = parseLocalTimestamp(value);
  if (!date) {
    return value;
  }

  return `${String(date.day).padStart(2, "0")} ${monthNames[date.month - 1]} ${date.year} pukul ${date.hour}.${date.minute}`;
}

function formatFeedbackShortDate(value: string) {
  const date = parseLocalTimestamp(value);
  if (!date) {
    return "-";
  }

  return `${String(date.day).padStart(2, "0")} ${shortMonthNames[date.month - 1]}`;
}

export default function FeedbackAdminPage() {
  const page = 1;
  const limit = 100;
  const { data: response, isLoading, isFetching, refetch } = useGetFeedback(page, limit);
  const feedback = response?.data || [];

  const latestFeedback = feedback[0];
  const total = response?.pagination.total || feedback.length;

  const summary = useMemo(
    () => [
      {
        label: "Total Aspirasi",
        value: total,
        helper: "Semua kritik dan saran yang masuk",
        icon: MessageSquareText,
        accent: "bg-sky-500",
      },
      {
        label: "Masuk Terbaru",
        value: latestFeedback ? formatFeedbackShortDate(latestFeedback.created_at) : "-",
        helper: latestFeedback ? latestFeedback.name : "Belum ada aspirasi",
        icon: Sparkles,
        accent: "bg-amber-500",
      },
    ],
    [latestFeedback, total],
  );

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-2xl bg-slate-950 text-white shadow-xl">
        <div className="relative px-6 py-8 sm:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.28),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.18),transparent_30%)]"></div>
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">
                <Inbox className="h-4 w-4" />
                Aspirasi Publik
              </span>
              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Kritik dan Saran
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Pantau masukan masyarakat dari halaman bantuan untuk evaluasi layanan
                Bandara Tardamu.
              </p>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {summary.map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-950">{item.value}</p>
                <p className="mt-2 text-sm text-slate-500">{item.helper}</p>
              </div>
              <div className={`rounded-2xl ${item.accent} p-3 text-white shadow-lg`}>
                <item.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h3 className="text-lg font-bold text-slate-950">Daftar Aspirasi Masuk</h3>
          <p className="mt-1 text-sm text-slate-500">
            Data ditampilkan dari endpoint API admin kritik dan saran.
          </p>
        </div>

        {isLoading ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">Memuat aspirasi...</div>
        ) : feedback.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Inbox className="h-8 w-8" />
            </div>
            <p className="mt-4 font-semibold text-slate-900">Belum ada kritik dan saran.</p>
            <p className="mt-1 text-sm text-slate-500">
              Aspirasi yang dikirim dari halaman bantuan akan muncul di sini.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {feedback.map((item) => (
              <article key={item.id} className="px-6 py-5 transition hover:bg-slate-50">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                      <UserRound className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="font-semibold text-slate-950">{item.name}</h4>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                          {item.status === "new" ? "Baru" : item.status}
                        </span>
                      </div>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                        {item.message}
                      </p>
                    </div>
                  </div>
                  <time className="shrink-0 text-sm font-medium text-slate-400">
                    {formatFeedbackDate(item.created_at)}
                  </time>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
