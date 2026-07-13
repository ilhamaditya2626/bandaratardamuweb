import { PageHero } from "../_components/info-page-shell";

type RestrictedInfoItem = {
  no: string;
  description: string;
  badge?: { text: string; className: string };
  legal: string[];
  consequenceOpen?: string;
  consequenceClosed?: string;
  summary?: string;
  duration: string;
  owner?: string;
};

const restrictedInfo: RestrictedInfoItem[] = [
  {
    no: "01",
    description: "Laporan Keuangan Unaudited 2025",
    badge: { text: "Restricted", className: "border-red-800/50 bg-red-900/30 text-red-400" },
    legal: [
      "UU No. 17/2003 Keuangan Negara (Pasal 30 ayat 1)",
      "UU No. 15/2004 Pemeriksaan Tanggung Jawab Keuangan (Pasal 17 ayat 1)",
      "UU No. 14/2008 KIP (Pasal 17 huruf j)",
    ],
    consequenceOpen: "Mengganggu proses pemeriksaan laporan keuangan negara.",
    consequenceClosed: "Melindungi proses pemeriksaan laporan keuangan negara.",
    duration: "1 Tahun",
    owner: "PPID Pelaksana UPT Kantor UPBU TARDAMU",
  },
  {
    no: "02",
    description: "Rincian Satuan Harga & Rekening Tender",
    badge: { text: "Confidential", className: "border-red-800/50 bg-red-900/30 text-red-400" },
    legal: [
      "UU No. 14/2008 Pasal 17 huruf b (Persaingan usaha tidak sehat)",
      "UU No. 14/2008 Pasal 17 huruf h angka 3 (Rahasia pribadi & aset)",
    ],
    consequenceOpen: "Mengganggu perlindungan HAKI dan persaingan usaha tidak sehat.",
    consequenceClosed: "Melindungi kepentingan HAKI dan persaingan usaha tidak sehat.",
    duration: "1 Tahun",
    owner: "PPID Pelaksana UPT Kantor UPBU TARDAMU",
  },
  {
    no: "03",
    description: "Data Pribadi ASN Kemenhub",
    badge: { text: "Privacy", className: "border-red-800/50 bg-red-900/30 text-red-400" },
    legal: ["UU No. 14/2008 Pasal 17 huruf h (Pengungkapan rahasia pribadi)."],
    consequenceOpen: "Mengungkap rahasia pribadi.",
    consequenceClosed: "Melindungi rahasia pribadi.",
    duration: "1 Tahun",
    owner: "PPID Pelaksana UPT Kantor UPBU TARDAMU",
  },
  {
    no: "04",
    description: "Proses mutasi pegawai",
    badge: { text: "Privacy", className: "border-red-800/50 bg-red-900/30 text-red-400" },
    legal: [
      "Undang-Undang Nomor 14 Tahun 2008 Tentang Keterbukaan Informasi Publik Pasal 17 huruf h: Informasi publik yang apabila dibuka dan diberikan kepada pemohon informasi publik dapat mengungkapkan rahasia pribadi",
    ],
    consequenceOpen: "Jika informasi dibuka, dapat mengungkapkan rahasia pribadi",
    consequenceClosed: "Jika informasi ditutup, maka dapat melindungi rahasia pribadi",
    duration: "1 Tahun",
    owner: "PPID PELAKSANA UPT KANTOR UPBU TARDAMU",
  },
  {
    no: "05",
    description: "Memorandum dan atau surat-surat yang menurut sifatnya dirahasiakan",
    badge: { text: "Confidential", className: "border-red-800/50 bg-red-900/30 text-red-400" },
    legal: [
      "Undang-Undang Nomor 14 Tahun 2008 Tentang Keterbukaan Informasi Publik Pasal 17 huruf i: memorandum atau surat-surat antar Badan Publik atau intra Badan Publik, yang menurut sifatnya dirahasiakan kecuali atas putusan Komisi Informasi atau pengadilan",
    ],
    consequenceOpen: "Jika informasi dibuka, dapat mengganggu pertahanan dan keamanan negara",
    consequenceClosed: "Jika informasi ditutup, maka dapat melindungi pertahanan dan keamanan negara",
    duration: "1 Tahun",
    owner: "PPID PELAKSANA UPT KANTOR UPBU TARDAMU",
  },
  {
    no: "06",
    description: "Informasi pengaduan barang dan jasa atas kegiatan/pembangunan yang belum melalui proses audit",
    badge: { text: "Restricted", className: "border-red-800/50 bg-red-900/30 text-red-400" },
    legal: [
      "Undang-Undang Nomor 14 Tahun 2008 Tentang Keterbukaan Informasi Publik Pasal 17 huruf b: Informasi Publik yang apabila dibuka dan diberikan kepada Pemohon Informasi Publik dapat mengganggu kepentingan perlindungan hak atas kekayaan intelektual dan perlindungan dari persaingan usaha tidak sehat",
    ],
    consequenceOpen: "Jika informasi dibuka, dapat mengganggu kepentingan perlindungan hak atas kekayaan intelektual dan perlindungan dari persaingan usaha tidak sehat",
    consequenceClosed: "Jika informasi ditutup, maka dapat melindungi kepentingan perlindungan hak atas kekayaan intelektual dan perlindungan dari persaingan usaha tidak sehat",
    duration: "1 Tahun",
    owner: "PPID PELAKSANA UPT KANTOR UPBU TARDAMU",
  },
  {
    no: "07",
    description: "Rancangan cetak biru sarana dan prasarana transportasi",
    badge: { text: "Confidential", className: "border-red-800/50 bg-red-900/30 text-red-400" },
    legal: [
      "Undang-Undang Nomor 14 Tahun 2008 Tentang Keterbukaan Informasi Publik Pasal 17 huruf b: Informasi Publik yang apabila dibuka dan diberikan kepada Pemohon Informasi Publik dapat mengganggu kepentingan perlindungan hak atas kekayaan intelektual dan perlindungan dari persaingan usaha tidak sehat",
    ],
    consequenceOpen: "Jika informasi dibuka, dapat mengganggu kepentingan perlindungan hak atas kekayaan intelektual dan perlindungan dari persaingan usaha tidak sehat",
    consequenceClosed: "Jika informasi ditutup, maka dapat melindungi kepentingan perlindungan hak atas kekayaan intelektual dan perlindungan dari persaingan usaha tidak sehat",
    duration: "1 Tahun",
    owner: "PPID PELAKSANA UPT KANTOR UPBU TARDAMU",
  },
  {
    no: "08",
    description: "Data pribadi responden survei",
    badge: { text: "Privacy", className: "border-red-800/50 bg-red-900/30 text-red-400" },
    legal: [
      "Undang-Undang Nomor 14 Tahun 2008 Tentang Keterbukaan Informasi Publik Pasal 17 huruf h angka 1, angka 3, dan angka 5",
    ],
    consequenceOpen: "Jika informasi dibuka, dapat mengungkapkan rahasia pribadi",
    consequenceClosed: "Jika informasi ditutup, maka dapat melindungi rahasia pribadi",
    duration: "1 Tahun",
    owner: "PPID PELAKSANA UPT KANTOR UPBU TARDAMU",
  },
  {
    no: "09",
    description: "Hak akses CCTV area/daerah keamanan terbatas",
    badge: { text: "Confidential", className: "border-red-800/50 bg-red-900/30 text-red-400" },
    legal: [
      "Undang-Undang Nomor 14 Tahun 2008 Tentang Keterbukaan Informasi Publik Pasal 17 huruf j",
      "Undang-Undang Nomor 1 Tahun 2023 tentang Kitab Undang-Undang Hukum Pidana, Pasal 333 huruf d",
    ],
    consequenceOpen: "Apabila dibuka, dapat melanggar ketentuan pada undang-undang",
    consequenceClosed: "Apabila ditutup, dapat melindungi sistem elektronik milik pemerintah sesuai dengan ketentuann pada undang-undang",
    duration: "1 Tahun",
    owner: "PPID PELAKSANA UPT KANTOR UPBU TARDAMU",
  },
  {
    no: "10",
    description: "Informasi terkait Proses Pemeriksaan Tindak Pidana Penerbangan sebelum dilimpahkan ke Kejaksaan",
    badge: { text: "Restricted", className: "border-red-800/50 bg-red-900/30 text-red-400" },
    legal: [
      "Undang-Undang No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik Pasal 17 huruf A, dapat menghambat proses penegakan hukum",
      "Pasal 17 huruf H, dapat mengungkap rahasia pribadi, yaitu riwayat dan kondisi anggota keluarga",
    ],
    consequenceOpen: "Apabila dibuka, dapat mengganggu proses penegakan hukum",
    consequenceClosed: "Apabila ditutup, dapat membantu kelancaran proses penegakan hukum",
    duration: "1 Tahun",
    owner: "PPID PELAKSANA UPT KANTOR UPBU TARDAMU",
  },
];

export default function InformasiDikecualikanPage() {
  return (
    <div className="bg-[#111928] text-gray-200">
      <PageHero
        backgroundImage="https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2070&auto=format&fit=crop"
        gradient="linear-gradient(to bottom, rgba(17, 25, 40, 0.9), rgba(17, 25, 40, 1))"
        breadcrumbs={[
          { href: "/", label: "Beranda" },
          { href: "/informasi", label: "Informasi" },
          { label: "Informasi Dikecualikan" },
        ]}
        title={
          <>
            Klasifikasi Informasi <br />
            <span className="italic text-[#facc15]">Publik Terbatas</span>
          </>
        }
        description="Sesuai UU KIP No. 14 Tahun 2008, berikut adalah daftar informasi yang aksesnya dibatasi untuk melindungi kepentingan negara, persaingan usaha, dan hak pribadi."
      />

      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="overflow-x-auto rounded-[24px] border border-white/5 bg-[rgba(31,41,55,0.2)] shadow-2xl">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["No", "Deskripsi Informasi", "Dasar Hukum Pengecualian", "Analisis Konsekuensi & Pertimbangan", "Waktu & PJ"].map((title) => (
                  <th
                    key={title}
                    className="border-b border-[#facc15]/20 bg-[#facc15]/10 px-4 py-6 text-left text-[0.7rem] uppercase tracking-[0.15em] text-[#facc15]"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {restrictedInfo.map((item) => (
                <tr key={item.no} className="transition hover:bg-white/[0.02]">
                  <td className="border-b border-white/[0.03] px-4 py-6 align-top text-center font-bold text-[#facc15]">
                    {item.no}
                  </td>
                  <td className="border-b border-white/[0.03] px-4 py-6 align-top text-sm text-gray-300">
                    <div className="mb-1 text-sm font-bold uppercase text-white">
                      {item.description}
                    </div>
                    {item.badge && (
                      <span
                        className={`mt-2 inline-block rounded px-2 py-[2px] text-[0.65rem] font-bold uppercase ${item.badge.className}`}
                      >
                        {item.badge.text}
                      </span>
                    )}
                  </td>
                  <td className="border-b border-white/[0.03] px-4 py-6 align-top text-[0.8rem] leading-6 text-gray-400">
                    <ul className="space-y-2">
                      {item.legal.map((law) => (
                        <li key={law}>• {law}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="border-b border-white/[0.03] px-4 py-6 align-top text-[0.85rem] text-gray-300">
                    {item.consequenceOpen && item.consequenceClosed ? (
                      <div className="space-y-2">
                        <div className="rounded-lg border border-white/5 bg-white/5 p-3 text-[11px]">
                          <span className="mb-1 block font-bold uppercase text-green-500">
                            Jika Dibuka
                          </span>
                          {item.consequenceOpen}
                        </div>
                        <div className="rounded-lg border border-white/5 bg-white/5 p-3 text-[11px]">
                          <span className="mb-1 block font-bold uppercase text-red-400">
                            Jika Ditutup
                          </span>
                          {item.consequenceClosed}
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px]">{item.summary}</div>
                    )}
                  </td>
                  <td className="border-b border-white/[0.03] px-4 py-6 align-top text-[10px]">
                    <p className="font-bold text-[#facc15]">{item.duration}</p>
                    {item.owner && <p className="mt-2 text-gray-500">{item.owner}</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-white/5 bg-[#1f2937] p-8">
            <h4 className="mb-4 flex items-center gap-3 font-bold text-white">
              <i className="fa-solid fa-circle-check text-[#facc15]"></i>
              Prinsip Pengecualian
            </h4>
            <p className="text-xs leading-relaxed text-gray-400">
              Informasi yang dikecualikan bersifat ketat dan terbatas. PPID wajib
              melakukan Pengujian Konsekuensi secara berkala untuk memastikan alasan
              penutupan informasi masih relevan dengan kepentingan publik yang lebih
              besar.
            </p>
          </div>
          <div className="rounded-3xl border border-white/5 bg-[#1f2937] p-8">
            <h4 className="mb-4 flex items-center gap-3 font-bold text-white">
              <i className="fa-solid fa-scale-balanced text-[#facc15]"></i>
              Hak Keberatan
            </h4>
            <p className="text-xs leading-relaxed text-gray-400">
              Pemohon informasi berhak mengajukan keberatan kepada Atasan PPID atau
              sengketa ke Komisi Informasi apabila permohonan informasi ditolak dengan
              alasan informasi tersebut dikecualikan.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
