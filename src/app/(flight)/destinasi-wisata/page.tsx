import Image from "next/image";
import Link from "next/link";
import { PageHero, serifStyle } from "../_components/info-page-shell";

const destinations = [
  {
    title: "Kelabba Maja",
    image: "/assets/images/kelabba-maja.webp",
    alt: "Kelabba Maja",
    badge: "Ikonik",
    description:
      "Situs alam berupa tebing megah berlapis warna-warni yang menawarkan pemandangan dramatis saat matahari terbit.",
    actionLabel: "Buka di Maps",
    actionIcon: "fa-location-arrow",
    href: "https://maps.google.com/?q=Kelabba+Maja+Sabu+Raijua",
  },
  {
    title: "Festival Hole",
    image: "/assets/images/festival-hole.webp",
    alt: "Festival Hole",
    badge: "Budaya",
    description:
      "Festival budaya tahunan masyarakat Sabu Raijua sebagai wujud syukur atas hasil panen dengan ritual adat yang sakral.",
    actionLabel: "Lihat Jadwal",
    actionIcon: "fa-calendar-days",
    href: "/berita",
  },
  {
    title: "Benteng Menanga",
    image: "/assets/images/benteng-menanga.webp",
    alt: "Benteng Menanga",
    badge: "Sejarah",
    description:
      "Situs bersejarah peninggalan masa lampau yang menjadi saksi perjalanan budaya dan pertahanan masyarakat Sabu.",
    actionLabel: "Buka di Maps",
    actionIcon: "fa-location-arrow",
    href: "https://maps.google.com/?q=Benteng+Menanga+Sabu+Raijua",
  },
  {
    title: "Bukit Senyum",
    image: "/assets/images/bukit-senyum.webp",
    alt: "Bukit Senyum",
    badge: "Panorama",
    description:
      "Perbukitan dengan panorama terbuka yang cocok untuk menikmati sunrise, sunset, dan bentang alam Sabu.",
    actionLabel: "Buka di Maps",
    actionIcon: "fa-location-arrow",
    href: "https://maps.google.com/?q=Bukit+Senyum+Sabu+Raijua",
  },
  {
    title: "Bukit Titinalede",
    image: "/assets/images/bukit-titinalede.webp",
    alt: "Bukit Titinalede",
    badge: "Favorit",
    description:
      "Bukit eksotis dengan pemandangan perbukitan savana yang menjadi spot favorit pencinta fotografi alam.",
    actionLabel: "Buka di Maps",
    actionIcon: "fa-location-arrow",
    href: "https://maps.google.com/?q=Bukit+Titinalede+Sabu+Raijua",
  },
  {
    title: "Gua Lie Madira",
    image: "/assets/images/gua-lie-madira.webp",
    alt: "Gua Lie Madira",
    badge: "Petualangan",
    description:
      "Destinasi gua alami dengan nuansa eksotis yang cocok untuk wisata petualangan dan eksplorasi alam.",
    actionLabel: "Buka di Maps",
    actionIcon: "fa-location-arrow",
    href: "https://maps.google.com/?q=Gua+Lie+Madira+Sabu+Raijua",
  },
  {
    title: "Gua Mabala",
    image: "/assets/images/gua-mabala.webp",
    alt: "Gua Mabala",
    badge: "Eksplorasi",
    description:
      "Gua alami yang menawarkan pengalaman wisata berbeda dengan karakter geologi khas Pulau Sabu.",
    actionLabel: "Buka di Maps",
    actionIcon: "fa-location-arrow",
    href: "https://maps.google.com/?q=Gua+Mabala+Sabu+Raijua",
  },
  {
    title: "Gua Nahoro",
    image: "/assets/images/gua-nahoro.webp",
    alt: "Gua Nahoro",
    badge: "Alam",
    description:
      "Objek wisata alam berupa gua dengan suasana tenang dan daya tarik alami yang masih asri.",
    actionLabel: "Buka di Maps",
    actionIcon: "fa-location-arrow",
    href: "https://maps.google.com/?q=Gua+Nahoro+Sabu+Raijua",
  },
  {
    title: "Kampung Adat Kolorae",
    image: "/assets/images/kampung-adat-kolorae.webp",
    alt: "Kampung Adat Kolorae",
    badge: "Warisan Budaya",
    description:
      "Perkampungan adat yang mempertahankan rumah tradisional, nilai budaya, dan kehidupan masyarakat lokal.",
    actionLabel: "Buka di Maps",
    actionIcon: "fa-location-arrow",
    href: "https://maps.google.com/?q=Kampung+Adat+Kolorae+Sabu+Raijua",
  },
  {
    title: "Kampung Adat Kujiratu",
    image: "/assets/images/kampung-adat-kujiratu.webp",
    alt: "Kampung Adat Kujiratu",
    badge: "Tradisional",
    description:
      "Destinasi budaya untuk mengenal lebih dekat arsitektur tradisional dan kearifan lokal masyarakat Sabu.",
    actionLabel: "Buka di Maps",
    actionIcon: "fa-location-arrow",
    href: "https://maps.google.com/?q=Kampung+Adat+Kujiratu+Sabu+Raijua",
  },
  {
    title: "Kampung Adat Namata",
    image: "/assets/images/kampung-adat-namata.webp",
    alt: "Kampung Adat Namata",
    badge: "Budaya",
    description:
      "Kawasan adat dengan kekayaan budaya lokal yang mencerminkan identitas masyarakat Pulau Sabu.",
    actionLabel: "Buka di Maps",
    actionIcon: "fa-location-arrow",
    href: "https://maps.google.com/?q=Kampung+Adat+Namata+Sabu+Raijua",
  },
  {
    title: "Pantai Cemara",
    image: "/assets/images/pantai-cemara.webp",
    alt: "Pantai Cemara",
    badge: "Pantai",
    description:
      "Pantai yang menghadirkan suasana teduh dengan deretan pepohonan dan panorama laut yang menenangkan.",
    actionLabel: "Buka di Maps",
    actionIcon: "fa-location-arrow",
    href: "https://maps.google.com/?q=Pantai+Cemara+Sabu+Raijua",
  },
  {
    title: "Pantai Eingatta",
    image: "/assets/images/pantai-eingatta.webp",
    alt: "Pantai Eingatta",
    badge: "Hidden Gem",
    description:
      "Pantai alami dengan suasana tenang dan pemandangan laut terbuka yang cocok untuk relaksasi.",
    actionLabel: "Buka di Maps",
    actionIcon: "fa-location-arrow",
    href: "https://maps.google.com/?q=Pantai+Eingatta+Sabu+Raijua",
  },
  {
    title: "Pantai Gelenalalu",
    image: "/assets/images/pantai-gelenalalu.webp",
    alt: "Pantai Gelenalalu",
    badge: "Eksotis",
    description:
      "Pantai eksotis dengan hamparan pasir dan panorama khas wilayah timur Indonesia yang memikat.",
    actionLabel: "Buka di Maps",
    actionIcon: "fa-location-arrow",
    href: "https://maps.google.com/?q=Pantai+Gelenalalu+Sabu+Raijua",
  },
  {
    title: "Pantai Kepo",
    image: "/assets/images/Pantai Kepo.webp",
    alt: "Pantai Kepo",
    badge: "Santai",
    description:
      "Destinasi pantai dengan suasana nyaman untuk menikmati angin laut dan pemandangan matahari terbenam.",
    actionLabel: "Buka di Maps",
    actionIcon: "fa-location-arrow",
    href: "https://maps.google.com/?q=Pantai+Kepo+Sabu+Raijua",
  },
  {
    title: "Pantai Langa Ae",
    image: "/assets/images/pantai-langa-ae.webp",
    alt: "Pantai Langa Ae",
    badge: "Pantai",
    description:
      "Pantai menawan dengan panorama laut biru yang cocok untuk wisata keluarga maupun fotografi.",
    actionLabel: "Buka di Maps",
    actionIcon: "fa-location-arrow",
    href: "https://maps.google.com/?q=Pantai+Langa+Ae+Sabu+Raijua",
  },
  {
    title: "Pantai Ledeana",
    image: "/assets/images/pantai-ledeana.webp",
    alt: "Pantai Ledeana",
    badge: "Favorit",
    description:
      "Pantai indah dengan karakter pesisir khas Sabu yang menghadirkan suasana tenang dan alami.",
    actionLabel: "Buka di Maps",
    actionIcon: "fa-location-arrow",
    href: "https://maps.google.com/?q=Pantai+Ledeana+Sabu+Raijua",
  },
  {
    title: "Pantai Leokoa",
    image: "/assets/images/pantai-leokoa.webp",
    alt: "Pantai Leokoa",
    badge: "Pesisir",
    description:
      "Wisata pesisir dengan panorama laut luas yang cocok untuk menikmati keindahan alam Pulau Sabu.",
    actionLabel: "Buka di Maps",
    actionIcon: "fa-location-arrow",
    href: "https://maps.google.com/?q=Pantai+Leokoa+Sabu+Raijua",
  },
  {
    title: "Pantai Majala",
    image: "/assets/images/pantai-majala.webp",
    alt: "Pantai Majala",
    badge: "Sunset",
    description:
      "Pantai dengan panorama sunset yang memukau dan suasana yang cocok untuk bersantai bersama keluarga.",
    actionLabel: "Buka di Maps",
    actionIcon: "fa-location-arrow",
    href: "https://maps.google.com/?q=Pantai+Majala+Sabu+Raijua",
  },
  {
    title: "Pantai Napae",
    image: "/assets/images/pantai-napae.webp",
    alt: "Pantai Napae",
    badge: "Alami",
    description:
      "Pantai alami dengan suasana damai yang menawarkan pengalaman menikmati pesona laut Pulau Sabu.",
    actionLabel: "Buka di Maps",
    actionIcon: "fa-location-arrow",
    href: "https://maps.google.com/?q=Pantai+Napae+Sabu+Raijua",
  },
  {
    title: "Telaga Porohahu",
    image: "/assets/images/telaga-porohahu.webp",
    alt: "Telaga Porohahu",
    badge: "Danau",
    description:
      "Telaga alami dengan suasana tenang yang menjadi destinasi menarik untuk menikmati keindahan alam lokal.",
    actionLabel: "Buka di Maps",
    actionIcon: "fa-location-arrow",
    href: "https://maps.google.com/?q=Telaga+Porohahu+Sabu+Raijua",
  },
  {
    title: "Skyber",
    image: "/assets/images/Skyber.webp",
    alt: "Skyber",
    badge: "Modern",
    description:
      "Destinasi wisata modern dengan pengalaman rekreasi yang menawarkan sudut pandang unik menikmati Pulau Sabu.",
    actionLabel: "Buka di Maps",
    actionIcon: "fa-location-arrow",
    href: "https://maps.google.com/?q=Skyber+Sabu+Raijua",
  },
];

export default function DestinasiWisataPage() {
  return (
    <div className="bg-[#111928] text-gray-200">
      <PageHero
        backgroundImage="/assets/images/hero-bg.webp"
        gradient="linear-gradient(to bottom, rgba(17, 25, 40, 0.9) 0%, rgba(17, 25, 40, 1) 100%)"
        breadcrumbs={[
          { href: "/", label: "Beranda" },
          { href: "/jelajah-sabu", label: "Jelajah Sabu" },
          { label: "Destinasi Wisata" },
        ]}
        title={
          <>
            Destinasi <span className="italic text-[#facc15]">Wisata Pilihan</span>
          </>
        }
        description="Jelajahi keajaiban geologi, situs budaya leluhur, dan bentangan pantai pasir putih yang masih alami di Sabu Raijua."
      />

      <main className="mx-auto max-w-7xl flex-grow px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((item) => {
            const isInternal = item.href.startsWith("/");
            const Action = isInternal ? Link : "a";
            const actionProps = isInternal
              ? { href: item.href }
              : { href: item.href, target: "_blank", rel: "noreferrer" };

            return (
              <article
                key={item.title}
                className="flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#1f2937] shadow-2xl transition duration-300 hover:-translate-y-2 hover:border-[#facc15]"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition duration-700 hover:scale-110"
                  />
                  <div className="absolute right-4 top-4 rounded-full bg-[#facc15] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#111928]">
                    {item.badge}
                  </div>
                </div>

                <div className="flex flex-grow flex-col p-8">
                  <h3 className="mb-4 text-2xl text-white" style={serifStyle}>
                    {item.title}
                  </h3>
                  <p className="mb-8 flex-grow text-sm leading-relaxed text-gray-400">
                    {item.description}
                  </p>
                  <Action
                    {...actionProps}
                    className="group inline-flex items-center gap-3 font-medium text-[#facc15] transition hover:text-white"
                  >
                    {item.actionLabel}
                    <i
                      className={`fa-solid ${item.actionIcon} text-sm transition-transform group-hover:translate-x-1`}
                    ></i>
                  </Action>
                </div>
              </article>
            );
          })}
        </div>

        <div className="relative mt-20 overflow-hidden rounded-3xl border border-gray-800 bg-[#1f2937] p-8 text-center md:p-12">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-[#facc15] to-transparent"></div>
          <h2 className="mb-4 text-3xl text-white" style={serifStyle}>
            Siap Menjelajahi Sabu Raijua?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-sm text-gray-400 md:text-base">
            Dapatkan informasi transportasi dan akomodasi terbaik untuk menunjang
            perjalanan Anda.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/transportasi-akses"
              className="rounded-full bg-[#facc15] px-8 py-3 font-bold text-[#111928] shadow-lg transition hover:scale-105"
            >
              Transportasi
            </Link>
            <Link
              href="/akomodasi-penginapan"
              className="rounded-full bg-white/10 px-8 py-3 font-bold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              Penginapan
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
