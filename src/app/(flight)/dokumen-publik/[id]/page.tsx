"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { PageHero, serifStyle } from "../../_components/info-page-shell";

const categoryLabels: Record<string, string> = {
  annual_report: "Laporan Tahunan",
  work_budget: "Rencana Kerja Anggaran",
  financial_report: "Laporan Keuangan",
  lakip: "LAKIP",
  dip: "DIP",
  dik: "DIK",
};

interface DocumentDetail {
  id: number;
  title: string;
  category: string;
  description?: string | null;
  document_date?: string | null;
  total_pages?: number;
  file_url: string;
  file_name: string;
  created_at: string;
}

export default function DocumentPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [doc, setDoc] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!resolvedParams?.id) return;
    setLoading(true);
    fetch(`/api/documents/${resolvedParams.id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Dokumen tidak ditemukan atau gagal dimuat.");
        return r.json();
      })
      .then((x) => {
        if (x.data) {
          setDoc(x.data);
        } else {
          setError(x.error || "Dokumen tidak ditemukan.");
        }
      })
      .catch((err) => {
        console.error("Fetch document error:", err);
        setError("Gagal memuat dokumen dari server.");
      })
      .finally(() => setLoading(false));
  }, [resolvedParams?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111928] text-gray-200">
        <PageHero
          backgroundImage="/assets/images/Terminal.webp"
          gradient="linear-gradient(to bottom, rgba(17, 25, 40, 0.75), rgba(17, 25, 40, 0.98))"
          breadcrumbs={[
            { href: "/", label: "Beranda" },
            { href: "/dokumen-publik", label: "Dokumen Publik" },
            { label: "Memuat Dokumen..." },
          ]}
          title={<>Pratinjau <span className="italic text-[#facc15]">Dokumen</span></>}
          description="Memuat berkas dokumen publik..."
        />
        <main className="mx-auto max-w-5xl px-6 py-24 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#facc15]/10 text-3xl text-[#facc15] mb-4">
            <i className="fa-solid fa-circle-notch fa-spin" />
          </div>
          <p className="text-gray-400">Sedang memuat berkas dan pratinjau dokumen...</p>
        </main>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="min-h-screen bg-[#111928] text-gray-200">
        <PageHero
          backgroundImage="/assets/images/Terminal.webp"
          gradient="linear-gradient(to bottom, rgba(17, 25, 40, 0.75), rgba(17, 25, 40, 0.98))"
          breadcrumbs={[
            { href: "/", label: "Beranda" },
            { href: "/dokumen-publik", label: "Dokumen Publik" },
            { label: "Tidak Ditemukan" },
          ]}
          title={<>Dokumen <span className="italic text-[#facc15]">Tidak Ditemukan</span></>}
          description="Dokumen yang Anda cari tidak tersedia atau telah diarsipkan."
        />
        <main className="mx-auto max-w-3xl px-6 py-20 text-center">
          <div className="rounded-[32px] border border-white/10 bg-[#1f2937] p-12 shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-3xl text-rose-400 mb-5">
              <i className="fa-solid fa-triangle-exclamation" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2" style={serifStyle}>
              Dokumen Tidak Tersedia
            </h2>
            <p className="text-sm text-gray-400 max-w-md mx-auto mb-8">
              {error || "Berkas dokumen tidak ditemukan di server atau telah dihapus."}
            </p>
            <Link
              href="/dokumen-publik"
              className="inline-flex items-center gap-2 rounded-full bg-[#facc15] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#111928] transition hover:scale-105"
            >
              <i className="fa-solid fa-arrow-left" /> Kembali ke Arsip Dokumen
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const categoryName = categoryLabels[doc.category] || doc.category;
  const pages = Math.max(1, Math.ceil((doc.total_pages || 1) * 0.2));

  return (
    <div className="bg-[#111928] text-gray-200">
      <PageHero
        backgroundImage="/assets/images/Terminal.webp"
        gradient="linear-gradient(to bottom, rgba(17, 25, 40, 0.75), rgba(17, 25, 40, 0.98))"
        breadcrumbs={[
          { href: "/", label: "Beranda" },
          { href: "/dokumen-publik", label: "Dokumen Publik" },
          { label: doc.title },
        ]}
        title={
          <>
            Pratinjau <span className="italic text-[#facc15]">Dokumen</span>
          </>
        }
        description={`Keterbukaan informasi publik: ${doc.title} (${categoryName}).`}
      />

      <main className="mx-auto max-w-6xl px-6 py-16 md:py-24 space-y-12">
        {/* Top Info Cards */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Main Info */}
          <article className="overflow-hidden rounded-[32px] border border-white/5 bg-[#1f2937] shadow-xl">
            <div className="border-b border-white/5 bg-white/[0.025] p-8">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-2xl text-red-400">
                  <i className="fa-solid fa-file-pdf" />
                </span>
                <span className="rounded-full bg-[#facc15]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#facc15]">
                  {categoryName}
                </span>
                {doc.document_date && (
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-400">
                    <i className="fa-regular fa-calendar mr-1.5" />
                    {doc.document_date}
                  </span>
                )}
              </div>

              <h1 className="text-2xl leading-snug text-white md:text-3xl font-bold" style={serifStyle}>
                {doc.title}
              </h1>

              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                {doc.description ||
                  "Dokumen keterbukaan informasi publik yang dipublikasikan secara berkala oleh PPID Kantor UPBU Tardamu Sabu Raijua."}
              </p>
            </div>

            <div className="p-8 space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#facc15]">
                Informasi Dokumen
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <span className="text-xs text-gray-400 block mb-1">Total Halaman Asli</span>
                  <span className="text-lg font-bold text-white">
                    {doc.total_pages ? `${doc.total_pages} Halaman` : "-"}
                  </span>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <span className="text-xs text-gray-400 block mb-1">Pratinjau Ditampilkan</span>
                  <span className="text-lg font-bold text-[#facc15]">
                    {pages} Halaman Pertama
                  </span>
                </div>
              </div>
            </div>
          </article>

          {/* Request Full Document Aside */}
          <aside className="flex flex-col justify-between rounded-[32px] border border-[#facc15]/25 bg-[#facc15]/[0.06] p-8 shadow-xl">
            <div>
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#facc15] text-xl text-[#111928] shadow-[0_4px_20px_rgba(250,204,21,0.3)]">
                <i className="fa-solid fa-file-invoice" />
              </span>
              <h2 className="mt-6 text-2xl text-white font-bold" style={serifStyle}>
                Salinan Lengkap Dokumen
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-300">
                Sesuai standar operasional pelayanan informasi, pratinjau digital menampilkan 20% halaman awal. Untuk memperoleh salinan lengkap atau dokumen fisik, silakan ajukan permohonan melalui formulir elektronik PPID.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <Link
                href="/layanan-informasi#formulir"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#facc15] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#111928] shadow-[0_4px_20px_rgba(250,204,21,0.25)] transition hover:scale-[1.02]"
              >
                <i className="fa-solid fa-paper-plane" />
                Ajukan Permohonan Dokumen
              </Link>
              <Link
                href="/layanan-informasi#prosedur"
                className="inline-flex w-full items-center justify-center gap-2 text-xs font-semibold text-[#facc15] hover:underline pt-2"
              >
                Lihat Alur & Prosedur Layanan <i className="fa-solid fa-arrow-right text-[10px]" />
              </Link>
            </div>
          </aside>
        </div>

        {/* PDF Viewer Container */}
        <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[#1f2937] shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 bg-white/[0.025] px-8 py-5">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400 text-sm">
                <i className="fa-solid fa-eye" />
              </span>
              <span className="text-sm font-semibold text-white">
                Pratinjau Dokumen ({pages} halaman)
              </span>
            </div>
            <span className="text-xs text-gray-400">
              Gunakan kontrol navigasi PDF di dalam jendela viewer
            </span>
          </div>

          <div className="bg-white p-2">
            <iframe
              title={doc.title}
              src={`${doc.file_url}#page=1&toolbar=0`}
              className="h-[760px] w-full rounded-2xl border border-gray-200"
            />
          </div>
        </section>

        {/* Bottom Navigation */}
        <div className="flex justify-start pt-6 border-t border-white/5">
          <Link
            href="/dokumen-publik"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition hover:text-[#facc15]"
          >
            <i className="fa-solid fa-arrow-left text-xs" /> Kembali ke Arsip Dokumen Publik
          </Link>
        </div>
      </main>
    </div>
  );
}
