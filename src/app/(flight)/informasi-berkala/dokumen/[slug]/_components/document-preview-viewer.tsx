"use client";

import React, { useState, useEffect } from "react";

interface DocumentPreviewViewerProps {
  title: string;
  previewUrl: string;
  previewPages: number;
  totalPages: number;
  serifStyle?: React.CSSProperties;
}

export function DocumentPreviewViewer({
  title,
  previewUrl,
  previewPages,
  totalPages,
  serifStyle,
}: DocumentPreviewViewerProps) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showIframeOnMobile, setShowIframeOnMobile] = useState<boolean>(false);

  useEffect(() => {
    // Deteksi apakah perangkat mobile / layar kecil
    const checkMobile = () => {
      const userAgent =
        typeof window !== "undefined" ? window.navigator.userAgent : "";
      const mobileRegex =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileDevice =
        mobileRegex.test(userAgent) || window.innerWidth < 768;
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="mt-8 overflow-hidden rounded-[32px] border border-white/10 bg-[#1f2937] shadow-2xl">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 border-b border-white/5 bg-white/[0.02] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-500/20 text-xs text-red-400">
              <i className="fa-solid fa-file-pdf" />
            </span>
            <h2 className="text-xl font-bold text-white" style={serifStyle}>
              Pratinjau PDF
            </h2>
          </div>
          <p className="mt-1 text-sm text-gray-400">
            Menampilkan <span className="font-semibold text-gray-200">{previewPages}</span> dari{" "}
            <span className="font-semibold text-gray-200">{totalPages}</span> halaman pertama.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#facc15]/10 px-3 py-1 text-xs font-bold text-[#facc15] border border-[#facc15]/20">
            PRATINJAU TERBATAS
          </span>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#facc15] px-4 py-1.5 text-xs font-bold text-[#111928] transition hover:bg-[#eab308] hover:shadow-lg"
          >
            <i className="fa-solid fa-arrow-up-right-from-square" />
            Buka di Tab Baru
          </a>
          <a
            href={previewUrl}
            download
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-200 transition hover:bg-white/10 hover:text-white"
          >
            <i className="fa-solid fa-download" />
            Unduh
          </a>
        </div>
      </div>

      {/* Main Preview Container */}
      {isMobile && !showIframeOnMobile ? (
        /* Mobile-Optimized Friendly Card */
        <div className="p-6 sm:p-8 text-center bg-gradient-to-b from-[#1f2937] to-[#111928]">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10 border border-red-500/20 text-4xl text-red-400 shadow-inner mb-5">
            <i className="fa-solid fa-file-pdf" />
          </div>

          <h3 className="text-lg font-bold text-white mb-2">
            Dokumen Pratinjau: {title}
          </h3>
          <p className="max-w-md mx-auto text-sm text-gray-400 mb-6 leading-relaxed">
            Peramban ponsel (Android / iOS) memerlukan pembukaan langsung agar dapat membaca dokumen dengan nyaman di aplikasi PDF atau layar penuh.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#facc15] px-6 py-3.5 text-sm font-bold text-[#111928] shadow-lg shadow-[#facc15]/10 transition hover:-translate-y-0.5 hover:bg-[#eab308]"
            >
              <i className="fa-solid fa-eye" />
              Buka Pratinjau PDF Sekarang
            </a>
            <a
              href={previewUrl}
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
      ) : (
        /* Desktop or Explicit Iframe View */
        <div className="relative">
          <iframe
            title={`Pratinjau ${title}`}
            src={`${previewUrl}#toolbar=0&navpanes=0`}
            className="h-[680px] w-full bg-white border-0"
          />
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
  );
}
