import { PageHero, serifStyle } from "../_components/info-page-shell";

const lakipDocs = ["LAKIP 2024.pdf", "LAKIP 2025.pdf"];
const dipDocs = ["DIP 2024.pdf", "DIP 2025.pdf"];
const dikDocs = ["DIK 2024.pdf", "DIK 2025.pdf"];

export default function LaporanPage() {
  return (
    <div className="bg-[#111928] text-gray-200">
      <PageHero
        backgroundImage="/assets/images/hero-bg.webp"
        gradient="linear-gradient(to bottom, rgba(17, 25, 40, 0.9) 0%, rgba(17, 25, 40, 1) 100%)"
        breadcrumbs={[
          { href: "/", label: "Beranda" },
          { href: "/informasi", label: "Informasi" },
          { label: "Laporan Kinerja" },
        ]}
        title={
          <>
            Sistem Informasi <span className="italic text-[#facc15]">Pelaporan Kinerja</span>
          </>
        }
        description="Akses transparansi Laporan Kinerja Instansi Pemerintah (LAKIP), Daftar Informasi Publik (DIP) dan Daftar Informasi yang Dikecualikan (DIK) Bandar Udara Tardamu."
      />

      <main className="mx-auto max-w-7xl flex-grow px-4 py-16 sm:px-6 lg:px-8">
        <section className="mb-20">
          <div className="mb-10 flex items-center gap-4">
            <h2 className="text-2xl uppercase tracking-wider text-white" style={serifStyle}>
              LAKIP
            </h2>
            <div className="h-[1px] flex-grow bg-gray-800"></div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/5 bg-[#1f2937] p-8 shadow-xl lg:col-span-2 lg:p-10">
              <h3 className="mb-4 text-xl font-bold text-white">
                Laporan Akuntabilitas Kinerja
              </h3>
              <p className="mb-6 leading-relaxed text-gray-400">
                Wujud pertanggungjawaban atas pencapaian visi, misi, dan strategi Bandara
                Tardamu dalam satu tahun anggaran.
              </p>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-check mt-1 text-[#facc15]"></i>
                  Mengukur efektivitas penggunaan anggaran.
                </li>
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-check mt-1 text-[#facc15]"></i>
                  Evaluasi peningkatan kualitas pelayanan publik.
                </li>
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-check mt-1 text-[#facc15]"></i>
                  Transparansi kepada masyarakat luas.
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center rounded-2xl border border-white/5 bg-[#1f2937] p-8 text-center">
              <i className="fa-solid fa-file-invoice mb-6 text-5xl text-[#facc15]"></i>
              <h4 className="mb-6 font-semibold text-white">Dokumen LAKIP</h4>
              <div className="w-full space-y-3">
                {lakipDocs.map((doc) => (
                  <a
                    key={doc}
                    href={`/assets/pdf/laporan/${doc}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="file-item group flex w-full items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-4 text-left text-sm transition hover:border-[#facc15] hover:bg-[#facc15]/10"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400"><i className="fa-solid fa-file-pdf"></i></span><span className="min-w-0 flex-1 truncate">{doc}</span><i className="fa-solid fa-download ml-auto shrink-0 text-xs text-gray-500 transition group-hover:text-[#facc15]"></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <div className="mb-10 flex items-center gap-4">
            <h2 className="text-2xl uppercase tracking-wider text-white" style={serifStyle}>
              DIP
            </h2>
            <div className="h-[1px] flex-grow bg-gray-800"></div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/5 bg-[#1f2937] p-8 shadow-xl lg:col-span-2 lg:p-10">
              <h3 className="mb-4 text-xl font-bold text-white">Daftar Informasi Publik</h3>
              <p className="mb-6 leading-relaxed text-gray-400">
                Berisi ringkasan informasi di bawah penguasaan PPID yang wajib diumumkan
                secara berkala.
              </p>
              <div className="grid grid-cols-1 gap-4 text-sm text-gray-300 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-circle text-[6px] text-[#facc15]"></i>
                  Profil bandara
                </div>
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-circle text-[6px] text-[#facc15]"></i>
                  Informasi bandara
                </div>
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-circle text-[6px] text-[#facc15]"></i>
                  Prosedur pelayanan
                </div>
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-circle text-[6px] text-[#facc15]"></i>
                  Regulasi
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center rounded-2xl border border-white/5 bg-[#1f2937] p-8 text-center">
              <i className="fa-solid fa-file-lines mb-6 text-5xl text-[#facc15]"></i>
              <h4 className="mb-6 font-semibold text-white">Dokumen DIP</h4>
              <div className="w-full space-y-3">
                {dipDocs.map((doc) => (
                  <a
                    key={doc}
                    href={`/assets/pdf/laporan/${doc}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="file-item group flex w-full items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-4 text-left text-sm transition hover:border-[#facc15] hover:bg-[#facc15]/10"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400"><i className="fa-solid fa-file-pdf"></i></span><span className="min-w-0 flex-1 truncate">{doc}</span><i className="fa-solid fa-download ml-auto shrink-0 text-xs text-gray-500 transition group-hover:text-[#facc15]"></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="mb-20">
          <div className="mb-10 flex items-center gap-4">
            <h2 className="text-2xl uppercase tracking-wider text-white" style={serifStyle}>
              DIK
            </h2>
            <div className="h-[1px] flex-grow bg-gray-800"></div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/5 bg-[#1f2937] p-8 shadow-xl lg:col-span-2 lg:p-10">
              <h3 className="mb-4 text-xl font-bold text-white">
                Daftar Informasi yang Dikecualikan
              </h3>
              <p className="mb-6 leading-relaxed text-gray-400">
                informasi yang tidak dapat diakses oleh publik berdasarkan UU Keterbukaan Informasi Publik, mencakup informasi yang membahayakan negara, mengganggu penegakan hukum, melanggar hak pribadi, berkaitan dengan rahasia jabatan, hingga informasi yang merugikan kepentingan ekonomi atau hubungan luar negeri.
              </p>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-check mt-1 text-[#facc15]"></i>
                  Informasi yang berkaitan dengan keamanan dan keselamatan publik
                </li>
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-check mt-1 text-[#facc15]"></i>
                  Informasi yang dapat mengganggu proses penegakan hukum
                </li>
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-check mt-1 text-[#facc15]"></i>
                  Informasi yang berkaitan dengan hak pribadi
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center rounded-2xl border border-white/5 bg-[#1f2937] p-8 text-center">
              <i className="fa-solid fa-file-invoice mb-6 text-5xl text-[#facc15]"></i>
              <h4 className="mb-6 font-semibold text-white">Dokumen DIK</h4>
              <div className="w-full space-y-3">
                {dikDocs.map((doc) => (
                  <a
                    key={doc}
                    href={`/assets/pdf/laporan/${doc}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="file-item group flex w-full items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-4 text-left text-sm transition hover:border-[#facc15] hover:bg-[#facc15]/10"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400"><i className="fa-solid fa-file-pdf"></i></span><span className="min-w-0 flex-1 truncate">{doc}</span><i className="fa-solid fa-download ml-auto shrink-0 text-xs text-gray-500 transition group-hover:text-[#facc15]"></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

