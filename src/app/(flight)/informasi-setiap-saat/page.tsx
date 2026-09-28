import Link from "next/link";
import { PageHero, serifStyle } from "../_components/info-page-shell";
import { DocumentCards } from "@/components/information/document-cards";



export default function InformasiSetiapSaatPage() {
  return (
    <div className="bg-[#111928] text-gray-200 min-h-screen">
      <PageHero
        backgroundImage="/assets/images/hero-bg.webp"
        gradient="linear-gradient(to bottom, rgba(17, 25, 40, 0.9) 0%, rgba(17, 25, 40, 1) 100%)"
        breadcrumbs={[
          { href: "/", label: "Beranda" },
          { href: "/informasi", label: "Informasi" },
          { label: "Informasi Setiap Saat" },
        ]}
        title={
          <>
            Informasi Publik <span className="italic text-[#facc15]">Setiap Saat</span>
          </>
        }
        description="Akses transparansi informasi publik yang wajib tersedia setiap saat oleh PPID Bandar Udara Tardamu Sabu Raijua, meliputi Laporan BMN, Surat Keluar Masuk, Standar Operasional Prosedur (SOP), DIP, dan DIK."
      />

      <main className="mx-auto max-w-7xl flex-grow px-4 py-16 sm:px-6 lg:px-8">
        {/* 1. LAPORAN BMN */}
        <section id="bmn" className="mb-20 scroll-mt-36">
          <div className="mb-10 flex items-center gap-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-lg text-[#facc15]">
              <i className="fa fa-box-open" />
            </span>
            <h2 className="text-2xl uppercase tracking-wider text-white" style={serifStyle}>
              Laporan BMN
            </h2>
            <div className="h-[1px] flex-grow bg-gray-800" />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="flex flex-col justify-between rounded-2xl border border-white/5 bg-[#1f2937] p-8 shadow-xl lg:col-span-2 lg:p-10">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#facc15]/30 bg-[#facc15]/10 px-3.5 py-1 text-xs font-semibold text-[#facc15] mb-4">
                  <i className="fa-solid fa-building-columns text-[10px]" /> Barang Milik Negara
                </span>
                <h3 className="mb-4 text-xl font-bold text-white">
                  Laporan Pengelolaan Barang Milik Negara
                </h3>
                <p className="mb-6 leading-relaxed text-gray-400">
                  Laporan inventarisasi, penatausahaan, serta pemanfaatan Barang Milik Negara (BMN) di lingkungan Kantor UPBU Kelas III Tardamu - Sabu Raijua sebagai perwujudan akuntabilitas, tertib administrasi, dan pengamanan aset negara.
                </p>
                <ul className="space-y-3.5 text-sm text-gray-300">
                  <li className="flex items-start gap-3">
                    <i className="fa-solid fa-circle-check mt-1 text-[#facc15]" />
                    <span>Penatausahaan dan pencatatan buku inventaris barang milik negara secara berkala.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fa-solid fa-circle-check mt-1 text-[#facc15]" />
                    <span>Pemeliharaan dan optimalisasi sarana prasarana serta fasilitas keselamatan penerbangan.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fa-solid fa-circle-check mt-1 text-[#facc15]" />
                    <span>Kepatuhan terhadap tata kelola aset pemerintah sesuai regulasi Kementerian Keuangan & Kemenhub.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2 text-xs text-gray-400">
                <i className="fa-solid fa-info-circle text-[#facc15]" />
                <span>Dokumen laporan BMN dapat diunduh dan dipelajari secara transparan.</span>
              </div>
            </div>

            <div className="flex flex-col items-center rounded-2xl border border-white/5 bg-[#1f2937] p-8 text-center">
              <i className="fa-solid fa-file-shield mb-4 text-5xl text-[#facc15]" />
              <h4 className="mb-2 font-bold text-white text-lg">Dokumen Laporan BMN</h4>
              <p className="mb-6 text-xs text-gray-400">Arsip dokumen pelaporan BMN resmi bandara</p>
              <div className="w-full space-y-3 text-left">
                <DocumentCards category="bmn" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. SURAT KELUAR MASUK */}
        <section id="surat" className="mb-20 scroll-mt-36">
          <div className="mb-10 flex items-center gap-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10 text-lg text-sky-400">
              <i className="fa-solid fa-envelope-open-text" />
            </span>
            <h2 className="text-2xl uppercase tracking-wider text-white" style={serifStyle}>
              Surat Keluar Masuk
            </h2>
            <div className="h-[1px] flex-grow bg-gray-800" />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="flex flex-col justify-between rounded-2xl border border-white/5 bg-[#1f2937] p-8 shadow-xl lg:col-span-2 lg:p-10">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3.5 py-1 text-xs font-semibold text-sky-300 mb-4">
                  <i className="fa-solid fa-inbox text-[10px]" /> Tata Naskah Dinas
                </span>
                <h3 className="mb-4 text-xl font-bold text-white">
                  Rekapitulasi Persuratan Kedinasan
                </h3>
                <p className="mb-6 leading-relaxed text-gray-400">
                  Daftar rekapitulasi agenda surat masuk dan surat keluar Kantor UPBU Tardamu Sabu. Menjamin keteraturan administrasi korespondensi dinas, pengarsipan resmi, dan akses keterbukaan tata kelola surat-menyurat kedinasan.
                </p>
                <ul className="space-y-3.5 text-sm text-gray-300">
                  <li className="flex items-start gap-3">
                    <i className="fa-solid fa-circle-check mt-1 text-sky-400" />
                    <span>Pencatatan tertib nomor register surat dinas masuk dari instansi pemerintah, maskapai, dan mitra.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fa-solid fa-circle-check mt-1 text-sky-400" />
                    <span>Rekapitulasi surat keluar resmi kantor sebagai representasi kebijakan dan koordinasi eksternal.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fa-solid fa-circle-check mt-1 text-sky-400" />
                    <span>Arsip korespondensi yang dikelola sesuai pedoman tata kearsipan Kementerian Perhubungan.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2 text-xs text-gray-400">
                <i className="fa-solid fa-info-circle text-sky-400" />
                <span>Publikasi rekapitulasi dilakukan untuk transparansi tata kelola persuratan dinas.</span>
              </div>
            </div>

            <div className="flex flex-col items-center rounded-2xl border border-white/5 bg-[#1f2937] p-8 text-center">
              <i className="fa-solid fa-envelopes-bulk mb-4 text-5xl text-sky-400" />
              <h4 className="mb-2 font-bold text-white text-lg">Dokumen Surat</h4>
              <p className="mb-6 text-xs text-gray-400">Rekapitulasi surat dinas masuk dan keluar</p>
              <div className="w-full space-y-3 text-left">
                <DocumentCards category="surat" />
              </div>
            </div>
          </div>
        </section>

        {/* 3. SOP BANDARA */}
        <section id="sop" className="mb-20 scroll-mt-36">
          <div className="mb-10 flex items-center gap-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-lg text-emerald-400">
              <i className="fa-solid fa-clipboard-check" />
            </span>
            <h2 className="text-2xl uppercase tracking-wider text-white" style={serifStyle}>
              SOP Bandara
            </h2>
            <div className="h-[1px] flex-grow bg-gray-800" />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="flex flex-col justify-between rounded-2xl border border-white/5 bg-[#1f2937] p-8 shadow-xl lg:col-span-2 lg:p-10">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1 text-xs font-semibold text-emerald-300 mb-4">
                  <i className="fa-solid fa-users text-[10px]" /> Layanan Penumpang & Masyarakat
                </span>
                <h3 className="mb-4 text-xl font-bold text-white">
                  Standar Operasional Prosedur Pelayanan
                </h3>
                <p className="mb-6 leading-relaxed text-gray-400">
                  Kumpulan Standar Operasional Prosedur (SOP) resmi Bandar Udara Tardamu Sabu Raijua yang mengatur tata laksana pelayanan, kenyamanan, serta keselamatan penumpang, pengunjung terminal, dan masyarakat umum.
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm text-gray-300">
                  <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
                    <i className="fa-solid fa-plane-departure mt-1 text-emerald-400" />
                    <div>
                      <div className="font-semibold text-white">SOP Terminal Penumpang</div>
                      <div className="text-xs text-gray-400 mt-0.5">Alur keberangkatan, check-in, dan kedatangan pengguna jasa.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
                    <i className="fa-solid fa-wheelchair mt-1 text-emerald-400" />
                    <div>
                      <div className="font-semibold text-white">SOP Layanan Khusus</div>
                      <div className="text-xs text-gray-400 mt-0.5">Fasilitas pendampingan lansia, ibu hamil, & penumpang disabilitas.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
                    <i className="fa-solid fa-headset mt-1 text-emerald-400" />
                    <div>
                      <div className="font-semibold text-white">SOP Pengaduan & PPID</div>
                      <div className="text-xs text-gray-400 mt-0.5">Mekanisme penyampaian keluhan dan permohonan informasi publik.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
                    <i className="fa-solid fa-shield-halved mt-1 text-emerald-400" />
                    <div>
                      <div className="font-semibold text-white">SOP Keselamatan & Evakuasi</div>
                      <div className="text-xs text-gray-400 mt-0.5">Protokol keamanan penerbangan dan tanggap darurat di area publik.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2 text-xs text-gray-400">
                <i className="fa-solid fa-info-circle text-emerald-400" />
                <span>Semua SOP dirancang untuk menjamin pelayanan penerbangan yang aman, nyaman, dan terstandar.</span>
              </div>
            </div>

            <div className="flex flex-col items-center rounded-2xl border border-white/5 bg-[#1f2937] p-8 text-center">
              <i className="fa-solid fa-book-bookmark mb-4 text-5xl text-emerald-400" />
              <h4 className="mb-2 font-bold text-white text-lg">Dokumen SOP</h4>
              <p className="mb-6 text-xs text-gray-400">Dokumen pedoman operasional dan standar pelayanan</p>
              <div className="w-full space-y-3 text-left">
                <DocumentCards category="sop" />
              </div>
            </div>
          </div>
        </section>

        {/* 4. DIP */}
        <section id="dip" className="mb-20 scroll-mt-36">
          <div className="mb-10 flex items-center gap-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#facc15]/10 text-lg text-[#facc15]">
              <i className="fa-solid fa-file-lines" />
            </span>
            <h2 className="text-2xl uppercase tracking-wider text-white" style={serifStyle}>
              DIP
            </h2>
            <div className="h-[1px] flex-grow bg-gray-800" />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="flex flex-col justify-between rounded-2xl border border-white/5 bg-[#1f2937] p-8 shadow-xl lg:col-span-2 lg:p-10">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#facc15]/30 bg-[#facc15]/10 px-3.5 py-1 text-xs font-semibold text-[#facc15] mb-4">
                  <i className="fa-solid fa-folder-open text-[10px]" /> Keterbukaan Informasi
                </span>
                <h3 className="mb-4 text-xl font-bold text-white">Daftar Informasi Publik</h3>
                <p className="mb-6 leading-relaxed text-gray-400">
                  Daftar Informasi Publik (DIP) memuat ringkasan seluruh informasi yang berada di bawah kewenangan dan pengelolaan PPID Bandar Udara Tardamu yang wajib diumumkan serta dapat diakses oleh masyarakat umum.
                </p>
                <div className="grid grid-cols-1 gap-4 text-sm text-gray-300 md:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
                    <i className="fa-solid fa-circle-dot text-xs text-[#facc15]" />
                    <span>Profil & Kelembagaan Bandara</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
                    <i className="fa-solid fa-circle-dot text-xs text-[#facc15]" />
                    <span>Program Kerja & Capaian Kinerja</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
                    <i className="fa-solid fa-circle-dot text-xs text-[#facc15]" />
                    <span>Prosedur Pelayanan PPID</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
                    <i className="fa-solid fa-circle-dot text-xs text-[#facc15]" />
                    <span>Regulasi & Kebijakan Penerbangan</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2 text-xs text-gray-400">
                <i className="fa-solid fa-info-circle text-[#facc15]" />
                <span>DIP diperbarui secara periodik untuk memastikan informasi publik tetap akurat dan relevan.</span>
              </div>
            </div>

            <div className="flex flex-col items-center rounded-2xl border border-white/5 bg-[#1f2937] p-8 text-center">
              <i className="fa-solid fa-file-invoice mb-4 text-5xl text-[#facc15]" />
              <h4 className="mb-2 font-bold text-white text-lg">Dokumen DIP</h4>
              <p className="mb-6 text-xs text-gray-400">Daftar informasi publik resmi yang telah disahkan</p>
              <div className="w-full space-y-3 text-left">
                <DocumentCards category="dip" />
              </div>
            </div>
          </div>
        </section>

        {/* 5. DIK */}
        <section id="dik" className="mb-20 scroll-mt-36">
          <div className="mb-10 flex items-center gap-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-400/10 text-lg text-rose-400">
              <i className="fa-solid fa-shield-halved" />
            </span>
            <h2 className="text-2xl uppercase tracking-wider text-white" style={serifStyle}>
              DIK
            </h2>
            <div className="h-[1px] flex-grow bg-gray-800" />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="flex flex-col justify-between rounded-2xl border border-white/5 bg-[#1f2937] p-8 shadow-xl lg:col-span-2 lg:p-10">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-400/10 px-3.5 py-1 text-xs font-semibold text-rose-300 mb-4">
                  <i className="fa-solid fa-lock text-[10px]" /> Pengecualian Informasi Publik
                </span>
                <h3 className="mb-4 text-xl font-bold text-white">
                  Daftar Informasi yang Dikecualikan
                </h3>
                <p className="mb-6 leading-relaxed text-gray-400">
                  Klasifikasi informasi yang tidak dapat diakses atau dirilis ke publik berdasarkan ketentuan Pasal 17 UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik, melalui uji konsekuensi yang ketat guna melindungi kepentingan publik dan negara.
                </p>
                <ul className="space-y-3.5 text-sm text-gray-300">
                  <li className="flex items-start gap-3">
                    <i className="fa-solid fa-circle-xmark mt-1 text-rose-400" />
                    <span>Informasi yang berkaitan dengan pertahanan, keamanan nasional, dan keselamatan navigasi penerbangan.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fa-solid fa-circle-xmark mt-1 text-rose-400" />
                    <span>Informasi yang dapat menghambat proses intelijen, investigasi kecelakaan udara, atau penegakan hukum.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fa-solid fa-circle-xmark mt-1 text-rose-400" />
                    <span>Informasi yang berkaitan dengan hak-hak pribadi dan data pribadi pegawai atau pengguna jasa.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fa-solid fa-circle-xmark mt-1 text-rose-400" />
                    <span>Dokumen kerja internal yang bersifat rahasia jabatan atau belum diputuskan oleh pimpinan instansi.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2 text-xs text-gray-400">
                <i className="fa-solid fa-triangle-exclamation text-rose-400" />
                <span>Pengecualian informasi didasarkan atas Surat Keputusan Pengujian Konsekuensi PPID.</span>
              </div>
            </div>

            <div className="flex flex-col items-center rounded-2xl border border-white/5 bg-[#1f2937] p-8 text-center">
              <i className="fa-solid fa-file-contract mb-4 text-5xl text-rose-400" />
              <h4 className="mb-2 font-bold text-white text-lg">Dokumen DIK</h4>
              <p className="mb-6 text-xs text-gray-400">Dokumen penetapan informasi yang dikecualikan</p>
              <div className="w-full space-y-3 text-left">
                <DocumentCards category="dik" />
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-amber-500/10 via-white/[0.02] to-sky-500/10 p-8 text-center sm:p-12">
          <h3 className="text-2xl font-bold text-white mb-3" style={serifStyle}>
            Membutuhkan Informasi Publik Lainnya?
          </h3>
          <p className="mx-auto max-w-2xl text-sm text-gray-400 mb-8 leading-relaxed">
            Apabila informasi yang Anda cari belum tercantum di atas, Anda dapat mengajukan permohonan informasi publik secara resmi melalui formulir layanan PPID kami.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/layanan-informasi#formulir"
              className="inline-flex items-center gap-2 rounded-full bg-[#facc15] px-6 py-3 text-sm font-bold text-[#111928] shadow-lg shadow-amber-500/20 transition hover:bg-amber-300 hover:-translate-y-0.5"
            >
              <i className="fa-solid fa-file-circle-plus" />
              Ajukan Permohonan Informasi
            </Link>
            <Link
              href="/informasi-berkala"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-[#facc15] hover:text-[#facc15]"
            >
              Lihat Informasi Berkala <i className="fa-solid fa-arrow-right text-xs" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
