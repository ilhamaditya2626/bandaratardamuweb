"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import Link from "next/link";
import { PageHero, serifStyle } from "../_components/info-page-shell";

const filters = ["Semua Pilihan", "Hotel & Resort", "Guest House", "Homestay"];

const hotels = [
  {
    title: "Hotel Raijua Permai",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070&auto=format&fit=crop",
    ],
    badge: "Terpopuler",
    description:
      "Terletak strategis di pusat kota Seba, menawarkan fasilitas lengkap dengan akses mudah ke bandara dan pelabuhan.",
    amenities: ["WiFi", "AC", "Resto"],
    amenityIcons: ["fa-wifi", "fa-snowflake", "fa-utensils"],
    price: "Rp 450.000",
  },
  {
    title: "Napae Beach Inn",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
    ],
    badge: "Beachfront",
    description:
      "Penginapan nyaman tepat di bibir pantai, cocok untuk menikmati pemandangan matahari terbenam setiap hari.",
    amenities: ["Pantai", "AC", "Parkir"],
    amenityIcons: ["fa-water", "fa-snowflake", "fa-parking"],
    price: "Rp 350.000",
  },
  {
    title: "Leba Homestay",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=2070&auto=format&fit=crop",
    ],
    badge: "Budget Friendly",
    description:
      "Suasana kekeluargaan yang kental dengan keramahan penduduk lokal, kamar bersih, dan lingkungan sangat tenang.",
    amenities: ["Sarapan", "Fan"],
    amenityIcons: ["fa-mug-hot", "fa-fan"],
    price: "Rp 200.000",
  },
];

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
          <div
            key={i}
            className="relative h-full w-full flex-shrink-0"
          >
            <Image
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
      <button
        type="button"
        onClick={prev}
        aria-label="Foto sebelumnya"
        className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-[#facc15] hover:text-[#111928] hover:scale-110 group-hover/carousel:opacity-100"
      >
        <i className="fa-solid fa-chevron-left text-sm"></i>
      </button>

      {/* Right Arrow */}
      <button
        type="button"
        onClick={next}
        aria-label="Foto selanjutnya"
        className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-[#facc15] hover:text-[#111928] hover:scale-110 group-hover/carousel:opacity-100"
      >
        <i className="fa-solid fa-chevron-right text-sm"></i>
      </button>

      {/* Dot Indicators */}
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

/* ───── Main Page ───── */
export default function AkomodasiPenginapanPage() {
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
        <div className="mb-16 flex flex-wrap gap-4 overflow-x-auto pb-4">
          {filters.map((item, index) => (
            <button
              key={item}
              type="button"
              className={`rounded-full px-6 py-2 text-sm ${
                index === 0
                  ? "bg-[#facc15] font-bold text-[#111928] shadow-lg"
                  : "border border-gray-700 bg-[#1f2937] font-medium text-gray-400 transition hover:border-[#facc15] hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel) => (
            <article
              key={hotel.title}
              className="flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#1f2937] transition duration-300 hover:-translate-y-2 hover:border-[#facc15] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.3)]"
            >
              <ImageCarousel
                images={hotel.images}
                alt={hotel.title}
                badge={hotel.badge}
              />

              <div className="flex flex-grow flex-col p-8">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <h3 className="text-2xl leading-tight text-white" style={serifStyle}>
                    {hotel.title}
                  </h3>
                </div>

                <p className="mb-6 flex-grow text-sm leading-relaxed text-gray-400">
                  {hotel.description}
                </p>

                <div className="mb-8 flex items-center gap-4 border-b border-white/5 pb-6 text-xs text-gray-500">
                  {hotel.amenities.map((amenity, index) => (
                    <span key={amenity} className="flex items-center gap-1">
                      <i className={`fa-solid ${hotel.amenityIcons[index]} text-[#facc15]`}></i>
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500">
                      Mulai Dari
                    </p>
                    <p className="text-lg font-bold text-white">
                      {hotel.price}
                      <span className="text-xs font-normal text-gray-400">/malam</span>
                    </p>
                  </div>
                  <a
                    href="tel:08123456789"
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition hover:bg-[#facc15] hover:text-[#111928]"
                  >
                    <i className="fa-solid fa-phone"></i>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

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
                <h4 className="mb-1 text-2xl font-bold text-[#facc15]">15+</h4>
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
