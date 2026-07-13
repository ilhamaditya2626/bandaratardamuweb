import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { PublicHeaderShell } from "./public-header-shell";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  openGraph: {
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
};




const mobileNavItems = [
  { href: "/penerbangan", label: "Penerbangan", icon: "fa-plane" },
  { href: "/penumpang", label: "Penumpang", icon: "fa-users" },
  { href: "/tentang", label: "Tentang Bandara", icon: "fa-building" },
  { href: "/jelajah-sabu", label: "Jelajah Sabu", icon: "fa-umbrella-beach" },
  { href: "/informasi", label: "informasi", icon: "fa-newspaper" },
  {
    href: "/bantuan",
    label: "Pusat Bantuan",
    icon: "fa-circle-question",
  },
  { href: "/layanan-informasi", label: "Layanan Informasi", icon: "fa-info-circle" }
];

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />
      <link rel="stylesheet" href="/css/style.css" />

      <PublicHeaderShell />


      <div className="nav-overlay" id="navOverlay"></div>

      <div className="mobile-nav" id="mobileNav">
        <div className="mobile-nav__content">
          {mobileNavItems.map((item) => (
            <Link key={item.href} href={item.href} className="mobile-nav__link">
              <i className={`fa-solid ${item.icon}`}></i> {item.label}
            </Link>
          ))}
        </div>
      </div>

      <main>{children}</main>

      <footer className="footer" id="bantuan">
        <div className="footer__container">
          <div className="footer__grid">
            <div className="footer__brand">
              <div className="footer__brand-head">
                <Image
                  src="/assets/images/logo-sau.png"
                  alt="Logo Bandara Tardamu"
                  width={56}
                  height={56}
                  className="footer__logo-image"
                />

                <div className="footer__brand-title">
                  <span>BANDAR UDARA</span>
                  <span className="footer__brand-accent">TARDAMU</span>
                </div>
              </div>

              <p className="footer__description">
                Komitmen kami adalah memberikan pelayanan informasi publik yang
                transparan dan akuntabel bagi seluruh masyarakat.
              </p>
            </div>

            <div className="footer__contact">
              <h4 className="footer__section-title">Kontak Kami</h4>

              <ul className="footer__contact-list">
                <li className="group flex items-center gap-4 mb-4">
                  <i className="fa-brands fa-whatsapp text-lg text-[#facc15] transition group-hover:scale-110"></i>
                  <a href="https://wa.me/+6285707190065" target="_blank" rel="noreferrer" className="text-sm text-gray-300 underline decoration-gray-600 underline-offset-4 transition hover:text-[#facc15]">+62 857-0719-0065</a>
                </li>

                <li className="group flex items-center gap-4 mb-4">
                  <i className="fa-solid fa-envelope text-lg text-[#facc15] transition group-hover:scale-110"></i>
                  <span className="text-sm text-gray-300">bandaratardamu@gmail.com</span>
                </li>

                <li className="group flex items-center gap-4">
                  <i className="fa-solid fa-location-dot text-lg text-[#facc15] transition group-hover:scale-110"></i>
                  <a
                    href="https://maps.app.goo.gl/qvA9bXQz43RCBnMJ9"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-gray-300 underline decoration-gray-600 underline-offset-4 transition hover:text-[#facc15]"
                  >
                    Google Maps Location
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer__social">
              <h4 className="footer__section-title">Social Media</h4>

              <div className="footer__social-icons">
                <a
                  href="https://www.facebook.com/tardamusabuairport"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                >
                  <i className="fa-brands fa-facebook-f"></i>
                </a>

                <a
                  href="https://www.instagram.com/tardamuairport?igsh=MTdzdHhwa3gwZm50Zg=="
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  <i className="fa-brands fa-instagram"></i>
                </a>

                <a
                  href="https://www.youtube.com/channel/UCGdlwT6j283tcnpAM7lfEgw"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                >
                  <i className="fa-brands fa-youtube"></i>
                </a>

                <a
                  href="https://www.tiktok.com/@tardamuairport"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                >
                  <i className="fa-brands fa-tiktok"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="footer__bottom">
            <p>&copy; 2026 Bandar Udara Tardamu Sabu Raijua.</p>
          </div>
        </div>
      </footer>


      <nav className="bottom-nav" id="bottomNav">
        <Link href="/penerbangan" className="bottom-nav__item">
          <i className="fa-solid fa-plane"></i>
          <span>Penerbangan</span>
        </Link>
        <Link href="/penumpang" className="bottom-nav__item">
          <i className="fa-solid fa-users"></i>
          <span>Penumpang</span>
        </Link>
        <Link href="/tentang" className="bottom-nav__item">
          <i className="fa-solid fa-building"></i>
          <span>Tentang</span>
        </Link>
        <Link href="/bantuan" className="bottom-nav__item">
          <i className="fa-solid fa-circle-question"></i>
          <span>Bantuan</span>
        </Link>
        <Link href="/jelajah-sabu" className="bottom-nav__item">
          <i className="fa-solid fa-umbrella-beach"></i>
          <span>Jelajah</span>
        </Link>
        <Link href="/informasi" className="bottom-nav__item">
          <i className="fa-solid fa-newspaper"></i>
          <span>Informasi</span>
        </Link>
        <Link href="/layanan-informasi" className="bottom-nav__item">
          <i className="fa-solid fa-info-circle"></i>
          <span>Layanan</span>
        </Link>
      </nav>

      <Script src="/js/main.js" strategy="afterInteractive" />
    </>
  );
}
