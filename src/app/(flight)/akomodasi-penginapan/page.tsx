"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { PageHero, serifStyle } from "../_components/info-page-shell";
import { DynamicImage } from "@/components/dynamic-image";
import { usePublicPenginapan } from "@/hooks/usePenginapan";
import { Penginapan } from "@/services/client/penginapan.client";
import { facilityIcon } from "@/lib/penginapan-facilities";
import { toWhatsappUrl } from "@/lib/whatsapp";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

/* ───── Image Carousel Component ───── */
function ImageCarousel({
  images,
  alt,
  badge,
}: {
  images: string[];
  alt: string;
  badge: string;
}) {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const prev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrent((c) => (c === 0 ? total - 1 : c - 1));
    },
    [total],
  );

  const next = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrent((c) => (c === total - 1 ? 0 : c + 1));
    },
    [total],
  );

  return (
    <div className="group/carousel relative h-64 overflow-hidden">
      {/* Images */}
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={i} className="relative h-full w-full flex-shrink-0">
            <DynamicImage
              src={src}
              alt={`${alt} - foto ${i + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      {total > 1 && (
        <button
          type="button"
          onClick={prev}
          aria-label="Foto sebelumnya"
          className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-[#facc15] hover:text-[#111928] hover:scale-110 group-hover/carousel:opacity-100"
        >
          <i className="fa-solid fa-chevron-left text-sm"></i>
        </button>
      )}

      {/* Right Arrow */}
      {total > 1 && (
        <button
          type="button"
          onClick={next}
          aria-label="Foto selanjutnya"
          className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-[#facc15] hover:text-[#111928] hover:scale-110 group-hover/carousel:opacity-100"
        >
          <i className="fa-solid fa-chevron-right text-sm"></i>
        </button>
      )}

      {/* Dot Indicators */}
      {total > 1 && (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrent(i);
              }}
              aria-label={`Lihat foto ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "h-2 w-5 bg-[#facc15]"
                  : "h-2 w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}

      {/* Badge */}
      <div className="absolute left-4 top-4 z-10 rounded-lg bg-[#facc15]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#111928] backdrop-blur-md">
        {badge}
      </div>

      {/* Photo Counter */}
      <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-lg bg-black/50 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
        <i className="fa-solid fa-camera text-[9px]"></i>
        {current + 1}/{total}
      </div>
    </div>
  );
}

/* ───── Accommodation Card ───── */
function HotelCard({ hotel }: { hotel: Penginapan }) {
  const whatsappUrl = toWhatsappUrl(hotel.phone);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#1f2937] transition duration-300 hover:-translate-y-2 hover:border-[#facc15] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.3)]">
      <ImageCarousel
        images={hotel.photos.length > 0 ? hotel.photos : ["/assets/images/kelabba-maja.webp"]}
        alt={hotel.name}
        badge={hotel.category}
      />

      <div className="flex flex-grow flex-col p-8">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="text-2xl leading-tight text-white" style={serifStyle}>
            {hotel.name}
          </h3>
        </div>

        <p className="mb-6 flex-grow text-sm leading-relaxed text-gray-400">
          {hotel.description}
        </p>

        {hotel.facilities.length > 0 && (
          <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-white/5 pb-6 text-xs text-gray-500">
            {hotel.facilities.map((facility) => (
              <span key={facility} className="flex items-center gap-1">
                <i className={`fa-solid ${facilityIcon(facility)} text-[#facc15]`}></i>
                {facility}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-500">
              Mulai Dari
            </p>
            <p className="text-lg font-bold text-white">
              {formatCurrency(hotel.price)}
              <span className="text-xs font-normal text-gray-400">/malam</span>
            </p>
          </div>
          {hotel.phone ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Hubungi ${hotel.name} via WhatsApp`}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition hover:bg-[#facc15] hover:text-[#111928]"
            >
              <i className="fa-solid fa-phone"></i>
            </a>
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-gray-600">
              <i className="fa-solid fa-phone"></i>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

/* ───── Main Page ───── */
export default function AkomodasiPenginapanPage() {
  const { data: response, isLoading, isError } = usePublicPenginapan();
  const hotels = response?.data ?? [];

  return (
    <div className="bg-[#111928] text-gray-200">
      <PageHero
        backgroundImage="/assets/images/kelabba-maja.webp"
        gradient="linear-gradient(to bottom, rgba(17, 25, 40, 0.85) 0%, rgba(17, 25, 40, 1) 100%)"
        breadcrumbs={[
          { href: "/", label: "Beranda" },
          { href: "/jelajah-sabu", label: "Jelajah Sabu" },
          { label: "Akomodasi" },
        ]}
        title={
          <>
            Temukan Kenyamanan <br />
            <span className="italic text-[#facc15]">di Sabu Raijua</span>
          </>
        }
        description="Pilihan akomodasi terbaik mulai dari penginapan tepi pantai hingga homestay autentik yang siap menyambut kedatangan Anda."
      />

      <main className="mx-auto max-w-7xl flex-grow px-4 py-20 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="py-20 text-center text-gray-400">
            <i className="fa-solid fa-spinner fa-spin mr-2"></i>
            Memuat data penginapan...
          </div>
        ) : isError ? (
          <div className="py-20 text-center text-red-400">
            Gagal memuat data penginapan. Silakan muat ulang halaman.
          </div>
        ) : hotels.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            Belum ada data penginapan yang tersedia saat ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}

        <div className="group relative mt-24 overflow-hidden rounded-[40px] border border-white/5 bg-[#1f2937] p-10 md:p-16">
          <div className="absolute right-0 top-0 p-10 opacity-5 transition-transform duration-1000 group-hover:scale-110">
            <i className="fa-solid fa-bed text-[200px] text-[#facc15]"></i>
          </div>

          <div className="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl text-white md:text-4xl" style={serifStyle}>
                Butuh Rekomendasi Khusus?
              </h2>
              <p className="mb-8 leading-relaxed text-gray-400">
                Tim Pusat Informasi Bandara Tardamu siap membantu Anda memberikan
                informasi kontak terbaru dan reservasi untuk perjalanan grup atau
                kunjungan dinas.
              </p>
              <Link
                href="/bantuan"
                className="inline-flex items-center gap-3 rounded-full bg-[#facc15] px-8 py-4 font-bold text-[#111928] transition hover:shadow-[0_0_20px_rgba(250,204,21,0.4)]"
              >
                Hubungi Pusat Informasi <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
                <h4 className="mb-1 text-2xl font-bold text-[#facc15]">
                  {hotels.length > 0 ? `${hotels.length}+` : "15+"}
                </h4>
                <p className="text-xs uppercase tracking-widest text-gray-500">
                  Pilihan Akomodasi
                </p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
                <h4 className="mb-1 text-2xl font-bold text-[#facc15]">100%</h4>
                <p className="text-xs uppercase tracking-widest text-gray-500">
                  Ramah Lokal
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
