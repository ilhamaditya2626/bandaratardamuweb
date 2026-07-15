"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const aboutRoutes = new Set([
  "/tentang",
  "/fasilitas",
  "/regulasi",
  "/ppid",
  "/unit-kerja",
]);
const exploreRoutes = new Set([
  "/jelajah-sabu",
  "/destinasi-wisata",
  "/transportasi-akses",
  "/akomodasi-penginapan",
]);
const informationRoutes = new Set([
  "/informasi",
  "/informasi-berkala",
  "/berita",
  "/laporan",
  "/informasi-dikecualikan",
]);
const serviceRoutes = new Set(["/layanan-informasi"]);

// Color is applied to the leaf icon/label (not the <a>) because the public
// layout loads /css/style.css, whose unlayered `a { color: inherit }` rule
// overrides Tailwind's layered text-color utilities on anchor elements.
const color = (active: boolean) => (active ? "text-[#facc15]" : "text-gray-500");

export function PublicBottomNav() {
  const pathname = usePathname();
  const isNewsDetail = pathname.startsWith("/berita/");
  const isInformationActive = informationRoutes.has(pathname) || isNewsDetail;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[130] flex h-16 items-center justify-around bg-[#111928]/90 px-2 backdrop-blur-md lg:hidden">
      <Link href="/penerbangan" className="flex flex-col items-center gap-1">
        <i className={`fa-solid fa-plane text-lg ${color(pathname === "/penerbangan")}`}></i>
        <span className={`text-[10px] ${color(pathname === "/penerbangan")}`}>Penerbangan</span>
      </Link>
      <Link href="/penumpang" className="flex flex-col items-center gap-1">
        <i className={`fa-solid fa-user text-lg ${color(pathname === "/penumpang")}`}></i>
        <span className={`text-[10px] ${color(pathname === "/penumpang")}`}>Penumpang</span>
      </Link>
      <Link href="/tentang" className="flex flex-col items-center gap-1">
        <i className={`fa-solid fa-info-circle text-lg ${color(aboutRoutes.has(pathname))}`}></i>
        <span className={`text-[10px] ${color(aboutRoutes.has(pathname))}`}>Tentang</span>
      </Link>
      <Link href="/bantuan" className="-mt-10 flex flex-col items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#111928] bg-[#facc15] text-xl text-[#111928] shadow-[0_0_20px_rgba(250,204,21,0.4)]">
          <i className="fa-solid fa-headset"></i>
        </div>
        <span className="mt-1 text-[10px] font-bold uppercase tracking-tighter text-[#facc15]">
          bantuan
        </span>
      </Link>
      <Link href="/jelajah-sabu" className="flex flex-col items-center gap-1">
        <i className={`fa-solid fa-umbrella-beach text-lg ${color(exploreRoutes.has(pathname))}`}></i>
        <span className={`text-[10px] ${color(exploreRoutes.has(pathname))}`}>Jelajah</span>
      </Link>
      <Link href="/informasi" className="flex flex-col items-center gap-1">
        <i className={`fa-solid fa-newspaper text-lg ${color(isInformationActive)}`}></i>
        <span className={`text-[10px] ${color(isInformationActive)}`}>Informasi</span>
      </Link>
      <Link href="/layanan-informasi" className="flex flex-col items-center gap-1">
        <i className={`fa-solid fa-info-circle text-lg ${color(serviceRoutes.has(pathname))}`}></i>
        <span className={`text-[10px] ${color(serviceRoutes.has(pathname))}`}>Layanan</span>
      </Link>
    </nav>
  );
}
