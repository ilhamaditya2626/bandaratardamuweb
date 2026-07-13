import Link from "next/link";
import { PageHero, serifStyle } from "../_components/info-page-shell";

const infoCards = [
  {
    href: "/informasi-berkala",
    icon: "fa-calendar-check",
    title: "Informasi Berkala",
    description:
      "Profil kantor, struktur organisasi, pejabat, laporan, dan kanal pengaduan resmi.",
    cta: "Lihat Informasi",
  },
  {
    href: "/berita",
    icon: "fa-newspaper",
    title: "Informasi Serta Merta",
    description:
      "Update harian mengenai operasional bandara, jadwal khusus, dan pengumuman resmi.",
    cta: "Selengkapnya",
  },
  {
    href: "/laporan",
    icon: "fa-file-invoice",
    title: "Laporan Publik",
    description:
      "Akses dokumen akuntabilitas, LAKIP, serta laporan kinerja tahunan UPBU Tardamu.",
    cta: "Unduh Dokumen",
  },
  {
    href: "/informasi-dikecualikan",
    icon: "fa-shield-halved",
    title: "Info Terbatas",
    description:
      "Daftar informasi yang dikecualikan sesuai dengan UU Keterbukaan Informasi Publik.",
    cta: "Lihat Regulasi",
  },
];

export default function InformasiPage() {
  return (
    <div className="bg-[#111928] text-gray-200">
      <PageHero
        backgroundImage="/assets/images/sabu.webp"
        breadcrumbs={[{ href: "/", label: "Beranda" }, { label: "Pusat Informasi" }]}
        title={
          <>
            Portal <br />
            <span className="italic text-[#facc15]">Informasi Publik</span>
          </>
        }
        description="Komitmen kami terhadap transparansi operasional dan layanan informasi yang akuntabel bagi seluruh stakeholder."
      />

      <main className="py-20">
        <section className="mx-auto mb-32 max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {infoCards.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col items-center rounded-[40px] border border-white/5 bg-[#1f2937]/40 p-10 text-center transition duration-300 hover:-translate-y-2 hover:border-[#facc15] hover:bg-[#1f2937]/80"
              >
                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#facc15]/10 transition group-hover:rotate-6 group-hover:bg-[#facc15] group-hover:text-[#111928]">
                  <i className={`fa-solid ${item.icon} text-3xl`}></i>
                </div>
                <h3 className="mb-4 text-2xl text-white" style={serifStyle}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">{item.description}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#facc15]">
                  {item.cta} <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-white/5 bg-[#1f2937]/30 py-24">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="mb-6 text-4xl leading-tight text-white" style={serifStyle}>
              Mewujudkan Tata Kelola <br />
              <span className="italic text-[#facc15]">Pemerintahan yang Terbuka</span>
            </h2>
            <div className="mx-auto mb-8 h-1 w-20 bg-[#facc15]"></div>
            <p className="text-lg italic leading-relaxed text-gray-400">
              &quot;Menyediakan informasi yang akurat, cepat, dan mudah diakses adalah
              prioritas kami dalam melayani masyarakat Sabu Raijua dan pengguna jasa
              penerbangan global.&quot;
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
