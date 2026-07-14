"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const desktopNavItems = [
  { href: "/penerbangan", label: "Penerbangan" },
  { href: "/penumpang", label: "Penumpang" },
  {
    href: "/tentang",
    label: "Tentang",
    items: [
      { href: "/tentang", label: "Tentang" },
      { href: "/fasilitas", label: "Fasilitas Bandara" },
      { href: "/regulasi", label: "Regulasi" },
      { href: "/ppid", label: "PPID" },
      { href: "/unit-kerja", label: "Unit Kerja" },
    ],
  },
  {
    href: "/jelajah-sabu",
    label: "Jelajah Sabu",
    items: [
      { href: "/jelajah-sabu", label: "Jelajah Sabu" },
      { href: "/destinasi-wisata", label: "Destinasi Wisata" },
      { href: "/transportasi-akses", label: "Transportasi & Akses" },
      { href: "/akomodasi-penginapan", label: "Akomodasi" },
    ],
  },
  {
    href: "/informasi",
    label: "Informasi",
    items: [
      { href: "/informasi", label: "Informasi" },
      { href: "/informasi-berkala", label: "Informasi Berkala" },
      { href: "/berita", label: "Informasi Serta Merta" },
      { href: "/laporan", label: "Laporan Setiap Saat" },
      { href: "/informasi-dikecualikan", label: "Informasi yang Dikecualikan" },
    ],
  },
  {
    href: "/layanan-informasi",
    label: "Layanan Informasi",
    items: [
      { href: "/layanan-informasi#daftar-informasi", label: "Daftar Informasi Publik" },
      {
        href: "/layanan-informasi#maklumat-pelayanan",
        label: "Maklumat Pelayanan",
      },
      {
        href: "/layanan-informasi#standar-biaya",
        label: "Standar Biaya Layanan",
      },
      {
        href: "/layanan-informasi#prosedur",
        label: "Prosedur Permohonan Informasi",
      },
      {
        href: "/layanan-informasi#keberatan",
        label: "Prosedur Permohonan Keberatan",
      },
      {
        href: "/layanan-informasi#sengketa",
        label: "Prosedur Sengketa Informasi",
      },
      {
        href: "/layanan-informasi#hak-hak-pemohon",
        label: "Hak-Hak Pemohon Informasi",
      },
      { href: "/layanan-informasi#formulir", label: "Formulir Layanan" },
      { href: "/layanan-informasi#pengaduan", label: "Informasi & Pengaduan" },
    ],
  },
  { href: "/bantuan", label: "Bantuan" },
];

const mobileNavItems = [
  { href: "/penerbangan", label: "Penerbangan", icon: "fa-plane" },
  { href: "/penumpang", label: "Penumpang", icon: "fa-users" },
  { href: "/tentang", label: "Tentang", icon: "fa-info-circle" },
  { href: "/jelajah-sabu", label: "Wisata", icon: "fa-umbrella-beach" },
  { href: "/bantuan", label: "Bantuan", icon: "fa-headset" },
];

const exploreSidebarItems = [
  { href: "/destinasi-wisata", label: "Destinasi Wisata", icon: "fa-location-dot" },
  { href: "/transportasi-akses", label: "Transportasi & Akses", icon: "fa-car" },
  { href: "/akomodasi-penginapan", label: "Akomodasi", icon: "fa-house" },
];

const socialLinks = [
  {
    href: "https://www.facebook.com/tardamusabuairport",
    icon: "fa-facebook-f",
    label: "Facebook",
  },
  {
    href: "https://www.instagram.com/tardamuairport?igsh=MTdzdHhwa3gwZm50Zg==",
    icon: "fa-instagram",
    label: "Instagram",
  },
  {
    href: "https://www.youtube.com/channel/UCGdlwT6j283tcnpAM7lfEgw",
    icon: "fa-youtube",
    label: "YouTube",
  },
  {
    href: "https://www.tiktok.com/@tardamuairport",
    icon: "fa-tiktok",
    label: "TikTok",
  },
];

const aboutRoutes = new Set(["/tentang", "/fasilitas", "/regulasi", "/ppid"]);
const exploreRoutes = new Set([
  "/jelajah-sabu",
  "/destinasi-wisata",
  "/transportasi-akses",
  "/akomodasi-penginapan",
]);
const informationRoutes = new Set([
  "/informasi",
  "/berita",
  "/laporan",
  "/informasi-dikecualikan",
]);
const serviceRoutes = new Set(["/layanan-informasi"]);

function BrandLogo({ footer = false }: { footer?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/assets/images/logo-sau.png"
        alt="Logo Bandara"
        width={footer ? 48 : 44}
        height={footer ? 48 : 44}
        className={footer ? "h-12 w-auto object-contain" : "h-11 w-auto object-contain"}
      />

      <div className="flex flex-col leading-none">
        {footer ? (
          <div className="flex flex-col font-['Outfit',sans-serif] text-[20px] font-extrabold uppercase leading-[1.05] tracking-[0.04em]">
            <span className="text-white">BANDAR UDARA</span>
            <span className="text-[#facc15]">TARDAMU</span>
          </div>
        ) : (
          <span className="font-['Outfit',sans-serif] text-[16px] font-extrabold tracking-[0.04em] text-white">
            BANDARA <span className="text-[#facc15]">TARDAMU</span>
          </span>
        )}
        {!footer && (
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-gray-400">
            SABU RAIJUA - NTT
          </span>
        )}
      </div>
    </div>
  );
}

export default function JelajahSabuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isExploreSidebar = exploreRoutes.has(pathname);
  const sidebarItems = isExploreSidebar ? exploreSidebarItems : mobileNavItems;

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />

      <div className="relative min-h-screen overflow-x-hidden bg-[#111928] font-[Poppins,sans-serif] text-white leading-relaxed">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 bg-[url('/assets/images/wisata/Pantai.webp')] bg-cover bg-center bg-no-repeat"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[1] bg-[linear-gradient(to_bottom,rgba(17,25,40,0.7)_0%,rgba(17,25,40,0.74)_18%,rgba(17,25,40,0.82)_40%,rgba(17,25,40,0.9)_64%,rgba(17,25,40,0.95)_82%,rgba(17,25,40,0.98)_100%)]"
        />

        <header className="fixed left-0 right-0 top-0 z-[100] border-b border-white/10 bg-[#111928]/84 shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-md">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
            <Link href="/" className="shrink-0">
              <BrandLogo />
            </Link>

            <div className="hidden items-center space-x-8 text-sm font-medium lg:flex">
              {pathname !== "/" && (
                <Link
                  href="/"
                  aria-label="Kembali ke beranda"
                  title="Beranda"
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-gray-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#facc15]/70 hover:bg-[#facc15]/10 hover:text-[#facc15] hover:shadow-[0_10px_26px_rgba(0,0,0,0.22)]"
                >
                  <i className="fa-solid fa-house text-[13px] transition-transform duration-300 group-hover:scale-110"></i>
                </Link>
              )}

              {desktopNavItems.map((item) =>
                item.items ? (
                  <div key={item.href} className="group relative">
                    <span
                      className={`inline-flex items-center gap-1 ${pathname === item.href || item.items.some((subItem) => pathname === subItem.href)
                        ? "font-semibold text-[#facc15]"
                        : ""
                        }`}
                    >
                      <Link href={item.href}>{item.label}</Link>
                      <i className="fa-solid fa-chevron-down text-[10px]"></i>
                    </span>
                    <div
                      className={`invisible absolute left-0 top-full mt-1 rounded-xl border border-gray-700 bg-[#1f2937] py-2 opacity-0 shadow-2xl transition-all group-hover:visible group-hover:opacity-100 ${item.label === "Layanan Informasi" ? "w-72" : "w-56"
                        }`}
                    >
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`block px-4 py-2 text-sm transition hover:bg-gray-700 hover:text-[#facc15] ${pathname === subItem.href ? "bg-gray-700 text-[#facc15]" : "text-gray-300"
                            }`}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={pathname === item.href ? "font-semibold text-[#facc15]" : ""}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="p-2 text-2xl hover:text-[#facc15] lg:hidden"
              aria-label="Buka menu"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>
        </header>

        <div className="relative z-10">
          <div
            onClick={() => setIsMenuOpen(false)}
            className={`fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm transition ${isMenuOpen ? "block" : "hidden"
              }`}
          ></div>

          <aside
            className={`fixed bottom-0 right-0 top-0 z-[120] w-[300px] bg-[#1f2937] shadow-2xl transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"
              }`}
          >
            <div className="flex h-full flex-col p-8">
              <div className="mb-12 flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest text-[#facc15]">
                  MENU NAVIGASI
                </span>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl text-gray-400 hover:text-white"
                  aria-label="Tutup menu"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <nav className={`flex-1 min-h-0 overflow-y-auto pr-2 flex flex-col ${isExploreSidebar ? "space-y-0" : "space-y-6"}`}>
                {sidebarItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-4 transition ${isExploreSidebar
                      ? `border-b border-white/5 py-4 text-[18px] font-medium ${pathname === item.href ? "text-[#facc15]" : "text-gray-200 hover:text-[#facc15]"
                      }`
                      : `${pathname === item.href ||
                        (item.href === "/tentang" && aboutRoutes.has(pathname)) ||
                        (item.href === "/jelajah-sabu" && exploreRoutes.has(pathname)) ||
                        (item.href === "/informasi" && informationRoutes.has(pathname)) ||
                        (item.href === "/layanan-informasi" && serviceRoutes.has(pathname))
                        ? "text-[#facc15]"
                        : "hover:text-[#facc15]"
                      } text-2xl`
                      }`}
                    style={{
                      fontFamily: isExploreSidebar ? "'Poppins', sans-serif" : "'Playfair Display', serif",
                    }}
                  >
                    <i className={`fa-solid ${item.icon} ${isExploreSidebar ? "w-6 text-base" : "text-lg"}`}></i>
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto border-t border-white/5 pt-10 text-center">
                <p className="text-xs italic text-gray-500">Bandara Tardamu Sabu Raijua</p>
              </div>
            </div>
          </aside>

          {children}

          <footer className="border-t border-white/10 bg-[#0b1220]/40 pb-28 pt-20 backdrop-blur-sm md:pb-16">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-16 grid grid-cols-1 items-start gap-12 md:grid-cols-3">
                <div className="order-1 flex flex-col items-start space-y-6">
                  <BrandLogo footer />
                  <p className="max-w-xs text-sm leading-relaxed text-gray-400">
                    Komitmen kami adalah memberikan pelayanan informasi publik yang transparan
                    dan akuntabel bagi seluruh masyarakat.
                  </p>
                </div>

                <div className="order-2">
                  <div className="mx-auto flex w-fit flex-col items-center">
                    <h4 className="mb-8 inline-block border-b border-[#facc15]/30 pb-2 text-sm font-bold uppercase tracking-[0.2em] text-white">
                      Kontak Kami
                    </h4>
                    <ul className="space-y-4 self-start text-left">
                      <li className="group flex items-center gap-4">
                        <i className="fa-brands fa-whatsapp text-lg text-[#facc15] transition group-hover:scale-110"></i>
                        <a href="https://wa.me/+6285707190065" target="_blank" rel="noreferrer" className="text-sm text-gray-300 underline decoration-gray-600 underline-offset-4 transition hover:text-[#facc15]">+62 857-0719-0065</a>
                      </li>
                      <li className="group flex items-center gap-4">
                        <i className="fa-solid fa-envelope text-lg text-[#facc15] transition group-hover:scale-110"></i>
                        <span className="text-sm text-gray-300">bandaratardamu@gmail.com</span>
                      </li>
                      <li className="group flex items-center gap-4">
                        <i className="fa-solid fa-location-dot text-lg text-[#facc15] transition group-hover:scale-110"></i>
                        <a
                          href="https://maps.google.com"
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-gray-300 underline decoration-gray-600 underline-offset-4 transition hover:text-[#facc15]"
                        >
                          Google Maps Location
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="order-3 flex w-fit flex-col items-center md:ml-auto">
                  <h4 className="mb-8 inline-block border-b border-[#facc15]/30 pb-2 text-sm font-bold uppercase tracking-[0.2em] text-white">
                    Social Media
                  </h4>
                  <div className="flex justify-center gap-4">
                    {socialLinks.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={item.label}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#1f2937]/80 text-gray-300 transition-all duration-300 hover:-translate-y-1 hover:bg-[#facc15] hover:text-[#111928]"
                      >
                        <i className={`fa-brands ${item.icon}`}></i>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-4 border-t border-white/10 pt-8 text-[10px] uppercase tracking-[0.2em] text-gray-500 md:flex-row">
                <p>&copy; 2026 Bandar Udara Tardamu Sabu Raijua.</p>
              </div>
            </div>
          </footer>

          <nav className="fixed bottom-0 left-0 right-0 z-[130] flex h-16 items-center justify-around bg-[#111928]/90 px-2 backdrop-blur-md lg:hidden">
            <Link
              href="/penerbangan"
              className={`flex flex-col items-center gap-1 ${pathname === "/penerbangan" ? "text-[#facc15]" : "text-gray-500"
                }`}
            >
              <i className="fa-solid fa-plane text-lg"></i>
              <span className="text-[10px]">Penerbangan</span>
            </Link>
            <Link
              href="/penumpang"
              className={`flex flex-col items-center gap-1 ${pathname === "/penumpang" ? "text-[#facc15]" : "text-gray-500"
                }`}
            >
              <i className="fa-solid fa-user text-lg"></i>
              <span className="text-[10px]">Penumpang</span>
            </Link>
            <Link
              href="/tentang"
              className={`flex flex-col items-center gap-1 ${aboutRoutes.has(pathname) ? "text-[#facc15]" : "text-gray-500"
                }`}
            >
              <i className="fa-solid fa-info-circle text-lg"></i>
              <span className="text-[10px]">Tentang</span>
            </Link>
            <Link href="/bantuan" className="-mt-10 flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#111928] bg-[#facc15] text-xl text-[#111928] shadow-[0_0_20px_rgba(250,204,21,0.4)]">
                <i className="fa-solid fa-headset"></i>
              </div>
              <span className="mt-1 text-[10px] font-bold uppercase tracking-tighter text-[#facc15]">
                bantuan
              </span>
            </Link>
            <Link
              href="/jelajah-sabu"
              className={`flex flex-col items-center gap-1 ${exploreRoutes.has(pathname) ? "text-[#facc15]" : "text-gray-500"
                }`}
            >
              <i className="fa-solid fa-umbrella-beach text-lg"></i>
              <span className="text-[10px]">Jelajah</span>
            </Link>
            <Link
              href="/informasi"
              className={`flex flex-col items-center gap-1 ${informationRoutes.has(pathname) ? "text-[#facc15]" : "text-gray-500"
                }`}
            >
              <i className="fa-solid fa-newspaper text-lg"></i>
              <span className="text-[10px]">Informasi</span>
            </Link>
            <Link
              href="/layanan-informasi"
              className={`flex flex-col items-center gap-1 ${serviceRoutes.has(pathname) ? "text-[#facc15]" : "text-gray-500"
                }`}
            >
              <i className="fa-solid fa-info-circle text-lg"></i>
              <span className="text-[10px]">Layanan</span>
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
