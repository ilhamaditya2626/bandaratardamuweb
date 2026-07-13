"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function PublicHeaderShell() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => {
      setIsScrolled(pathname !== "/" || window.scrollY > 12);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollState);
    };
  }, [pathname]);

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`} id="header">
      <div className="header__container">
        <Link href="/" className="header__logo">
          <Image
            src="/assets/images/logo-sau.png"
            alt="Logo Bandara Tardamu"
            width={44}
            height={44}
            className="header__logo-image"
          />

          <div className="header__logo-text">
            <div className="header__logo-title">
              <span>BANDARA</span>{" "}
              <span className="header__logo-accent">TARDAMU</span>
            </div>

            <div className="header__logo-sub">
              SABU RAIJUA - NTT
            </div>
          </div>
        </Link>


        <nav className="header__nav" id="mainNav">
          {pathname !== "/" && (
            <Link
              href="/"
              className="header__home-link"
              aria-label="Kembali ke beranda"
              title="Beranda"
            >
              <i className="fa-solid fa-house"></i>
            </Link>
          )}

          <Link href="/penerbangan" className="header__nav-link">
            Penerbangan
          </Link>

          <Link href="/penumpang" className="header__nav-link">
            Penumpang
          </Link>

          <div className="nav-dropdown">
            <Link href="/tentang" className="header__nav-link">
              Tentang <i className="fa-solid fa-chevron-down"></i>
            </Link>

            <div className="nav-dropdown__menu">
              <Link href="/tentang">Profil Bandara</Link>
              <Link href="/fasilitas">Fasilitas Bandara</Link>
              <Link href="/regulasi">Regulasi</Link>
              <Link href="/ppid">PPID</Link>
              <Link href="/unit-kerja">Unit Kerja</Link>
            </div>
          </div>

          <div className="nav-dropdown">
            <Link href="/jelajah-sabu" className="header__nav-link">
              Jelajah Sabu <i className="fa-solid fa-chevron-down"></i>
            </Link>

            <div className="nav-dropdown__menu">
              <Link href="/jelajah-sabu">Jelajah Sabu</Link>
              <Link href="/destinasi-wisata">Destinasi Wisata</Link>
              <Link href="/transportasi-akses">Transportasi & Akses</Link>
              <Link href="/akomodasi-penginapan">Akomodasi</Link>
            </div>
          </div>

          <div className="nav-dropdown">
            <Link href="/informasi" className="header__nav-link">
              Informasi <i className="fa-solid fa-chevron-down"></i>
            </Link>

            <div className="nav-dropdown__menu">
              <Link href="/informasi">Informasi</Link>
              <Link href="/informasi-berkala">Informasi Berkala</Link>
              <Link href="/berita">Informasi Serta Merta</Link>
              <Link href="/laporan">Laporan Setiap Saat</Link>
              <Link href="/informasi-dikecualikan">
                Informasi yang Dikecualikan
              </Link>
            </div>
          </div>

          <div className="nav-dropdown">
            <Link href="/layanan-informasi" className="header__nav-link">
              Layanan Informasi <i className="fa-solid fa-chevron-down"></i>
            </Link>

            <div className="nav-dropdown__menu">
              <Link href="/layanan-informasi#daftar-informasi">
                Daftar Informasi Publik
              </Link>
              <Link href="/layanan-informasi#maklumat-pelayanan">
                Maklumat Pelayanan
              </Link>
              <Link href="/layanan-informasi#standar-biaya">
                Standar Biaya Layanan
              </Link>
              <Link href="/layanan-informasi#prosedur">
                Prosedur Permohonan Informasi
              </Link>
              <Link href="/layanan-informasi#keberatan">
                Prosedur Permohonan Keberatan
              </Link>
              <Link href="/layanan-informasi#sengketa">
                Prosedur Sengketa Informasi
              </Link>
              <Link href="/layanan-informasi#hak-hak-pemohon">
                Hak-Hak Pemohon Informasi
              </Link>
              <Link href="/layanan-informasi#formulir">Formulir Layanan</Link>
              <Link href="/layanan-informasi#pengaduan">
                Informasi & Pengaduan
              </Link>
            </div>
          </div>

          <Link href="/bantuan" className="header__nav-link">
            Bantuan
          </Link>
        </nav>

        <button className="header__burger" id="burgerBtn" aria-label="Buka menu navigasi">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
