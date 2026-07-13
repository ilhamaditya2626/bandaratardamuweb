import { PageHero, serifStyle } from "../_components/info-page-shell";

const regulationSections = [
  {
    title: "Peraturan Umum Penerbangan",
    items: [
      {
        label: " Undang-Undang Republik Indonesia Nomor 1 Tahun 2009 Tentang Penerbangan",
        pdf: "/assets/pdf/regulasi/uu-1-tahun-2009-penerbangan.pdf",
      },
      {
        label: "Peraturan Menteri Perhubungan Nomor PM 80 tahun 2017 Tentang Keselamatan Penggunaan Pesawat Udara",
        pdf: "/assets/pdf/regulasi/peraturan-menteri-no-80-tahun-2017-keselamatan-penggunaan-pesawat-udara.pdf",
      },
      {
        label: "Peraturan Menteri Perhubungan Nomor PM 89 Tahun 2015 Tentang Penanganan Keterlambatan Penerbangan (Delay Management) pada Badan Usaha Angkutan Udara Niaga Berjadwal di Indonesia",
        pdf: "/assets/pdf/regulasi/pm-89-tahun-2015-penanganan-keterlambatan-penerbangan.pdf",
      },
      {
        label: "Peraturan Menteri Perhubungan Nomor PM 90 Tahun 2013 Tentang Keselamatan Pengangkutan Barang Berbahaya dengan Pesawat Udara",
        pdf: "/assets/pdf/regulasi/pm-90-tahun-2013-keselamatan-pengangkutan-barang-berbahaya.pdf",
      },
      {
        label: "Peraturan Menteri Perhubungan Nomor PM 178 Tahun 2015 Tentang Standar Pelayanan Pengguna Jasa Bandar Udara",
        pdf: "/assets/pdf/regulasi/pm-178-tahun-2015-standar-pelayanan-pengguna-jasa-bandar-udara.pdf",
      },
      {
        label: "Peraturan Menteri Perhubungan Nomor 163 Tahun 2015 tentang Peraturan Keselamatan Penerbangan Sipil Bagian 107 (Civil Aviation Safety Regulations Part 107) tentang Sistem Pesawat Udara Kecil Tanpa Awak (Small Unmanned Aircraft System)",
        pdf: "/assets/pdf/regulasi/pm-163-tahun-2015-keselamatan-penerbangan-sipil-bagian-107.pdf",
      }
    ]
  },
  {
    title: "Peraturan Undang-Undang",
    items: [
      {
        label: "Undang-Undang Nomor 25 Tahun 2009 tentang Pelayanan Publik",
        pdf: "/assets/pdf/regulasi/uu-25-tahun-2009-pelayanan-publik.pdf",
      },
      {
        label: "Undang-Undang Nomor 43 Tahun 2009 tentang Kearsipan",
        pdf: "/assets/pdf/regulasi/uu-43-tahun-2009-kearsipan.pdf",
      },
      {
        label: "Undang-Undang Nomor 14 Tahun 2008 tentang Keterbukaan Informasi Publik",
        pdf: "/assets/pdf/regulasi/uu-14-tahun-2008-keterbukaan-informasi-publik.pdf",
      },
      {
        label: "Undang-Undang Nomor 40 Tahun 1999 tentang Pers",
        pdf: "/assets/pdf/regulasi/uu-40-tahun-1999-pers.pdf",
      },
    ],
  },
  {
    title: "Peraturan Komisi Informasi Pusat",
    items: [
      {
        label:
          "Peraturan Komisi Informasi Pusat Nomor 1 Tahun 2021 Tentang Standar Layanan Informasi Publik",
        pdf: "/assets/pdf/regulasi/perki-1-tahun-2021-standar-layanan-informasi-publik.pdf",
      },
      {
        label:
          "Peraturan Komisi Informasi Pusat Nomor 1 Tahun 2013 Tentang Prosedur Penyelesaian Sengketa Informasi Publik",
        pdf: "/assets/pdf/regulasi/perki-1-tahun-2013-prosedur-penyelesaian-sengketa-informasi-publik.pdf",
      },
    ],
  },
  {
    title: "Peraturan Kementerian Perhubungan terkait Keterbukaan Informasi Publik",
    items: [
      {
        label:
          "Peraturan Menteri Perhubungan Nomor PM 46 Tahun 2018 tentang Pedoman Pengelolaan Informasi dan Dokumentasi di Lingkungan Kementerian Perhubungan",
        pdf: "/assets/pdf/regulasi/pm-46-tahun-2018-pedoman-pengelolaan-informasi-dan-dokumentasi.pdf",
      },
      {
        label:
          "Keputusan Menteri Perhubungan Nomor KM 117 Tahun 2022 tentang SOP Pejabat Pengelola Informasi dan Dokumentasi di Lingkungan Kementerian Perhubungan",
        pdf: "/assets/pdf/regulasi/km-117-tahun-2022-sop-ppid.pdf",
      },
      {
        label:
          "Keputusan Sekretaris Jenderal Kementerian Perhubungan Nomor KP-SKJ 25 Tahun 2024 tentang Daftar Informasi Publik Tahun 2024",
        pdf: "/assets/pdf/regulasi/kp-skj-25-tahun-2024-daftar-informasi-publik-2024.pdf",
      },
      {
        label:
          "Keputusan Sekretaris Jenderal Kementerian Perhubungan Nomor KP-SKJ 24 Tahun 2024 tentang Perubahan Atas Keputusan Sekretaris Jenderal Nomor KP 591 Tahun 2023 tentang Informasi yang Dikecualikan",
        pdf: "/assets/pdf/regulasi/kp-skj-24-tahun-2024-perubahan-informasi-yang-dikecualikan.pdf",
      },
      {
        label:
          "Keputusan Sekretaris Jenderal Kementerian Perhubungan Nomor KP-SKJ 15 Tahun 2025 tentang Daftar Informasi Publik Tahun 2025",
        pdf: "/assets/pdf/regulasi/kp-skj-15-tahun-2025-daftar-informasi-publik-2025.pdf",
      },
      {
        label:
          "Keputusan Sekretaris Jenderal Kementerian Perhubungan Nomor KP-SKJ 16 Tahun 2025 tentang Perubahan Kedua Atas Keputusan Sekretaris Jenderal Nomor KP 591 Tahun 2023 tentang Informasi yang Dikecualikan",
        pdf: "/assets/pdf/regulasi/kp-skj-16-tahun-2025-perubahan-kedua-informasi-yang-dikecualikan.pdf",
      },
    ],
  },
];

export default function RegulasiPage() {
  return (
    <div className="bg-[#111928] text-gray-200">
      <PageHero
        backgroundImage="/assets/images/regulasi.webp"
        breadcrumbs={[
          { href: "/", label: "Beranda" },
          { href: "/tentang", label: "Tentang" },
          { label: "Regulasi" },
        ]}
        title={
          <>
            Regulasi <br />
            <span className="italic text-[#facc15]">Penerbangan</span>
          </>
        }
        description="Informasi resmi terkait layanan penerbangan dan kebijakan yang berlaku di Bandar Udara Tardamu."
      />

      <main className="mx-auto max-w-7xl px-4 py-16">
        <div className="space-y-20">
          {regulationSections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-10 text-3xl text-white" style={serifStyle}>
                {section.title}
              </h2>
              <div className="grid gap-8 md:grid-cols-2">
                {section.items.map((item) => (
                  <a
                    key={item.label}
                    href={item.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    type="application/pdf"
                    className="flex min-h-24 items-center justify-center rounded-2xl border border-gray-700 bg-[#1f2937] p-6 text-center text-sm font-semibold leading-relaxed text-white transition hover:border-[#facc15] hover:text-[#facc15]"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 rounded-xl border border-[#facc15] bg-[#facc15]/10 p-6">
          <h3 className="mb-2 font-semibold text-[#facc15]">Catatan Penting</h3>
          <p className="text-sm leading-relaxed text-gray-300">
            Regulasi dapat berubah sewaktu-waktu mengikuti kebijakan pemerintah dan
            otoritas penerbangan. Selalu periksa informasi terbaru sebelum melakukan aktivitas
            terkait.
          </p>
        </div>
      </main>
    </div>
  );
}
