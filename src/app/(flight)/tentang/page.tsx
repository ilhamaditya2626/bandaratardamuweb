import Image from "next/image";
import Link from "next/link";
import { PageHero, serifStyle } from "../_components/info-page-shell";

const specs = [
  { icon: "fa-plane-up", label: "IATA Code", value: "SAU" },
  { icon: "fa-plane-circle-check", label: "ICAO Code", value: "WATS" },
  { icon: "fa-map-location-dot", label: "Lokasi", value: "Seba, Sabu Raijua" },
  { icon: "fa-clock", label: "Operasional", value: "07.00 - 15.00 WITA" },
  { icon: "fa-road", label: "Runway", value: "900m x 23m" },
  { icon: "fa-shield-halved", label: "Pengelola", value: "UPT Ditjen Hubud" },
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

const missionItems = [
  {
    letter: "A",
    icon: "fa-shield-halved",
    title: "Keselamatan & Keamanan",
    badge: "Misi 01 • Keselamatan",
    text: "Mewujudkan keselamatan dan keamanan penerbangan di bandar udara;",
  },
  {
    letter: "B",
    icon: "fa-plane-circle-check",
    title: "Sarana & Prasarana",
    badge: "Misi 02 • Keandalan Sarpras",
    text: "Meningkatnya sarana dan prasarana bandar udara yang andal dan optimal;",
  },
  {
    letter: "C",
    icon: "fa-user-tie",
    title: "Pelayanan & SDM",
    badge: "Misi 03 • Pelayanan Berkualitas",
    text: "Mewujudkan pelayanan jasa kebandarudaraan yang berkualitas dengan didukung oleh SDM yang profesional;",
  },
  {
    letter: "D",
    icon: "fa-scale-balanced",
    title: "Kinerja Administrasi",
    badge: "Misi 04 • Akuntabilitas & Keuangan",
    text: "Meningkatkan kinerja administrasi dan keuangan yang terukur dan akuntabel.",
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
            <span className="italic text-[#facc15]">Bandar Udara Tardamu </span>
          </>
        }
        description="Menghubungkan Kepulauan Sabu Raijua dengan dunia melalui standar keselamatan tinggi dan pelayanan yang tulus."
      />

      <main className="py-20">
        {/* Section Visi & Misi */}
        <section className="mx-auto mb-32 max-w-7xl px-6">
          <div className="mb-14 text-center">
            <h2 className="mt-4 text-3xl font-bold text-white md:text-5xl" style={serifStyle}>
              Visi &amp; <span className="italic text-[#facc15]">Misi</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-400 md:text-base">
              Pedoman strategis UPBU Kelas III Tardamu dalam menyelenggarakan transportasi udara yang aman, andal, dan berdaya saing bagi masyarakat Sabu Raijua.
            </p>
          </div>

          {/* Visi Card */}
          <div className="relative mb-10 overflow-hidden rounded-[36px] border border-white/10 bg-[#1f2937]/50 p-8 shadow-2xl backdrop-blur-md md:p-12">
            <i className="fa-solid fa-quote-right pointer-events-none absolute bottom-6 right-8 text-7xl text-white/[0.03] md:text-9xl"></i>

            <div className="relative z-10">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2.5 rounded-xl border border-[#facc15]/30 bg-[#facc15]/10 px-3.5 py-1.5">
                  <i className="fa-solid fa-eye text-xs text-[#facc15]"></i>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#facc15]">
                    Visi Kantor UPBU Kelas III Tardamu Sabu
                  </span>
                </div>
                <span className="text-xs text-gray-500">Kementerian Perhubungan Republik Indonesia</span>
              </div>

              <blockquote className="my-4">
                <p
                  className="text-xl font-medium leading-relaxed text-white md:text-2xl lg:text-3xl"
                  style={serifStyle}
                >
                  “Terwujudnya penyelenggaraan jasa kebandarudaraan sesuai dengan standar keselamatan, keamanan dan pelayanan Bandar Udara dalam mewujudkan visi dan misi Direktorat Jenderal Perhubungan Udara yaitu{" "}
                  <span className="text-[#facc15] underline decoration-[#facc15]/40 underline-offset-8">
                    Konektivitas Transportasi Udara yang Handal, Berdaya Saing, dan Memberikan Nilai Tambah
                  </span>{" "}
                  guna mendukung Visi dan Misi Presiden dan Wakil Presiden.”
                </p>
              </blockquote>
            </div>
          </div>

          {/* Pengantar Misi */}
          <div className="mb-6 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#facc15]"></span>
            <p className="text-sm font-medium text-gray-300 md:text-base">
              Untuk mewujudkan visi tersebut, dirumuskan misi Kantor UPBU Kelas III Tardamu Sabu yaitu:
            </p>
          </div>

          {/* Misi Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {missionItems.map((item) => (
              <div
                key={item.letter}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-white/10 bg-[#1f2937]/40 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#facc15]/50 hover:bg-[#1f2937]/75 hover:shadow-2xl hover:shadow-[#facc15]/5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-base font-black text-[#facc15] transition-all duration-300 group-hover:border-[#facc15] group-hover:bg-[#facc15] group-hover:text-[#111928] group-hover:shadow-lg group-hover:shadow-[#facc15]/20">
                      {item.letter}
                    </span>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#facc15]/10 text-[#facc15] transition-transform duration-300 group-hover:scale-110">
                      <i className={`fa-solid ${item.icon} text-xl`}></i>
                    </div>
                  </div>

                  <div className="mt-6">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      {item.badge}
                    </span>
                    <h3
                      className="mt-1.5 text-xl font-bold text-white transition-colors group-hover:text-[#facc15]"
                      style={serifStyle}
                    >
                      {item.title}
                    </h3>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-gray-300" style={{ textAlign: "justify" }}>
                    {item.text}
                  </p>
                </div>

                <div className="mt-8 pt-4">
                  <div className="h-0.5 w-12 rounded-full bg-[#facc15]/30 transition-all duration-500 group-hover:w-full group-hover:bg-[#facc15]"></div>
                </div>
              </div>
            ))}
          </div>
        </section>

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
                src="/assets/images/fasilitas/terminal lama1.webp"
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
