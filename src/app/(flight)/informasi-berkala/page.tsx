import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { PageHero, serifStyle } from "../_components/info-page-shell";

const quickStats = [
  { label: "Kode IATA", value: "SAU", icon: "fa-plane-departure" },
  { label: "Kode ICAO", value: "WATS", icon: "fa-tower-observation" },
  { label: "Operasional", value: "06.00 - 18.00", icon: "fa-clock" },
  { label: "Runway", value: "900m x 23m", icon: "fa-road" },
];

const profileHighlights = [
  "Bandar Udara Tardamu Sabu merupakan bandar udara perintis yang melayani konektivitas masyarakat Kabupaten Sabu Raijua dengan wilayah Nusa Tenggara Timur.",
  "Bandara berperan sebagai simpul mobilitas penumpang, distribusi logistik, pelayanan pemerintahan, serta dukungan pembukaan akses pariwisata daerah.",
  "Pengelolaan layanan mengutamakan keselamatan, keamanan, pelayanan, dan kepatuhan terhadap standar penerbangan sipil.",
];

const taskStatement =
  "Menyelenggarakan pelayanan penerbangan dengan selamat, aman, nyaman dan sesuai aturan yang berlaku (3S+1C).";

const functionItems = [
  {
    title: "Transportasi",
    description:
      "Bandar Udara Tardamu Sabu berfungsi sebagai titik utama transportasi udara di Kabupaten Sabu Raijua. Bandara ini memfasilitasi perjalanan penumpang dan pengiriman barang menuju wilayah kepulauan, serta memperkuat konektivitas regional dengan rute domestik di Nusa Tenggara Timur.",
    icon: "fa-route",
  },
  {
    title: "Pertahanan",
    description:
      "Bandar Udara Tardamu Sabu memiliki peran strategis dalam mendukung pertahanan dan keamanan wilayah kepulauan. Fasilitas bandara dapat menunjang kegiatan pengawasan, pengendalian wilayah, serta mobilisasi personel dan sumber daya ketika diperlukan respons cepat.",
    icon: "fa-shield-halved",
  },
  {
    title: "Tanggap Bencana",
    description:
      "Bandar Udara Tardamu Sabu berfungsi sebagai simpul tanggap bencana dalam situasi darurat. Fasilitas ini dapat digunakan untuk pengiriman bantuan kemanusiaan, evakuasi korban, dan pergerakan tim tanggap darurat di wilayah Sabu Raijua dan sekitarnya.",
    icon: "fa-truck-medical",
  },
];

const leaderHistory = [
  {
    period: "01 April 1989 - 07 Februari 1997",
    name: "Theo Filus",
    role: "Kepala Kantor UPBU Tardamu Sabu Raijua",
    photo: "/assets/images/pegawai/pak theo.webp",
    initials: "TF",
  },
  {
    period: "07 Februari 1997 - 13 Juni 2008",
    name: "Hyronimus Obe Topan",
    role: "Kepala Kantor UPBU Tardamu Sabu Raijua",
    photo: "/assets/images/pegawai/pak topan.webp",
    initials: "HOT",
  },
  {
    period: "13 Juni 2008 - 11 Juli 2011",
    name: "Herman Joseph",
    role: "Kepala Kantor UPBU Tardamu Sabu Raijua",
    photo: "/assets/images/pegawai/pak herman.webp",
    initials: "HJ",
  },
  {
    period: "11 Juli 2011 - 01 November 2013",
    name: "Ikshan, S.Sos",
    role: "Kepala Kantor UPBU Tardamu Sabu Raijua",
    photo: "/assets/images/pegawai/pak ikshan.webp",
    initials: "I",
  },
  {
    period: "1 November 2013 - 25 Januari 2019",
    name: "Muhammad Arwin Sofiansyah S.SiT",
    role: "Kepala Kantor UPBU Tardamu Sabu Raijua",
    photo: "/assets/images/pegawai/pak arwin.webp",
    initials: "MAS",
  },
  {
    period: "25 Januari 2019 - 19 Agustus 2020",
    name: "Yulius Kismono, SE",
    role: "Kepala Kantor UPBU Tardamu Sabu Raijua",
    photo: "/assets/images/pegawai/pak yulius.webp",
    initials: "YK",
  },
  {
    period: "19 Agustus 2020 - 1 September 2022",
    name: "Agustinus",
    role: "Kepala Kantor UPBU Tardamu Sabu Raijua",
    photo: "/assets/images/pegawai/pak agustinus.webp",
    initials: "A",
  },
  {
    period: "7 Agustus 2023 - 9 Mei 2025",
    name: "I Made Sutamayasa, S.E., M.M.",
    role: "Kepala Kantor UPBU Tardamu Sabu Raijua",
    photo: "/assets/images/pegawai/pak made.webp",
    initials: "IMS",
  },
  {
    period: "2025 - Sekarang",
    name: "David Benjamin Messakh, S.H.",
    role: "Kepala Kantor UPBU Tardamu Sabu Raijua",
    photo: "/assets/images/pegawai/pak david2.webp",
    initials: "D",
  },
];

const organizationBranches = {
  left: [
    "Analis Sumber Daya Manusia Aparatur Ahli Pertama",
    "Pengevaluasi Keselamatan dan Keamanan Bandar Udara Bidang Avsec",
    "Teknisi Penerbangan Pelaksana",
    "Penelaah Teknis Kebijakan",
    "Pengevaluasi Keselamatan dan Keamanan Bandar Udara Bidang PKP-PK",
    "Pengawas Personel Penerbangan Bidang PKP-PK",
    "Pengawas Operasional Bandar Udara",
    "Pengawas Personel Penerbangan Bidang Avsec"
  ],
  right: [
    "Teknisi Penerbangan Terampil",
    "Teknisi Listrik Bandara",
    "Penata Layanan Operasional",
    "Pengelola Layanan Operasional",
    "Pengadministrasi Perkantoran",
    "Operator Layanan Operasional",
    "Tenaga Medis",
    "Pengelola Rumah Tangga dan Tata Usaha",
    "Petugas PKP-PK Bandara",
    "Petugas Hygiene dan Sanitasi",
    "Pemelihara Bangunan dan Landasan",
    "Petugas Elektro Bandara",
    "Petugas Listrik Bandara"
  ]
};

const officials = [
  {
    name: "David Benjamin Messakh, S.H.",
    title: "Kepala Kantor UPBU Tardamu",
    photo: "/assets/images/pegawai/pak david1.webp",
    focus: "Koordinasi strategis, keselamatan, keamanan, pelayanan, dan kepatuhan operasional bandara.",
    description:
      "Memimpin arah pelayanan Kantor UPBU Tardamu Sabu melalui penguatan keselamatan operasi, koordinasi lintas unit, serta peningkatan kualitas layanan publik yang responsif bagi masyarakat Sabu Raijua.",
    badge: "Pimpinan Kantor",
    icon: "fa-compass-drafting",
  },
  {
    name: "Gusti Ngurah Budiarta, S.H.",
    title: "Kepala Tata Usaha",
    initials: "GB",
    focus: "Tata usaha, kepegawaian, arsip, perencanaan, keuangan, dan dukungan administrasi kantor.",
    description:
      "Mengawal tata kelola administrasi kantor agar proses perencanaan, pengarsipan, kepegawaian, dan dukungan anggaran berjalan tertib, transparan, dan selaras dengan kebutuhan operasional bandara.",
    badge: "Administrasi & Tata Kelola",
    icon: "fa-folder-open",
  },
  {
    name: "Firminianus Reginaldus, A.Ma",
    title: "Kepala TOKPD",
    photo: "/assets/images/pegawai/pak fridus.webp",
    focus: "Teknik, operasi, keamanan, pelayanan darurat, serta koordinasi kesiapan fasilitas operasional.",
    description:
      "Menjaga kesiapan teknis dan operasional fasilitas bandara, mulai dari koordinasi sisi udara, keamanan, pelayanan darurat, hingga pemeliharaan sarana pendukung operasi harian.",
    badge: "Operasi & Kesiapan Fasilitas",
    icon: "fa-tower-observation",
  },
];

const reportGroups = [
  {
    title: "Laporan Tahunan",
    icon: "fa-chart-line",
    summary: "Pertanggungjawaban pelaksanaan kebijakan, capaian layanan, dan evaluasi kinerja kantor.",
    files: [
      { label: "LAPORAN TAHUNAN 2024", href: "/assets/pdf/laporan/LAKIP 2024.pdf" },
      { label: "LAPORAN TAHUNAN 2025", href: "/assets/pdf/laporan/LAKIP 2025.pdf" },
    ],
  },
  {
    title: "Rencana Kerja Anggaran",
    icon: "fa-clipboard-list",
    summary: "Rencana kerja, program, kegiatan, DIPA, RKA-KL, dan monitoring pelaksanaan anggaran.",
    files: [
      {
        label: "Rencana Kerja Anggaran 2024",
        href: "/assets/pdf/regulasi/rencana-kerja-anggaran-2024.pdf",
      },
      {
        label: "Rencana Kerja Anggaran 2025",
        href: "/assets/pdf/regulasi/rencana-kerja-anggaran-2025.pdf",
      },
    ],
  },
  {
    title: "Laporan Keuangan",
    icon: "fa-scale-balanced",
    summary: "Realisasi anggaran, neraca, catatan atas laporan keuangan, dan informasi BMN.",
    files: [
      {
        label: "Laporan Keuangan 2024",
        href: "/assets/pdf/regulasi/laporan-keuangan-2024.pdf",
      },
      {
        label: "Laporan Keuangan 2025",
        href: "/assets/pdf/regulasi/laporan-keuangan-2025.pdf",
      },
    ],
  },
];

const complaintChannels = [
  { label: "Email PPID", value: "bandaratardamu@gmail.com", icon: "fa-envelope" },
  { label: "WhatsApp Kantor", value: "+62 857-0719-0065", icon: "fa-brands fa-whatsapp" },
  { label: "Call Center Kemenhub", value: "151", icon: "fa-headset" },
  { label: "SP4N LAPOR!", value: "lapor.go.id", icon: "fa-bullhorn" },
];

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
}) {
  return (
    <div className="mb-12 max-w-3xl">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#facc15]">
        {eyebrow}
      </p>
      <h2 className="text-3xl leading-tight text-white md:text-5xl" style={serifStyle}>
        {title}
      </h2>
      {description && <p className="mt-5 text-base leading-8 text-gray-400">{description}</p>}
    </div>
  );
}

function PersonPhoto({
  name,
  photo,
  initials,
  className = "",
}: {
  name: string;
  photo?: string;
  initials?: string;
  className?: string;
}) {
  if (photo) {
    return (
      <div className={`relative h-full w-full ${className}`}>
        <Image
          src={photo}
          alt={name}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-top"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-[#facc15]/10 text-2xl font-black text-[#facc15] ${className}`}
      aria-label={name}
    >
      {initials}
    </div>
  );
}

export default function InformasiBerkalaPage() {
  return (
    <div className="bg-[#111928] text-gray-200">
      <style>{`
        @keyframes berkalaFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .berkala-reveal {
          animation: berkalaFadeUp 720ms ease both;
        }

        .org-node {
          position: relative;
        }

        .org-node::before {
          content: "";
          position: absolute;
          top: 50%;
          width: 42px;
          height: 1px;
          background: rgba(250, 204, 21, 0.42);
        }

        .org-node-left::before {
          right: -42px;
        }

        .org-node-right::before {
          left: -42px;
        }

        .leader-timeline-row {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 84px 1fr;
          min-height: 170px;
          align-items: center;
        }

        .leader-timeline-row::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1px;
          transform: translateX(-50%);
          background-image: linear-gradient(to bottom, rgba(250, 204, 21, 0.45) 45%, transparent 45%);
          background-size: 1px 8px;
        }

        .leader-timeline-dot {
          position: relative;
          z-index: 2;
          margin: 0 auto;
          height: 30px;
          width: 30px;
          border-radius: 999px;
          border: 3px solid #111928;
          background: #facc15;
          box-shadow: 0 0 0 1px rgba(250, 204, 21, 0.8), 0 0 28px rgba(250, 204, 21, 0.5);
        }

        .leader-initial-ring {
          height: 132px;
          width: 132px;
          border-radius: 999px;
          border: 1px solid rgba(250, 204, 21, 0.7);
          background: rgba(64, 72, 58, 0.72);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
        }

        .official-section {
          position: relative;
          isolation: isolate;
        }

        .official-section::before {
          content: "";
          position: absolute;
          inset: 18px;
          z-index: -1;
          border-radius: 34px;
          background:
            radial-gradient(circle at 16% 18%, rgba(250, 204, 21, 0.16), transparent 30%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
          opacity: 0.72;
        }

        .official-photo-frame {
          box-shadow: 0 28px 90px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 1023px) {
          .org-node::before {
            display: none;
          }

          .leader-timeline-row {
            grid-template-columns: 42px 1fr;
            min-height: auto;
            gap: 18px;
            padding: 22px 0;
          }

          .leader-timeline-row::before {
            left: 20px;
          }

          .leader-timeline-dot {
            grid-column: 1;
            grid-row: 1;
            height: 22px;
            width: 22px;
          }

          .leader-mobile-card {
            grid-column: 2;
          }

          .leader-initial-ring {
            height: 92px;
            width: 92px;
          }
        }
      `}</style>

      <PageHero
        backgroundImage="/assets/images/Terminal.webp"
        gradient="linear-gradient(to bottom, rgba(17, 25, 40, 0.7), rgba(17, 25, 40, 0.98))"
        breadcrumbs={[
          { href: "/", label: "Beranda" },
          { href: "/informasi", label: "Informasi" },
          { label: "Informasi Berkala" },
        ]}
        title={
          <>
            Informasi <span className="italic text-[#facc15]">Berkala</span>
            <br />
            UPBU Tardamu Sabu
          </>
        }
        description="Ruang informasi berkala Kantor UPBU Tardamu Sabu yang merangkum profil kantor, tugas fungsi, struktur organisasi, pejabat, laporan, dan kanal pengaduan."
      />

      <main className="overflow-hidden">
        <section className="border-b border-white/5 bg-[#111928] py-10">
          <div className="mx-auto flex max-w-7xl flex-wrap gap-3 px-6">
            {[
              ["Profil", "#profil"],
              ["Tugas Fungsi", "#tugas-fungsi"],
              ["Kepala Bandara", "#kepala-bandara"],
              ["Struktur", "#struktur"],
              ["Pejabat", "#pejabat"],
              ["Laporan", "#laporan"],
              ["Pengaduan", "#pengaduan"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-gray-300 transition hover:border-[#facc15] hover:bg-[#facc15] hover:text-[#111928]"
              >
                {label}
              </a>
            ))}
          </div>
        </section>

        <section id="profil" className="py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="berkala-reveal overflow-hidden rounded-[36px] border border-white/5 bg-[#1f2937]/40 shadow-2xl">
              <div className="relative h-[420px] w-full">
                <Image
                  src="/assets/images/terminal hero.webp"
                  alt="Terminal Bandara Tardamu Sabu"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-2 border-t border-white/5 md:grid-cols-4">
                {quickStats.map((item) => (
                  <div key={item.label} className="border-white/5 p-5 md:border-r">
                    <i className={`fa-solid ${item.icon} mb-4 text-xl text-[#facc15]`}></i>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionHeading
                eyebrow="Profil Kantor"
                title={
                  <>
                    Pintu konektivitas udara untuk{" "}
                    <span className="italic text-[#facc15]">Sabu Raijua</span>
                  </>
                }
                description="Kantor UPBU Tardamu Sabu mengelola penyelenggaraan pelayanan bandar udara dengan fokus pada keselamatan operasi, keamanan penerbangan, dan layanan publik yang akuntabel."
              />

              <div className="space-y-5">
                {profileHighlights.map((item, index) => (
                  <div key={item} className="flex gap-5 rounded-2xl border border-white/5 bg-[#1f2937]/35 p-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#facc15] text-xs font-black text-[#111928]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm leading-7 text-gray-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="tugas-fungsi" className="border-y border-white/5 bg-[#1f2937]/25 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading
              eyebrow="Tugas dan Fungsi"
              title={
                <>
                  Pelayanan penerbangan dengan prinsip{" "}
                  <span className="italic text-[#facc15]">3S+1C</span>
                </>
              }
              description="Tugas dan fungsi Kantor UPBU Tardamu Sabu disajikan sebagai informasi berkala agar masyarakat memahami peran bandara dalam konektivitas, keamanan wilayah, dan kesiapsiagaan darurat."
            />

            <div className="mb-8 rounded-[30px] border border-[#facc15]/30 bg-[#111928]/80 p-8 shadow-[0_24px_90px_rgba(0,0,0,0.18)]">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#facc15] text-2xl text-[#111928]">
                <i className="fa-solid fa-plane-circle-check"></i>
              </div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-[#facc15]">
                Tugas
              </p>
              <h3 className="max-w-4xl text-2xl leading-snug text-white md:text-4xl" style={serifStyle}>
                {taskStatement}
              </h3>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {functionItems.map((item) => (
                <article
                  key={item.title}
                  className="group rounded-[28px] border border-white/5 bg-[#111928]/70 p-8 transition hover:-translate-y-1 hover:border-[#facc15]/70"
                >
                  <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#facc15]/10 text-2xl text-[#facc15] transition group-hover:bg-[#facc15] group-hover:text-[#111928]">
                    <i className={`fa-solid ${item.icon}`}></i>
                  </div>
                  <h3 className="mb-4 text-2xl text-white" style={serifStyle}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-7 text-gray-400">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="kepala-bandara" className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading
              eyebrow="Riwayat Kepala Bandara"
              title={
                <>
                  Kepemimpinan dari{" "}
                  <span className="italic text-[#facc15]">tahun ke tahun</span>
                </>
              }
              description="Riwayat kepemimpinan Kantor UPBU Tardamu Sabu disusun dalam alur waktu agar mudah dipindai dari periode terbaru ke periode sebelumnya."
            />

            <div className="rounded-[36px] border border-white/5 bg-[#0b1220]/45 px-6 py-8 shadow-2xl md:px-10">
              {leaderHistory.map((leader, index) => {
                const textOnLeft = index % 2 === 0;
                const textBlock = (
                  <div className={`leader-mobile-card ${textOnLeft ? "lg:text-left" : "lg:text-right"}`}>
                    <span className="inline-flex rounded-full bg-[#facc15]/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.22em] text-[#facc15]">
                      {leader.period}
                    </span>
                    <h3 className="mt-4 text-2xl leading-tight text-white" style={serifStyle}>
                      {leader.name}
                    </h3>
                    <p className="mt-3 text-[11px] font-black uppercase tracking-[0.18em] text-gray-500">
                      {leader.role}
                    </p>
                  </div>
                );
                const initialBlock = (
                  <div className={`leader-mobile-card flex lg:justify-center`}>
                    <div className="leader-initial-ring relative flex shrink-0 items-center justify-center overflow-hidden text-lg font-black text-[#facc15]">
                      {leader.photo ? (
                        <Image
                          src={leader.photo}
                          alt={leader.name}
                          fill
                          sizes="96px"
                          className="object-cover object-top"
                        />
                      ) : (
                        leader.initials
                      )}
                    </div>
                  </div>
                );

                return (
                  <div key={`${leader.period}-${leader.name}`} className="leader-timeline-row">
                    <div className="hidden lg:block">{textOnLeft ? textBlock : initialBlock}</div>
                    <div className="leader-timeline-dot"></div>
                    <div className="hidden lg:block">{textOnLeft ? initialBlock : textBlock}</div>

                    <div className="leader-mobile-card flex items-center gap-5 lg:hidden">
                      <div className="leader-initial-ring relative flex shrink-0 items-center justify-center overflow-hidden text-base font-black text-[#facc15]">
                        {leader.photo ? (
                          <Image
                            src={leader.photo}
                            alt={leader.name}
                            fill
                            sizes="80px"
                            className="object-cover object-top"
                          />
                        ) : (
                          leader.initials
                        )}
                      </div>
                      {textBlock}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="struktur" className="border-y border-white/5 bg-[#1f2937]/25 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-14 text-center">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#facc15]">
                Struktur Organisasi
              </p>
              <h2 className="text-3xl leading-tight text-white md:text-5xl" style={serifStyle}>
                Kantor UPBU <span className="italic text-[#facc15]">Tardamu Sabu</span>
              </h2>
            </div>

            <div className="relative mx-auto max-w-6xl rounded-[36px] border border-white/5 bg-[#111928]/70 p-5 shadow-2xl md:p-10">
              <div className="pointer-events-none absolute left-1/2 top-[116px] hidden h-[calc(100%-180px)] w-px bg-[#facc15]/35 lg:block"></div>
              <div className="mb-12 flex justify-center">
                <div className="w-full max-w-sm rounded-2xl border border-[#facc15]/60 bg-[#facc15] p-6 text-center text-[#111928] shadow-[0_20px_80px_rgba(250,204,21,0.18)]">
                  <i className="fa-solid fa-user-tie mb-4 text-3xl"></i>
                  <p className="text-xs font-black uppercase tracking-[0.2em]">Kepala Kantor</p>
                  <h3 className="mt-2 text-xl font-black">UPBU Tardamu Sabu</h3>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-[1fr_120px_1fr] lg:items-start">
                <div className="space-y-5">
                  {organizationBranches.left.map((item) => (
                    <div
                      key={item}
                      className="org-node org-node-left rounded-2xl border border-white/10 bg-[#1f2937] p-5 text-center text-sm font-semibold leading-6 text-white"
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div className="hidden justify-center pt-8 lg:flex">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#facc15]/50 bg-[#111928] text-[#facc15]">
                    <i className="fa-solid fa-sitemap text-2xl"></i>
                  </div>
                </div>

                <div className="space-y-5">
                  {organizationBranches.right.map((item) => (
                    <div
                      key={item}
                      className="org-node org-node-right rounded-2xl border border-white/10 bg-[#1f2937] p-5 text-center text-sm font-semibold leading-6 text-white"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pejabat" className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading
              eyebrow="Profil Pejabat"
              title={
                <>
                  Pejabat utama{" "}
                  <span className="italic text-[#facc15]">Kantor UPBU Tardamu</span>
                </>
              }
              description="Setiap pejabat memiliki peran yang saling melengkapi dalam menjaga kesinambungan layanan, tata kelola, dan kesiapan operasional Bandara Tardamu Sabu."
            />

            <div className="space-y-10">
              {officials.map((official, index) => {
                const photoOnRight = index % 2 === 0;

                return (
                  <article
                    key={official.title}
                    className="official-section overflow-hidden rounded-[34px] border border-white/5 bg-[#0b1220]/55 p-4 shadow-2xl transition duration-300 hover:-translate-y-1 hover:border-[#facc15]/45 md:p-6"
                  >
                    <div
                      className={`grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch ${photoOnRight ? "lg:[&>.official-copy]:order-1 lg:[&>.official-visual]:order-2" : ""
                        }`}
                    >
                      <div className="official-visual min-h-[360px] overflow-hidden rounded-[28px] border border-white/10 bg-[#111928] md:min-h-[430px]">
                        <PersonPhoto
                          name={official.name}
                          photo={official.photo}
                          initials={official.initials}
                          className="official-photo-frame transition duration-700 hover:scale-105"
                        />
                      </div>

                      <div className="official-copy flex min-h-[360px] flex-col justify-center rounded-[28px] border border-white/5 bg-[#111928]/85 p-7 md:p-10">
                        <div className="mb-8 flex flex-wrap items-center gap-3">
                          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#facc15] text-xl text-[#111928] shadow-[0_18px_50px_rgba(250,204,21,0.22)]">
                            <i className={`fa-solid ${official.icon}`}></i>
                          </span>
                          <span className="rounded-full border border-[#facc15]/25 bg-[#facc15]/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#facc15]">
                            {official.badge}
                          </span>
                        </div>

                        <p className="mb-4 text-[11px] font-black uppercase tracking-[0.22em] text-[#facc15]">
                          {official.title}
                        </p>
                        <h3 className="max-w-2xl text-3xl leading-tight text-white md:text-5xl" style={serifStyle}>
                          {official.name}
                        </h3>
                        <p className="mt-6 max-w-3xl text-base leading-8 text-gray-300">
                          {official.description}
                        </p>

                        <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.03] p-5">
                          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                            Fokus Tanggung Jawab
                          </p>
                          <p className="text-sm leading-7 text-gray-300">{official.focus}</p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="laporan" className="border-y border-white/5 bg-[#1f2937]/25 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading
              eyebrow="Laporan Publik"
              title={
                <>
                  Dokumen kinerja, anggaran, dan{" "}
                  <span className="italic text-[#facc15]">keuangan</span>
                </>
              }
              description="Ringkasan kategori laporan berkala. Dokumen publik yang sudah tersedia dapat diakses melalui halaman laporan dan layanan informasi."
            />

            <div className="grid gap-6 lg:grid-cols-3">
              {reportGroups.map((group) => (
                <article key={group.title} className="rounded-[28px] border border-white/5 bg-[#111928]/70 p-8">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#facc15]/10 text-2xl text-[#facc15]">
                    <i className={`fa-solid ${group.icon}`}></i>
                  </div>
                  <h3 className="mb-4 text-2xl text-white" style={serifStyle}>
                    {group.title}
                  </h3>
                  <p className="mb-7 text-sm leading-7 text-gray-400">{group.summary}</p>
                  <div className="space-y-3">
                    {group.files.map((file) => (
                      <a
                        key={file.href}
                        href={`${file.href}#toolbar=1&navpanes=0`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-sm text-gray-300 transition hover:border-[#facc15]/70 hover:bg-[#facc15]/10 hover:text-white"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                          <i className="fa-solid fa-file-pdf"></i>
                        </span>
                        <span className="min-w-0 flex-1 leading-6">{file.label}</span>
                        <i className="fa-solid fa-eye text-xs text-gray-500 transition group-hover:text-[#facc15]"></i>
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/laporan"
                className="inline-flex items-center gap-3 rounded-full bg-[#facc15] px-6 py-3 text-sm font-bold text-[#111928] transition hover:-translate-y-1"
              >
                Buka Laporan Publik <i className="fa-solid fa-arrow-right text-xs"></i>
              </Link>
              <Link
                href="/layanan-informasi#formulir"
                className="inline-flex items-center gap-3 rounded-full border border-white/10 px-6 py-3 text-sm font-bold text-white transition hover:border-[#facc15] hover:text-[#facc15]"
              >
                Ajukan Permohonan Dokumen
              </Link>
            </div>
          </div>
        </section>

        <section id="pengaduan" className="py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <SectionHeading
                eyebrow="Informasi dan Pengaduan"
                title={
                  <>
                    Kanal resmi untuk{" "}
                    <span className="italic text-[#facc15]">bertanya dan melapor</span>
                  </>
                }
                description="Masyarakat dapat menyampaikan permohonan informasi, masukan layanan, atau pengaduan melalui kanal resmi Kantor UPBU Tardamu dan kanal nasional Kementerian Perhubungan."
              />
              <Link
                href="/layanan-informasi#pengaduan"
                className="inline-flex items-center gap-3 rounded-full bg-[#facc15] px-6 py-3 text-sm font-bold text-[#111928] transition hover:-translate-y-1"
              >
                Lihat Prosedur Pengaduan <i className="fa-solid fa-arrow-right text-xs"></i>
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {complaintChannels.map((channel) => (
                <div key={channel.label} className="rounded-[26px] border border-white/5 bg-[#1f2937]/45 p-7">
                  <i className={`fa-solid ${channel.icon} mb-6 text-3xl text-[#facc15]`}></i>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-500">
                    {channel.label}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-white">{channel.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
