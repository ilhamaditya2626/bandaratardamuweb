import Image from "next/image";
import Link from "next/link";
import { PageHero, serifStyle } from "../_components/info-page-shell";

const specs = [
  { icon: "fa-plane-up", label: "IATA Code", value: "SAU" },
  { icon: "fa-plane-circle-check", label: "ICAO Code", value: "WATS" },
  { icon: "fa-map-location-dot", label: "Lokasi", value: "Seba, Sabu Raijua" },
  { icon: "fa-clock", label: "Operasional", value: "06:00 - 18:00" },
  { icon: "fa-road", label: "Runway", value: "900m x 23m" },
  { icon: "fa-shield-halved", label: "Pengelola", value: "UPT Hubud" },
];

const infoCards = [
  {
    href: "/fasilitas",
    icon: "fa-couch",
    title: "Fasilitas",
    description: "Informasi lengkap mengenai ruang tunggu dan layanan terminal.",
  },
  {
    href: "/regulasi",
    icon: "fa-scale-balanced",
    title: "Regulasi",
    description: "Panduan keamanan dan standar operasional penerbangan.",
  },
  {
    href: "/ppid",
    icon: "fa-circle-info",
    title: "PPID",
    description: "Akses keterbukaan informasi publik dan laporan resmi.",
  },
  {
    href: "/unit-kerja",
    icon: "fa-building-user",
    title: "Unit Kerja",
    description: "Informasi struktur dan layanan unit kerja Bandara Tardamu.",
  },
];

export default function TentangPage() {
  return (
    <div className="bg-[#111928] text-gray-200">
      <PageHero
        backgroundImage="assets/images/tentang.webp"
        breadcrumbs={[{ href: "/", label: "Beranda" }, { label: "Tentang" }]}
        title={
          <>
            Tentang <br />
            <span className="italic text-[#facc15]">Bandar Udara Tardamu</span>
          </>
        }
        description="Menghubungkan Kepulauan Sabu Raijua dengan dunia melalui standar keselamatan tinggi dan pelayanan yang tulus."
      />

      <main className="py-20">
        <section className="mx-auto mb-32 grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
          <div className="relative">
            <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-[#facc15]/20 blur-2xl"></div>
            <div className="relative z-10 h-[400px] w-full overflow-hidden rounded-[40px] border border-white/5 shadow-2xl">
              <Image
                src="/assets/images/Terminal.webp"
                alt="Terminal Bandara"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <h2 className="mb-8 text-4xl text-white" style={serifStyle}>
              Profil <span className="italic text-[#facc15]">Bandara</span>
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-gray-400" style={{ textAlign: "justify" }}>
              <p>
                Bandar Udara Tardamu Sabu merupakan bandar udara perintis yang berperan penting sebagai pintu gerbang transportasi udara di Kabupaten Sabu Raijua, NTT. Bandar Udara ini melayani penerbangan domestik yang menghubungkan Pulau Sabu Raijua dengan sejumlah wilayah di NTT, seperti Kupang, Waingapu, Ende, dan Rote guna mendukung mobilitas masyarakat serta distribusi barang dan logistik. Dengan fasilitas yang terus dikembangkan, bandar udara ini juga berfungsi meningkatkan konektivitas daerah, mendorong pertumbuhan ekonomi lokal, serta membuka akses pariwisata, dengan operasional yang mengutamakan keselamatan, keamanan, dan kenyamanan bagi para pengguna jasa.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto mb-32 grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-8 text-right text-4xl text-white" style={serifStyle}>
              Sejarah <span className="italic text-[#facc15]">Singkat</span>
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-gray-400" style={{ textAlign: "justify" }}>
              <p>
                Bandar Udara Tardamu pertama kali dibuka pada tahun 1966 sebagai bandar udara khusus berupa airstrip dengan permukaan rumput untuk melayani transportasi udara di Pulau Sabu. Seiring meningkatnya kebutuhan konektivitas masyarakat, pada tahun 1975 dilakukan peningkatan fasilitas melalui pendanaan APBN berupa pembangunan runway, apron, dan taxiway. Hingga saat ini, Bandar Udara Tardamu terus berkembang sebagai sarana transportasi udara yang mendukung mobilitas masyarakat, pelayanan pemerintahan, dan pertumbuhan ekonomi di Kabupaten Sabu Raijua.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#facc15]/20 blur-2xl"></div>
            <div className="relative z-10 h-[400px] w-full overflow-hidden rounded-[40px] border border-white/5 shadow-2xl">
              <Image
                src="/assets/images/fasilitas/terminal lama.webp"
                alt="Sejarah Bandara Tardamu"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto mb-32 max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-2 text-3xl text-white" style={serifStyle}>
              Spesifikasi Teknis
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-gray-500">
              Airport General Information
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {specs.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-white/5 bg-[#1f2937]/50 p-8 text-center transition hover:border-[#facc15]"
              >
                <i className={`fa-solid ${item.icon} mb-4 text-2xl text-[#facc15]`}></i>
                <p className="mb-1 text-[10px] uppercase tracking-widest text-gray-500">
                  {item.label}
                </p>
                <h3 className="text-sm font-bold leading-tight text-white">{item.value}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {infoCards.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col items-center rounded-[40px] border border-white/5 bg-[#1f2937]/40 p-10 text-center transition duration-300 hover:-translate-y-2 hover:border-[#facc15] hover:bg-[#1f2937]/80"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#facc15]/10 transition group-hover:bg-[#facc15] group-hover:text-[#111928]">
                  <i className={`fa-solid ${item.icon} text-2xl`}></i>
                </div>
                <h3 className="mb-4 text-2xl text-white" style={serifStyle}>
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
