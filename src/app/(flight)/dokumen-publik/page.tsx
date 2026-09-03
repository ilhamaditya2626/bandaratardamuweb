"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageHero, serifStyle } from "../_components/info-page-shell";

const categories = [
  { key: "", label: "Semua Dokumen" },
  { key: "annual_report", label: "Laporan Tahunan" },
  { key: "work_budget", label: "Rencana Kerja Anggaran" },
  { key: "financial_report", label: "Laporan Keuangan" },
  { key: "lakip", label: "LAKIP" },
  { key: "dip", label: "DIP" },
  { key: "dik", label: "DIK" },
];

const categoryLabels: Record<string, string> = {
  annual_report: "Laporan Tahunan",
  work_budget: "Rencana Kerja Anggaran",
  financial_report: "Laporan Keuangan",
  lakip: "LAKIP",
  dip: "DIP",
  dik: "DIK",
};

interface PublicDoc {
  id: number;
  category: string;
  title: string;
  description?: string | null;
  document_date?: string | null;
  file_url: string;
  total_pages?: number;
  created_at?: string;
}

function DokumenPublikContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [docs, setDocs] = useState<PublicDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cat = searchParams.get("category") || "";
    setActiveCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const query = activeCategory ? `?category=${encodeURIComponent(activeCategory)}` : "";
    fetch(`/api/documents${query}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat dokumen");
        return res.json();
      })
      .then((data) => {
        setDocs(Array.isArray(data.data) ? data.data : []);
      })
      .catch((err) => {
        console.error("Fetch docs error:", err);
        setDocs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeCategory]);

  return (
    <div className="bg-[#111928] text-gray-200">
      <PageHero
        backgroundImage="/assets/images/Terminal.webp"
        gradient="linear-gradient(to bottom, rgba(17, 25, 40, 0.75), rgba(17, 25, 40, 0.98))"
        breadcrumbs={[
          { href: "/", label: "Beranda" },
          { href: "/informasi-berkala#laporan", label: "Informasi Publik" },
          { label: "Arsip Dokumen Publik" },
        ]}
        title={
          <>
            Arsip Dokumen <span className="italic text-[#facc15]">Publik</span>
          </>
        }
        description="Akses transparansi dokumen resmi, laporan berkala, keuangan, dan keterbukaan informasi publik Kantor UPBU Tardamu Sabu Raijua."
      />

      <main className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        {/* Category Filters */}
        <div className="mb-12 flex flex-wrap items-center gap-2 border-b border-white/10 pb-6">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] transition-all duration-300 ${
                  isActive
                    ? "bg-[#facc15] text-[#111928] shadow-[0_4px_20px_rgba(250,204,21,0.25)] scale-105"
                    : "border border-white/10 bg-white/[0.03] text-gray-300 hover:border-[#facc15]/60 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Header summary */}
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl text-white md:text-3xl" style={serifStyle}>
              {activeCategory
                ? `Dokumen: ${categoryLabels[activeCategory] || activeCategory}`
                : "Seluruh Dokumen Publik"}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Menampilkan {docs.length} dokumen yang dipublikasikan secara resmi oleh PPID.
            </p>
          </div>
          <Link
            href="/layanan-informasi#formulir"
            className="inline-flex items-center gap-2 self-start rounded-full border border-[#facc15]/40 bg-[#facc15]/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#facc15] transition hover:bg-[#facc15] hover:text-[#111928] sm:self-auto"
          >
            <i className="fa-solid fa-file-pen" /> Ajukan Dokumen Lainnya
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-[32px] border border-white/5 bg-[#1f2937]/30 py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#facc15]/10 text-3xl text-[#facc15]">
              <i className="fa-solid fa-circle-notch fa-spin" />
            </div>
            <p className="mt-5 text-base font-semibold text-white">Memuat dokumen publik...</p>
            <p className="mt-1 text-xs text-gray-400">Mengambil data arsip resmi dari server</p>
          </div>
        ) : docs.length > 0 ? (
          /* Documents Grid */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {docs.map((doc) => (
              <article
                key={doc.id}
                className="group flex flex-col justify-between rounded-[28px] border border-white/5 bg-[#1f2937]/70 p-7 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#facc15]/70 hover:bg-[#1f2937]"
              >
                <div>
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-xl text-red-400 transition-transform duration-300 group-hover:scale-110">
                      <i className="fa-solid fa-file-pdf" />
                    </span>
                    <span className="rounded-full bg-[#facc15]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#facc15]">
                      {categoryLabels[doc.category] || doc.category}
                    </span>
                  </div>

                  <h3
                    className="text-xl font-bold leading-snug text-white transition-colors group-hover:text-[#facc15]"
                    style={serifStyle}
                  >
                    {doc.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-400">
                    {doc.description || "Dokumen keterbukaan informasi publik Kantor UPBU Tardamu Sabu Raijua."}
                  </p>
                </div>

                <div className="mt-8 border-t border-white/5 pt-5">
                  <div className="mb-4 flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <i className="fa-regular fa-file-lines text-[#facc15]" />
                      {doc.total_pages ? `${doc.total_pages} Halaman` : "PDF"}
                    </span>
                    {doc.document_date && (
                      <span className="flex items-center gap-1.5">
                        <i className="fa-regular fa-calendar" />
                        {doc.document_date}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/dokumen-publik/${doc.id}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/[0.04] py-3 text-xs font-bold uppercase tracking-wider text-white transition-all group-hover:bg-[#facc15] group-hover:text-[#111928]"
                  >
                    <span>Lihat Pratinjau</span>
                    <i className="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-[36px] border border-white/5 bg-[#1f2937]/40 p-12 text-center md:p-20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#facc15]/10 text-4xl text-[#facc15] mb-6">
              <i className="fa-solid fa-folder-open" />
            </div>
            <h3 className="text-2xl font-bold text-white md:text-3xl" style={serifStyle}>
              Belum Ada Dokumen yang Dipublikasikan
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-gray-400">
              {activeCategory
                ? `Dokumen untuk kategori "${categoryLabels[activeCategory] || activeCategory}" belum diunggah atau sedang dalam proses digitalisasi oleh PPID.`
                : "Arsip dokumen publik sedang dalam proses pembaruan oleh petugas PPID."}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {activeCategory && (
                <button
                  type="button"
                  onClick={() => setActiveCategory("")}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:border-[#facc15] hover:text-[#facc15]"
                >
                  <i className="fa-solid fa-list" /> Lihat Semua Kategori
                </button>
              )}
              <Link
                href="/layanan-informasi#formulir"
                className="inline-flex items-center gap-2 rounded-full bg-[#facc15] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#111928] shadow-[0_4px_20px_rgba(250,204,21,0.25)] transition hover:scale-105"
              >
                <i className="fa-solid fa-paper-plane" /> Ajukan Permohonan Dokumen
              </Link>
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-14 border-t border-white/5 pt-8">
          <Link
            href="/informasi-berkala#laporan"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition hover:text-[#facc15]"
          >
            <i className="fa-solid fa-arrow-left text-xs" /> Kembali ke Laporan Informasi Publik
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function PublicDocumentsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#111928] flex items-center justify-center text-gray-400">
          <i className="fa-solid fa-circle-notch fa-spin text-3xl text-[#facc15]" />
        </div>
      }
    >
      <DokumenPublikContent />
    </Suspense>
  );
}
