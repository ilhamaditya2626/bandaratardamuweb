import Image from "next/image";
import { PageHero, serifStyle } from "../_components/info-page-shell";

const skPpidDriveUrl =
  process.env.NEXT_PUBLIC_SK_PPID_URL || "https://drive.google.com/drive/folders/10iMC8HxaFi5keLdMJPL3QuYTr1pv9-cK";

const visionItems = [
  {
    number: "01",
    title: "Layanan Informasi Publik",
    description:
      "Suatu usaha untuk memberikan informasi publik sesuai Undang-Undang No. 14 tahun 2008 tentang Keterbukaan Informasi Publik di lingkungan Kementerian Perhubungan.",
  },
  {
    number: "02",
    title: "Transparan",
    description:
      "Memberikan akses seluas-luasnya kepada masyarakat dalam memperoleh informasi publik dengan cepat dan tepat waktu, biaya ringan, dan cara yang sederhana.",
  },
  {
    number: "03",
    title: "Objektif",
    description:
      "Memberikan akses informasi kepada setiap kalangan, baik perorangan, kelompok, maupun badan hukum.",
  },
  {
    number: "04",
    title: "Prima",
    description:
      "Terus berupaya penuh dalam peningkatan pelayanan, pengelolaan, dan pendokumentasian informasi publik secara akuntabel, efisien, dan mudah diakses.",
  },
];

const missionItems = [
  "Menjamin akses informasi publik sesuai Undang-Undang No. 14 tahun 2008 tentang Keterbukaan Informasi Publik.",
  "Meningkatkan kualitas layanan informasi publik.",
  "Meningkatkan profesionalisme SDM layanan informasi publik.",
  "Meningkatkan sarana-prasarana dalam rangka efisiensi dan efektivitas layanan informasi publik.",
  "Meningkatkan pengelolaan informasi dan dokumentasi secara baik, efisien, mudah diakses dan bersifat desentralisasi.",
];

// DATA TUGAS & FUNGSI YANG BARU
const tugasDanFungsiItems = [
  {
    id: "01",
    title: "Kementerian Perhubungan",
    tugas: "Kementerian mempunyai tugas menyelenggarakan urusan pemerintahan di bidang transportasi untuk membantu Presiden dalam menyelenggarakan pemerintahan negara.",
    fungsi: [
      "Perumusan, penetapan, dan pelaksanaan kebijakan di bidang penyelenggaraan pelayanan, keselamatan, dan keamanan transportasi, serta peningkatan aksesibilitas, konektivitas, dan kapasitas sarana dan prasarana transportasi;",
      "Pelaksanaan bimbingan teknis dan supervisi atas pelaksanaan urusan Kementerian di daerah;",
      "Koordinasi pelaksanaan tugas, pembinaan, dan pemberian dukungan administrasi kepada seluruh unsur organisasi di lingkungan Kementerian;",
      "Pengelolaan barang milik/ kekayaan negara yang menjadi tanggung jawab Kementerian;",
      "Pengawasan atas pelaksanaan tugas di lingkungan Kementerian;",
      "Pelaksanaan analisis dan rekomendasi kebijakan transportasi;",
      "Pelaksanaan pengembangan sumber daya manusia transportasi;",
      "Pelaksanaan dukungan yang bersifat substantif kepada seluruh unsur organisasi di lingkungan Kementerian; dan",
      "Pelaksanaan fungsi lain yang diberikan oleh Presiden."
    ]
  },
  {
    id: "02",
    title: "Sekretariat Jenderal",
    tugas: "Menyelenggarakan koordinasi pelaksanaan tugas, pembinaan, dan pemberian dukungan administrasi kepada seluruh unsur organisasi di lingkungan Kementerian.",
    fungsi: [
      "Koordinasi kegiatan Kementerian;",
      "Koordinasi dan penyusunan rencana, program, dan anggaran Kementerian;",
      "Pembinaan dan pemberian dukungan administrasi yang meliputi ketatausahaan, sumber daya manusia, keuangan, kerumahtanggaan, kerja sama, hubungan masyarakat, arsip, dan dokumentasi Kementerian;",
      "Pembinaan dan penataan organisasi dan tata laksana;",
      "Koordinasi dan penyusunan peraturan perundang-undangan serta pelaksanaan advokasi hukum;",
      "Koordinasi dan pengelolaan barang milik/ kekayaan negara dan pengelolaan pengadaan barang/jasa; dan",
      "Pelaksanaan fungsi lain yang diberikan oleh Menteri."
    ]
  },
  {
    id: "03",
    title: "Direktorat Jenderal Perhubungan Udara",
    tugas: "Menyelenggarakan perumusan dan pelaksanaan kebijakan di bidang penerbangan.",
    fungsi: [
      "Perumusan kebijakan di bidang pemanfaatan wilayah udara, pesawat udara dan bandar udara, penyelenggaraan angkutan udara dan navigasi penerbangan, peningkatan keselamatan, keamanan, dan kualitas lingkungan hidup penerbangan, serta pemanfaatan fasilitas penunjang dan fasilitas umum penerbangan;",
      "Pelaksanaan kebijakan di bidang pemanfaatan wilayah udara, pesawat udara dan bandar udara, penyelenggaraan angkutan udara dan navigasi penerbangan, peningkatan keselamatan, keamanan, dan kualitas lingkungan hidup penerbangan, serta pemanfaatan fasilitas penunjang dan fasilitas umum penerbangan;",
      "Penyusunan norma, standar, prosedur, dan kriteria di bidang pemanfaatan wilayah udara, pesawat udara dan bandar udara, penyelenggaraan angkutan udara dan navigasi penerbangan, peningkatan keselamatan, keamanan, dan kualitas lingkungan hidup penerbangan, serta pemanfaatan fasilitas penunjang dan fasilitas umum penerbangan;",
      "Pemberian bimbingan teknis dan supervisi di bidang pemanfaatan wilayah udara, pesawat udara dan bandar udara, penyelenggaraan angkutan udara dan navigasi penerbangan, peningkatan keselamatan, keamanan, dan kualitas lingkungan hidup penerbangan, serta pemanfaatan fasilitas penunjang dan fasilitas umum penerbangan;",
      "Pelaksanaan pemantauan, analisis, evaluasi, dan pelaporan di bidang pemanfaatan wilayah udara, pesawat udara dan bandar udara, penyelenggaraan angkutan udara dan navigasi penerbangan, peningkatan keselamatan, keamanan, dan kualitas lingkungan hidup penerbangan, serta pemanfaatan fasilitas penunjang dan fasilitas umum penerbangan;",
      "Pelaksanaan administrasi Direktorat Jenderal; dan",
      "Pelaksanaan fungsi lain yang diberikan oleh Menteri."
    ]
  },
  {
    id: "04",
    title: "Unit Pelaksana Teknis",
    tugas: "Untuk melaksanakan tugas teknis operasional dan/atau tugas teknis penunjang di lingkungan Kementerian Perhubungan.",
    fungsi: []
  }
];

const functions = [
  {
    number: "01",
    title: "Pengelolaan Informasi",
    description:
      "Mengumpulkan, menyediakan, dan mendokumentasikan setiap informasi publik yang dihasilkan di lingkungan operasional bandara.",
  },
  {
    number: "02",
    title: "Pelayanan Permohonan",
    description:
      "Memproses setiap permohonan informasi dari masyarakat dengan transparansi sesuai regulasi UU No. 14 Tahun 2008.",
  },
  {
    number: "03",
    title: "Uji Konsekuensi",
    description:
      "Melakukan koordinasi dan verifikasi terhadap informasi yang dikecualikan demi menjaga keamanan objek vital nasional.",
  },
];

export default function PpidPage() {
  return (
    <div className="bg-[#111928] text-gray-200">
      <PageHero
        backgroundImage="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop"
        gradient="linear-gradient(to bottom, rgba(17, 25, 40, 0.82), rgba(17, 25, 40, 1))"
        breadcrumbs={[
          { href: "/", label: "Beranda" },
          { href: "/tentang", label: "Tentang" },
          { label: "PPID" },
        ]}
        title={
          <>
            Profil <span className="italic text-[#facc15]">PPID</span>
          </>
        }
        description="Sejak Undang-Undang Nomor 14 Tahun 2008 Tentang Keterbukaan Informasi Publik (UU KIP) diberlakukan secara efektif pada tanggal 30 April 2010 telah mendorong bangsa Indonesia satu langkah maju ke depan, menjadi bangsa yang transparan dan akuntabel dalam mengelola sumber daya publik. UU KIP sebagai instrumen hukum yang mengikat merupakan tonggak atau dasar bagi seluruh rakyat Indonesia untuk bersama-sama mengawasi secara langsung pelayanan publik yang diselenggarakan oleh Badan Publik."
      />

      <main className="space-y-32 py-24">
        <section className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="rounded-[40px] border border-white/5 bg-[#1f2937]/50 p-8 md:p-12">
              <h2 className="mb-6 text-3xl text-white" style={serifStyle}>
                Visi PPID
              </h2>
              <p className="border-l-2 border-[#facc15] pl-6 text-lg italic leading-relaxed text-gray-300">
                &quot;Terwujudnya layanan informasi publik yang Transparan, Objektif
                dan Prima untuk meningkatkan peran serta aktif masyarakat dalam
                penyelenggaraan pembangunan sektor transportasi.&quot;
              </p>

              <div className="mt-10 space-y-6">
                {visionItems.map((item) => (
                  <div
                    key={item.title}
                    className="grid gap-4 border-l border-white/10 pl-5 sm:grid-cols-[48px_1fr]"
                  >
                    <span className="text-sm font-black tracking-widest text-[#facc15]">
                      {item.number}
                    </span>
                    <div>
                      <h3 className="mb-2 font-bold text-white">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[40px] border border-white/5 bg-[#1f2937]/50 p-8 md:p-12">
              <h2 className="mb-6 text-3xl text-white" style={serifStyle}>
                Misi PPID
              </h2>
              <div className="space-y-5">
                {missionItems.map((item, index) => (
                  <div key={item} className="flex gap-4">
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#facc15]/10 text-xs font-black text-[#facc15]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm leading-relaxed text-gray-400">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TUGAS & FUNGSI BARU */}
        <section className="border-y border-white/5 bg-[#1f2937]/20 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl text-white" style={serifStyle}>
                Tugas & <span className="italic text-[#facc15]">Fungsi</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto mb-6">
                Pembagian tugas dan fungsi di lingkungan Kementerian Perhubungan berdasarkan regulasi yang berlaku.
              </p>
              <div className="mx-auto h-1 w-20 bg-[#facc15] rounded-full"></div>
            </div>

            {/* Layout Grid 2 Kolom untuk menampilkan data yang banyak */}
            <div className="grid gap-8 md:grid-cols-2">
              {tugasDanFungsiItems.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col rounded-3xl border border-white/5 bg-[rgba(31,41,55,0.4)] p-8 backdrop-blur-xl transition hover:border-[#facc15]/50 hover:bg-[#1f2937]/60"
                >
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#facc15] text-2xl font-bold text-[#111928]">
                      {item.id}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                      {item.title}
                    </h3>
                  </div>

                  <div className="space-y-6 flex-1">
                    {/* Bagian Tugas */}
                    <div>
                      <h4 className="text-[#facc15] text-xs font-bold uppercase tracking-widest mb-3">
                        Tugas
                      </h4>
                      <p className="text-justify text-sm md:text-base leading-relaxed text-gray-300 bg-white/5 p-4 rounded-xl">
                        {item.tugas}
                      </p>
                    </div>

                    {/* Bagian Fungsi */}
                    {item.fungsi && item.fungsi.length > 0 && (
                      <div>
                        <h4 className="text-[#facc15] text-xs font-bold uppercase tracking-widest mb-3">
                          Fungsi
                        </h4>
                        <ul className="space-y-3">
                          {item.fungsi.map((fungsiItem, idx) => (
                            <li key={idx} className="flex gap-3 items-start text-sm md:text-base text-gray-400 leading-relaxed">
                              <span className="mt-1.5 flex h-1.5 w-1.5 shrink-0 rounded-full bg-[#facc15]/60"></span>
                              <span className="text-justify">{fungsiItem}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl italic text-white" style={serifStyle}>
              Struktur Organisasi PPID
            </h2>
            <p className="text-xs uppercase tracking-widest text-gray-500">
              Organizational Chart
            </p>
          </div>

          <div className="mx-auto max-w-5xl rounded-[50px] border border-white/5 bg-[#1f2937]/30 p-3 shadow-2xl md:p-8">
            <div className="group flex min-h-[420px] items-center justify-center overflow-hidden rounded-[30px] border border-white/10 bg-[#111928] md:min-h-[560px]">
              <div className="relative h-[600px] w-full overflow-hidden rounded-[30px] bg-[#0b1220]">
                <Image
                  src="/assets/images/struktur-ppid2.webp"
                  alt="Struktur Organisasi PPID Bandara Tardamu"
                  fill
                  sizes="(max-width: 1280px) 100vw, 1024px"
                  className="object-contain transition duration-700 group-hover:scale-105"
                />
              </div>
            </div>


            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border-l-4 border-[#facc15] bg-[#1f2937]/50 p-6">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#facc15]">
                  PPID Pelaksana UPT Tardamu
                </p>
                <h4 className="font-bold text-white">David Benjamin Messakh, S.H.</h4>
              </div>
              <div className="rounded-2xl border-l-4 border-[#facc15] bg-[#1f2937]/50 p-6">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#facc15]">
                  Petugas Pelaksana PPID Tardamu
                </p>
                <h4 className="font-bold text-white">Muhammad Rizky Fadhil, A.Md.Tra.</h4>
                <h4 className="font-bold text-white">Ahmad Rayhan Farhan, A.Md.Tra.</h4>
              </div>
            </div>

            {/* Link Google Drive SK PPID */}
            <div className="mt-6">
              <a
                href={skPpidDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-start justify-between gap-4 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#1f2937]/90 via-[#1f2937]/70 to-[#111928]/95 p-5 shadow-xl transition-all duration-300 hover:border-[#facc15]/60 hover:bg-[#1f2937] hover:shadow-[0_0_30px_rgba(250,204,21,0.15)] sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2.5 transition-transform duration-300 group-hover:scale-110 group-hover:border-[#facc15]/40 group-hover:bg-[#facc15]/10">
                    <svg
                      className="h-full w-full"
                      viewBox="0 0 87.3 78"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
                        fill="#0066da"
                      />
                      <path
                        d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z"
                        fill="#00ac47"
                      />
                      <path
                        d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"
                        fill="#ea4335"
                      />
                      <path
                        d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"
                        fill="#00832d"
                      />
                      <path
                        d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
                        fill="#2684fc"
                      />
                      <path
                        d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"
                        fill="#ffba00"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#facc15]">
                        Dokumen Resmi
                      </span>
                      <span className="h-1 w-1 rounded-full bg-[#facc15]/50"></span>
                      <span className="text-[10px] uppercase tracking-wider text-gray-400">
                        Google Drive
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white transition-colors group-hover:text-[#facc15] md:text-lg">
                      Surat Keputusan (SK) PPID UPBU Tardamu
                    </h4>
                    <p className="text-xs text-gray-400">
                      Klik untuk melihat dan mengunduh berkas SK PPID melalui Google Drive
                    </p>
                  </div>
                </div>

                <div className="flex w-full items-center justify-end sm:w-auto">
                  <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-gray-300 transition-all duration-300 group-hover:border-[#facc15] group-hover:bg-[#facc15] group-hover:text-[#111928]">
                    <span>Buka SK PPID</span>
                    <svg
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div >
  );
}
