import Image from "next/image";
import { PageHero, serifStyle } from "../_components/info-page-shell";

const leaderProfile = {
  name: "David Benjamin Messakh, S.H.",
  position: "Kepala Kantor UPBU Kelas III Tardamu Sabu",
  label: "Kepala Kantor UPBU Tardamu",
  image: "/assets/images/pegawai/pak david.webp",
  quote: "Visi kami adalah menjadikan Bandar Udara Tardamu sebagai gerbang konektivitas utama yang mengedepankan aspek Safety, Security, Services, and Compliance (3S + 1C) dalam setiap jengkal pelayanan.",
  bio: "Memimpin dengan dedikasi untuk memastikan seluruh unit kerja bersinergi dalam menghadirkan standar operasional penerbangan internasional bagi seluruh pengguna jasa.",
};
const workUnits = [
  {
    title: "Unit Administrasi",
    label: "Administrative Services",
    icon: "fa-folder-open",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
    description:
      "Unit Administrasi menjadi pusat tata kelola layanan internal bandara, memastikan persuratan, kepegawaian, arsip, pelaporan, dan dukungan logistik berjalan tertib, cepat, dan terdokumentasi.",
    duties: ["Tata usaha dan arsip", "Dukungan SDM", "Pelaporan layanan"],
  },
  {
    title: "Unit AVSEC",
    label: "Aviation Security",
    icon: "fa-shield-halved",
    image:
      "https://images.unsplash.com/photo-1585776245865-b92df54c6b25?q=80&w=2070&auto=format&fit=crop",
    description:
      "Unit AVSEC menjaga keamanan penerbangan melalui pemeriksaan penumpang dan barang, pengawasan area terminal, serta pengendalian akses menuju area terbatas bandara.",
    duties: ["Pemeriksaan keamanan", "Pengawasan akses", "Perlindungan objek vital"],
  },
  {
    title: "Unit PKP-PK",
    label: "Rescue & Fire Fighting",
    icon: "/assets/images/LOGO PKP.webp",
    image:
      "/assets/images/PKP.webp",
    description:
      "Unit PKP-PK bertanggung jawab pada kesiapsiagaan pertolongan kecelakaan penerbangan dan pemadam kebakaran, dengan personel serta peralatan yang disiapkan untuk respons cepat.",
    link: "https://sites.google.com/view/a3r0/aero",
    duties: ["Kesiapan darurat", "Pemadaman kebakaran", "Rescue operation"],
  },
  {
    title: "Unit Bangland",
    label: "Airport Civil Engineering",
    icon: "fa-compass-drafting",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2071&auto=format&fit=crop",
    description:
      "Unit Bangland memelihara bangunan, lahan, dan fasilitas fisik bandara agar seluruh area pelayanan dan area operasional tetap layak, aman, dan siap digunakan.",
    duties: ["Pemeliharaan bangunan", "Perawatan lahan", "Kelayakan fasilitas"],
  },
  {
    title: "Unit Listrik",
    label: "Airport Electrical Engineering",
    icon: "fa-bolt",
    image:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop",
    description:
      "Unit Listrik memastikan keandalan instalasi, panel, penerangan, dan sistem catu daya bandara untuk menjaga pelayanan terminal serta operasi penerbangan tetap stabil.",
    duties: ["Catu daya utama", "Penerangan area", "Genset dan panel"],
  },
  {
    title: "Unit Elektronika Bandara",
    label: "Airport Electronics",
    icon: "fa-radio",
    image:
      "https://images.unsplash.com/photo-1598032390384-684d00b2949d?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8f",
    description:
      "Unit Elektronika Bandara menjadi pusat tata kelola layanan komunikasi dan navigasi bandara.",
    duties: ["Navigasi", "Komunikasi bandara", "Elektronika"],
  },
  {
    title: "Unit Alat-Alat Berat",
    label: "Airport Mechanical Engineering",
    icon: "fa-gears",
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=2069&auto=format&fit=crop",
    description:
      "Unit Alat-Alat Berat menangani perawatan perangkat pendukung gedung dan peralatan teknis, sehingga sistem layanan penumpang dan fasilitas bandara bekerja optimal.",
    duties: ["Perawatan peralatan", "Sistem gedung", "Dukungan teknis"],
  },
  {
    title: "Unit Sanitasi",
    label: "Sanitation & Hygiene",
    icon: "fa-spray-can-sparkles",
    image:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=2070&auto=format&fit=crop",
    description:
      "Unit Sanitasi menjaga kebersihan terminal, toilet, area publik, dan lingkungan bandara melalui pengelolaan sanitasi rutin yang higienis dan konsisten.",
    duties: ["Kebersihan terminal", "Sanitasi toilet", "Lingkungan sehat"],
  },
];

export default function UnitKerjaPage() {
  return (
    <div className="bg-[#111928] text-gray-200">
      <style>{`
        @keyframes profileReveal {
          from {
            opacity: 0;
            transform: translateY(54px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes imageDrift {
          from {
            transform: scale(1.04);
          }
          to {
            transform: scale(1.12);
          }
        }

        .unit-profile-image {
          animation: imageDrift 18s ease-in-out infinite alternate;
        }

        @supports (animation-timeline: view()) {
          .unit-profile-reveal {
            animation: profileReveal linear both;
            animation-timeline: view();
            animation-range: entry 0% entry 25%;
          }
        }

        .leader-photo-shell {
          position: relative;
          isolation: isolate;
        }

        .leader-photo-shell::before {
          content: '';
          position: absolute;
          inset: 8% 10% 2% 18%;
          border: 1px solid rgba(250, 204, 21, 0.26);
          border-radius: 4px 96px 4px 96px;
          transform: translate(18px, 18px);
          z-index: -1;
        }

        .leader-photo-card {
          border-radius: 4px 86px 4px 86px;
          overflow: hidden;
          position: relative;
          background: #111928;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.58);
        }

        .leader-photo-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border: 1px solid rgba(250, 204, 21, 0.34);
          border-radius: inherit;
          pointer-events: none;
          z-index: 6;
        }

        .leader-deco-ring {
          position: absolute;
          bottom: 26px;
          right: -16px;
          width: 128px;
          height: 128px;
          border-radius: 50%;
          border: 2px solid rgba(250, 204, 21, 0.32);
          pointer-events: none;
          z-index: 4;
        }

        .leader-deco-ring::after {
          content: '';
          position: absolute;
          inset: 10px;
          border-radius: 50%;
          border: 1px solid rgba(250,204,21,0.16);
        }

        /* Leader overlay — cinematic bar */
        .leader-overlay-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          gap: 0;
          background: linear-gradient(90deg, rgba(10,16,30,0.93) 60%, rgba(10,16,30,0.70) 100%);
          border-top: 1px solid rgba(250,204,21,0.12);
          z-index: 5;
        }
        .leader-overlay-bar .yellow-accent {
          width: 4px;
          align-self: stretch;
          background: #facc15;
          flex-shrink: 0;
          border-radius: 0 0 0 18px;
        }
        .leader-overlay-bar .bar-text {
          padding: 18px 22px;
        }
        .leader-overlay-bar .bar-label {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #facc15;
          margin-bottom: 5px;
        }
        .leader-overlay-bar .bar-name {
          font-size: 17px;
          font-weight: 600;
          color: #ffffff;
          letter-spacing: 0.01em;
          line-height: 1.25;
        }

        .org-section {
          position: relative;
          overflow: hidden;
          background-image:
            linear-gradient(115deg, rgba(8, 14, 28, 0.95), rgba(10, 22, 42, 0.86) 46%, rgba(6, 13, 27, 0.97)),
            url('/assets/images/hero-bg.webp');
          background-size: cover;
          background-position: center;
        }

        .org-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 16% 18%, rgba(250, 204, 21, 0.16), transparent 28%),
            radial-gradient(circle at 82% 38%, rgba(56, 189, 248, 0.12), transparent 30%);
          pointer-events: none;
        }

        .org-section::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(to bottom, transparent, black 18%, black 72%, transparent);
          pointer-events: none;
        }

        .org-card {
          position: relative;
          display: flex;
          align-items: center;
          gap: 14px;
          border: 1px solid rgba(250, 204, 21, 0.34);
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(18, 38, 65, 0.94), rgba(8, 19, 36, 0.92));
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(14px);
        }

        .org-card::after {
          content: '';
          position: absolute;
          inset: 1px;
          border-radius: 7px;
          background: linear-gradient(120deg, rgba(255,255,255,0.12), transparent 38%);
          pointer-events: none;
        }

        .org-avatar {
          position: relative;
          z-index: 1;
          display: flex;
          height: 68px;
          width: 68px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 7px;
          border: 1px solid rgba(255,255,255,0.22);
          background: rgba(255,255,255,0.92);
          color: #111928;
          font-size: 22px;
          overflow: hidden;
          padding: 3px;
        }

        .org-icon {
          display: flex;
          height: 56px;
          width: 56px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 7px;
          border: 1px solid rgba(255, 255, 255, 0.24);
          background: rgba(255,255,255,0.9);
          color: #facc15;
          font-size: 16px;
          overflow: hidden;
          padding: 3px;
        }

        .org-avatar object,
        .org-icon object {
          position: relative;
          z-index: 1;
          height: 100%;
          width: 100%;
          border-radius: 5px;
          object-fit: cover;
          object-position: top center;
        }

        .org-avatar object {
          background: linear-gradient(145deg, rgba(250,204,21,0.96), rgba(255,255,255,0.86));
        }

        .org-icon object {
          background: linear-gradient(145deg, rgba(18, 38, 65, 0.94), rgba(8, 19, 36, 0.92));
        }

        .org-avatar object i,
        .org-icon object i {
          display: flex;
          height: 100%;
          width: 100%;
          align-items: center;
          justify-content: center;
          color: #111928;
        }

        .org-text {
          position: relative;
          z-index: 1;
          min-width: 0;
        }

        .org-connector {
          position: absolute;
          left: 50%;
          top: 112px;
          height: 116px;
          width: min(640px, 70vw);
          transform: translateX(-50%);
          border-left: 1px solid rgba(255,255,255,0.52);
          border-right: 1px solid rgba(255,255,255,0.52);
          border-top: 1px solid rgba(255,255,255,0.52);
          pointer-events: none;
        }

        .org-connector::before {
          content: '';
          position: absolute;
          left: 50%;
          top: -72px;
          height: 72px;
          width: 1px;
          background: rgba(255,255,255,0.52);
        }

        @media (max-width: 1023px) {
          .org-connector {
            display: none;
          }
        }
      `}</style>

      <PageHero
        backgroundImage="https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2070&auto=format&fit=crop"
        gradient="linear-gradient(to bottom, rgba(17, 25, 40, 0.72), rgba(17, 25, 40, 1))"
        breadcrumbs={[
          { href: "/", label: "Beranda" },
          { href: "/tentang", label: "Tentang" },
          { label: "Unit Kerja" },
        ]}
        title={
          <>
            Unit Kerja <br />
            <span className="italic text-[#facc15]">Bandara Tardamu</span>
          </>
        }
        description="Profil unit kerja Bandar Udara Tardamu yang mendukung keselamatan, keamanan, fasilitas, dan kualitas layanan bagi pengguna jasa bandara."
      />

      <main>
        {/* SECTION KEPALA BANDARA */}
        <section className="relative overflow-hidden border-b border-white/5 bg-[#111928] py-20 lg:py-0">
          <div className="mx-auto grid max-w-[1600px] lg:grid-cols-2">
            {/* Foto Kepala Bandara */}
            <div className="flex min-h-[360px] items-center justify-center px-6 py-12 md:px-10 lg:min-h-[620px]">
              <div className="leader-photo-shell w-full max-w-[430px]">
                <div className="leader-photo-card h-[520px] w-full lg:h-[620px]">
                  <Image
                    src={leaderProfile.image}
                    alt={leaderProfile.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 430px"
                    className="unit-profile-image object-cover object-top grayscale-[15%]"
                  />
                  {/* Subtle vignette */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent 45%, rgba(10,16,30,0.82) 100%)",
                      zIndex: 2,
                    }}
                  ></div>

                  {/* Decorative ring */}
                  <div className="leader-deco-ring"></div>
                  {/* Cinematic overlay bar */}
                  <div className="leader-overlay-bar">
                    <div className="yellow-accent"></div>
                    <div className="bar-text">
                      <p className="bar-label">{leaderProfile.label}</p>
                      <p className="bar-name">{leaderProfile.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profil & Kutipan Kepala Bandara */}
            <div className="flex items-center px-6 py-16 md:px-12 lg:px-20">
              <div className="max-w-xl">
                <p className="mb-4 text-[15px] font-bold uppercase tracking-[0.22em] text-[#facc15]">
                  {leaderProfile.position}
                </p>

                <h2
                  className="mb-7 text-3xl leading-[1.15] text-white md:text-4xl lg:text-[40px]"
                  style={serifStyle}
                >
                  {leaderProfile.name}
                </h2>

                <blockquote className="mb-6 border-l-4 border-[#facc15] pl-6 text-[15px] italic leading-7 text-white/70">
                  &ldquo;{leaderProfile.quote}&rdquo;
                </blockquote>

                <p className="text-[15.5px] leading-8 text-white/70">
                  {leaderProfile.bio}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION DAFTAR UNIT KERJA */}
        <div className="py-12 bg-[#111928] flex justify-center">
          <div className="text-center">
            <p className="mb-4 text-[25px] font-bold uppercase tracking-[0.28em] text-[#facc15]">
              Struktur Pelaksana
            </p>
            <h3 className="text-[50px] font-medium uppercase tracking-[0.16em] text-white">
              Daftar Unit Kerja
            </h3>
          </div>
        </div>
        {/* SECTION UNIT KERJA */}
        {workUnits.map((unit, index) => {
          const isReversed = index % 2 === 1;
          const sectionTone = "bg-[#172131]";

          return (
            <section
              key={unit.title}
              className={`unit-profile-reveal border-b border-white/5 ${sectionTone}`}
            >
              <div className="mx-auto grid min-h-[620px] max-w-[1600px] lg:grid-cols-2">
                <div
                  className={`relative min-h-[360px] overflow-hidden lg:min-h-[620px] ${isReversed ? "lg:order-2" : ""
                    }`}
                >
                  <Image
                    src={unit.image}
                    alt={unit.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="unit-profile-image object-cover brightness-110 contrast-105"
                  />
                  <div className="absolute bottom-8 left-8 rounded-full border border-white/15 bg-[#111928]/65 px-5 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white backdrop-blur-md">
                    {String(index + 1).padStart(2, "0")} / 08
                  </div>
                </div>

                <div className="flex items-center px-6 py-16 md:px-12 lg:px-20">
                  <div className="max-w-xl">
                    <div className="mb-8 flex items-center gap-4">
                      <div className="relative flex h-14 w-14 overflow-hidden items-center justify-center rounded-lg bg-[#facc15] text-xl text-[#111928]">
                        {unit.icon.startsWith("fa-") ? (
                          <i className={`fa-solid ${unit.icon}`}></i>
                        ) : (
                          <Image
                            src={unit.icon}
                            alt={unit.label}
                            fill
                            sizes="56px"
                            className="object-contain p-1"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-[25px] font-bold uppercase tracking-[0.22em] text-[#facc15]">
                          {unit.label}
                        </p>
                        <p className="mt-1 text-[15px] uppercase tracking-[0.18em] text-gray-500">
                          Bandar Udara Tardamu
                        </p>
                      </div>
                    </div>

                    <h2
                      className="mb-7 text-3xl leading-[1.15] text-white md:text-4xl lg:text-[44px]"
                      style={serifStyle}
                    >
                      {unit.title}
                    </h2>
                    <p className={`${unit.link ? "mb-5" : "mb-10"} text-[15.5px] leading-8 text-white/70`}>
                      {unit.description}
                    </p>

                    {unit.link ? (
                      <a
                        href={unit.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group mb-10 block overflow-hidden rounded-lg border border-[#facc15]/30 bg-gradient-to-br from-white/[0.09] via-white/[0.045] to-[#facc15]/[0.07] p-[1px] shadow-[0_22px_60px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:border-[#facc15]/70 hover:shadow-[0_26px_70px_rgba(250,204,21,0.12)]"
                      >
                        <div className="relative overflow-hidden rounded-[7px] bg-[#111928]/55 px-5 py-5 backdrop-blur-md">
                          <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-[#facc15]/15 blur-2xl transition duration-300 group-hover:bg-[#facc15]/25"></div>
                          <div className="relative flex items-start justify-between gap-5">
                            <div>
                              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#facc15]">
                                Portal Informasi PKP-PK
                              </p>
                              <p className="mt-3 text-sm leading-6 text-white/62">
                                Kunjungi halaman resmi PKP-PK untuk melihat informasi operasional dan dokumentasi pendukung.
                              </p>
                            </div>
                            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-white/15 bg-[#facc15] text-[#111928] transition duration-300 group-hover:rotate-3 group-hover:scale-105">
                              <i className="fa-solid fa-arrow-up-right-from-square text-sm"></i>
                            </span>
                          </div>
                        </div>
                      </a>
                    ) : null}

                    <div className="grid gap-3 sm:grid-cols-3">
                      {unit.duties.map((duty) => (
                        <div
                          key={duty}
                          className="border-l-2 border-[#facc15] bg-white/[0.03] px-4 py-3"
                        >
                          <p className="text-xs font-semibold text-gray-200">{duty}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
