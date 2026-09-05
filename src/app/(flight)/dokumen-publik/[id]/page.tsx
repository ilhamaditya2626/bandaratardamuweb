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
  const [isMobile, setIsMobile] = useState(false);
  const [showIframeOnMobile, setShowIframeOnMobile] = useState(false);
  const [fileExists, setFileExists] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = typeof window !== "undefined" ? window.navigator.userAgent : "";
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobile(mobileRegex.test(userAgent) || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
          // Verify the file actually exists by making a HEAD request
          fetch(x.data.file_url, { method: "HEAD" })
            .then((res) => setFileExists(res.ok))
            .catch(() => setFileExists(false));
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
  const showInlinePdf = !isMobile || showIframeOnMobile;

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

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-24 space-y-8 md:space-y-12">
        {/* Top Info Cards */}
        <div className="grid gap-6 md:gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Main Info */}
          <article className="overflow-hidden rounded-[24px] md:rounded-[32px] border border-white/5 bg-[#1f2937] shadow-xl">
            <div className="border-b border-white/5 bg-white/[0.025] p-5 sm:p-8">
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

              <h1 className="text-xl sm:text-2xl leading-snug text-white md:text-3xl font-bold" style={serifStyle}>
                {doc.title}
              </h1>

              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                {doc.description ||
                  "Dokumen keterbukaan informasi publik yang dipublikasikan secara berkala oleh PPID Kantor UPBU Tardamu Sabu Raijua."}
              </p>
            </div>

            <div className="p-5 sm:p-8 space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#facc15]">
                Informasi Dokumen
              </p>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3 sm:p-4">
                  <span className="text-xs text-gray-400 block mb-1">Total Halaman Asli</span>
                  <span className="text-base sm:text-lg font-bold text-white">
                    {doc.total_pages ? `${doc.total_pages} Halaman` : "-"}
                  </span>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3 sm:p-4">
                  <span className="text-xs text-gray-400 block mb-1">Pratinjau Ditampilkan</span>
                  <span className="text-base sm:text-lg font-bold text-[#facc15]">
                    {pages} Halaman Pertama
                  </span>
                </div>
              </div>
            </div>
          </article>

          {/* Request Full Document Aside */}
          <aside className="flex flex-col justify-between rounded-[24px] md:rounded-[32px] border border-[#facc15]/25 bg-[#facc15]/[0.06] p-6 sm:p-8 shadow-xl">
            <div>
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#facc15] text-xl text-[#111928] shadow-[0_4px_20px_rgba(250,204,21,0.3)]">
                <i className="fa-solid fa-file-invoice" />
              </span>
              <h2 className="mt-6 text-xl sm:text-2xl text-white font-bold" style={serifStyle}>
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
        <section className="overflow-hidden rounded-[24px] md:rounded-[32px] border border-white/10 bg-[#1f2937] shadow-2xl">
          {/* Header Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between border-b border-white/5 bg-white/[0.025] px-5 sm:px-8 py-4 sm:py-5">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400 text-sm">
                <i className="fa-solid fa-eye" />
              </span>
              <span className="text-sm font-semibold text-white">
                Pratinjau Dokumen ({pages} halaman)
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={doc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#facc15] px-4 py-1.5 text-xs font-bold text-[#111928] transition hover:bg-[#eab308] hover:shadow-lg"
              >
                <i className="fa-solid fa-arrow-up-right-from-square" />
                Buka di Tab Baru
              </a>
              <a
                href={doc.file_url}
                download
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-200 transition hover:bg-white/10 hover:text-white"
              >
                <i className="fa-solid fa-download" />
                Unduh
              </a>
            </div>
          </div>

          {/* File not found warning */}
          {fileExists === false && (
            <div className="p-5 sm:p-8 text-center bg-gradient-to-b from-[#1f2937] to-[#111928]">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/10 border border-amber-500/20 text-4xl text-amber-400 shadow-inner mb-5">
                <i className="fa-solid fa-file-circle-exclamation" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Berkas Dokumen Belum Tersedia
              </h3>
              <p className="max-w-md mx-auto text-sm text-gray-400 mb-6 leading-relaxed">
                Berkas PDF untuk dokumen ini sedang dalam proses digitalisasi atau belum diunggah ke server. Silakan hubungi petugas PPID atau ajukan permohonan dokumen secara langsung.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
                <Link
                  href="/layanan-informasi#formulir"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#facc15] px-6 py-3.5 text-sm font-bold text-[#111928] shadow-lg shadow-[#facc15]/10 transition hover:-translate-y-0.5 hover:bg-[#eab308]"
                >
                  <i className="fa-solid fa-paper-plane" />
                  Ajukan Permohonan
                </Link>
                <Link
                  href="/dokumen-publik"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-gray-200 transition hover:bg-white/10"
                >
                  <i className="fa-solid fa-arrow-left" />
                  Kembali ke Arsip
                </Link>
              </div>
            </div>
          )}

          {/* Mobile-Friendly Card View (for mobile devices when file exists) */}
          {fileExists !== false && isMobile && !showIframeOnMobile && (
            <div className="p-5 sm:p-8 text-center bg-gradient-to-b from-[#1f2937] to-[#111928]">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10 border border-red-500/20 text-4xl text-red-400 shadow-inner mb-5">
                <i className="fa-solid fa-file-pdf" />
              </div>

              <h3 className="text-lg font-bold text-white mb-2">
                Pratinjau: {doc.title}
              </h3>
              <p className="max-w-md mx-auto text-sm text-gray-400 mb-6 leading-relaxed">
                Untuk kenyamanan membaca di perangkat mobile, kami merekomendasikan membuka dokumen langsung di aplikasi PDF atau di tab baru peramban Anda.
              </p>

              <div className="flex flex-col gap-3 justify-center max-w-sm mx-auto">
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#facc15] px-6 py-3.5 text-sm font-bold text-[#111928] shadow-lg shadow-[#facc15]/10 transition hover:-translate-y-0.5 hover:bg-[#eab308]"
                >
                  <i className="fa-solid fa-eye" />
                  Buka Pratinjau PDF Sekarang
                </a>
                <a
                  href={doc.file_url}
                  download
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-gray-200 transition hover:bg-white/10"
                >
                  <i className="fa-solid fa-download" />
                  Unduh Salinan PDF
                </a>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowIframeOnMobile(true)}
                  className="text-xs text-gray-400 hover:text-[#facc15] underline transition"
                >
                  Coba tampilkan penampil bawaan halaman (jika peramban mendukung)
                </button>
              </div>
            </div>
          )}

          {/* Desktop Inline Iframe / Explicit Mobile Iframe */}
          {fileExists !== false && showInlinePdf && (
            <div className="relative">
              <div className="bg-white p-1 sm:p-2">
                <iframe
                  title={doc.title}
                  src={`${doc.file_url}#page=1&toolbar=0`}
                  className="h-[500px] sm:h-[680px] md:h-[760px] w-full rounded-lg sm:rounded-2xl border border-gray-200"
                />
              </div>
              {/* Mobile toggle back button */}
              {isMobile && (
                <div className="p-3 bg-[#111928] text-center border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowIframeOnMobile(false)}
                    className="text-xs text-gray-400 hover:text-[#facc15] transition"
                  >
                    ← Kembali ke mode hemat ponsel
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Bottom Navigation */}
        <div className="flex justify-start pt-4 sm:pt-6 border-t border-white/5">
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
