"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Doc = {
  id: number;
  title: string;
  file_url: string;
  document_date: string | null;
  total_pages: number;
  category: string;
};

const annualSubcategories = [
  { key: "ppid", label: "PPID", color: "from-amber-500/20 to-yellow-500/10", accent: "#facc15" },
  { key: "laporan_tahunan", label: "Laporan Tahunan", color: "from-violet-500/20 to-purple-500/10", accent: "#a78bfa" },
];

function DocLink({ d }: { d: Doc }) {
  return (
    <Link
      key={d.id}
      href={`/dokumen-publik/${d.id}`}
      className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[.03] p-4 text-sm text-gray-300 transition hover:border-[#facc15]/70 hover:bg-[#facc15]/10 hover:text-white"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
        <i className="fa-solid fa-file-pdf" />
      </span>
      <span className="min-w-0 flex-1 leading-6">{d.title}</span>
      <i className="fa-solid fa-eye text-xs text-gray-500 group-hover:text-[#facc15]" />
    </Link>
  );
}

function AnnualReportTabs() {
  const [activeSub, setActiveSub] = useState(annualSubcategories[0].key);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/documents?category=annual_report&subcategory=${activeSub}&latest=true`)
      .then((r) => r.json())
      .then((x) => setDocs(x.data || []))
      .catch(() => setDocs([]))
      .finally(() => setLoading(false));
  }, [activeSub]);

  const currentSub = annualSubcategories.find((s) => s.key === activeSub)!;

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-1.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-1.5">
        {annualSubcategories.map((sub) => {
          const isActive = activeSub === sub.key;
          return (
            <button
              key={sub.key}
              type="button"
              onClick={() => setActiveSub(sub.key)}
              className={`
                relative flex items-center justify-center rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300
                ${isActive
                  ? "bg-gradient-to-r text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
                }
              `}
              style={isActive ? {
                backgroundImage: `linear-gradient(135deg, ${sub.accent}22, ${sub.accent}11)`,
                boxShadow: `0 4px 20px ${sub.accent}15`,
              } : undefined}
            >
              <span>{sub.label}</span>
              {isActive && (
                <span
                  className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full"
                  style={{ backgroundColor: sub.accent }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Document list */}
      <div className="min-h-[72px]">
        {loading ? (
          <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[.02] p-4 text-sm text-gray-400">
            <i className="fa-solid fa-circle-notch fa-spin" style={{ color: currentSub.accent }} />
            <span>Memuat dokumen...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {docs.map((d) => (
              <DocLink key={d.id} d={d} />
            ))}
            {!docs.length && (
              <p className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-gray-500">
                Belum ada dokumen {currentSub.label} yang dipublikasikan.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Link to see all */}
      <Link
        href={`/dokumen-publik?category=annual_report&subcategory=${activeSub}`}
        className="mt-2 inline-flex items-center gap-2 text-sm font-bold hover:text-white transition"
        style={{ color: currentSub.accent }}
      >
        Lihat dokumen {currentSub.label} lainnya{" "}
        <i className="fa-solid fa-arrow-right text-xs" />
      </Link>
    </div>
  );
}

export function DocumentCards({ category }: { category: string }) {
  const [docs, setDocs] = useState<Doc[]>([]);

  useEffect(() => {
    if (category === "annual_report") return; // handled by AnnualReportTabs
    fetch(`/api/documents?category=${category}&latest=true`)
      .then((r) => r.json())
      .then((x) => setDocs(x.data || []))
      .catch(() => {});
  }, [category]);

  // For annual_report, render the tabbed subcategory view
  if (category === "annual_report") {
    return <AnnualReportTabs />;
  }

  return (
    <>
      <div className="space-y-3">
        {docs.map((d) => (
          <DocLink key={d.id} d={d} />
        ))}
        {!docs.length && (
          <p className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-gray-500">
            Belum ada dokumen yang dipublikasikan.
          </p>
        )}
      </div>
      <Link
        href={`/dokumen-publik?category=${category}`}
        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#facc15] hover:text-white"
      >
        Lihat dokumen lainnya <i className="fa-solid fa-arrow-right text-xs" />
      </Link>
    </>
  );
}
