import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo";
import { PageHero, serifStyle } from "../../../_components/info-page-shell";
import { DocumentPreviewViewer } from "./_components/document-preview-viewer";

const REQUEST_FORM_URL = "https://forms.gle/6N2LZZqUjs8HBjQW7";

const documents = {
  "laporan-tahunan-2024": { title: "Laporan Tahunan 2024", year: "2024", type: "Laporan Kinerja", description: "Ringkasan pelaksanaan kebijakan, capaian layanan, dan evaluasi kinerja Kantor UPBU Tardamu sepanjang tahun 2024.", points: ["Capaian kinerja dan layanan", "Program serta kegiatan strategis", "Evaluasi pelaksanaan dan tindak lanjut"], previewUrl: "/assets/pdf/previews/laporan-tahunan-2024-preview.pdf", previewPages: 15, totalPages: 72 },
  "laporan-tahunan-2025": { title: "Laporan Tahunan 2025", year: "2025", type: "Laporan Kinerja", description: "Ringkasan pelaksanaan kebijakan, capaian layanan, dan evaluasi kinerja Kantor UPBU Tardamu sepanjang tahun 2025.", points: ["Capaian kinerja dan layanan", "Program serta kegiatan strategis", "Evaluasi pelaksanaan dan tindak lanjut"], previewUrl: "/assets/pdf/previews/laporan-tahunan-2025-preview.pdf", previewPages: 16, totalPages: 77 },
  "rencana-kerja-anggaran-2024": { title: "Rencana Kerja Anggaran 2024", year: "2024", type: "Rencana Kerja & Anggaran", description: "Dokumen perencanaan program, kegiatan, dan kebutuhan anggaran Kantor UPBU Tardamu tahun 2024.", points: ["Prioritas program dan kegiatan", "Rencana kebutuhan anggaran", "Target pelaksanaan dan indikator"] },
  "rencana-kerja-anggaran-2025": { title: "Rencana Kerja Anggaran 2025", year: "2025", type: "Rencana Kerja & Anggaran", description: "Dokumen perencanaan program, kegiatan, dan kebutuhan anggaran Kantor UPBU Tardamu tahun 2025.", points: ["Prioritas program dan kegiatan", "Rencana kebutuhan anggaran", "Target pelaksanaan dan indikator"] },
  "laporan-keuangan-2024": { title: "Laporan Keuangan 2024", year: "2024", type: "Laporan Keuangan", description: "Ringkasan pertanggungjawaban keuangan Kantor UPBU Tardamu tahun 2024, termasuk realisasi anggaran dan informasi BMN.", points: ["Realisasi anggaran", "Neraca dan catatan keuangan", "Informasi barang milik negara"] },
  "laporan-keuangan-2025": { title: "Laporan Keuangan 2025", year: "2025", type: "Laporan Keuangan", description: "Ringkasan pertanggungjawaban keuangan Kantor UPBU Tardamu tahun 2025, termasuk realisasi anggaran dan informasi BMN.", points: ["Realisasi anggaran", "Neraca dan catatan keuangan", "Informasi barang milik negara"] },
  "dip-2024": { title: "Daftar Informasi Publik 2024", year: "2024", type: "Daftar Informasi Publik", description: "Daftar informasi publik yang berada dalam penguasaan PPID Kantor UPBU Tardamu tahun 2024.", points: ["Jenis informasi publik", "Unit atau pejabat pengelola informasi", "Bentuk dan jangka waktu informasi"], previewUrl: "/assets/pdf/previews/dip-2024-preview.pdf", previewPages: 3, totalPages: 13 },
  "dip-2025": { title: "Daftar Informasi Publik 2025", year: "2025", type: "Daftar Informasi Publik", description: "Daftar informasi publik yang berada dalam penguasaan PPID Kantor UPBU Tardamu tahun 2025.", points: ["Jenis informasi publik", "Unit atau pejabat pengelola informasi", "Bentuk dan jangka waktu informasi"] },
  "dik-2024": { title: "Daftar Informasi Dikecualikan 2024", year: "2024", type: "Daftar Informasi Dikecualikan", description: "Daftar informasi yang dikecualikan sesuai ketentuan keterbukaan informasi publik tahun 2024.", points: ["Dasar hukum pengecualian", "Pertimbangan konsekuensi", "Jangka waktu pengecualian"], previewUrl: "/assets/pdf/previews/dik-2024-preview.pdf", previewPages: 3, totalPages: 13 },
  "dik-2025": { title: "Daftar Informasi Dikecualikan 2025", year: "2025", type: "Daftar Informasi Dikecualikan", description: "Daftar informasi yang dikecualikan sesuai ketentuan keterbukaan informasi publik tahun 2025.", points: ["Dasar hukum pengecualian", "Pertimbangan konsekuensi", "Jangka waktu pengecualian"] },
} as const;

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return Object.keys(documents).map((slug) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const document = documents[slug as keyof typeof documents];
  if (!document) return {};
  return buildPageMetadata({ title: `${document.title} - Pratinjau`, description: document.description, path: `/informasi-berkala/dokumen/${slug}`, noIndex: true });
}

export default async function DocumentPreviewPage({ params }: Props) {
  const { slug } = await params; const document = documents[slug as keyof typeof documents];
  if (!document) notFound();
  return <div className="bg-[#111928] text-gray-200">
    <PageHero backgroundImage="/assets/images/Terminal.webp" gradient="linear-gradient(to bottom, rgba(17,25,40,.76), rgba(17,25,40,1))" breadcrumbs={[{ href: "/", label: "Beranda" }, { href: "/informasi-berkala", label: "Informasi Berkala" }, { label: "Pratinjau Dokumen" }]} title={<>Pratinjau <span className="italic text-[#facc15]">Dokumen</span></>} description="Ringkasan informasi publik untuk membantu Anda mengenali dokumen yang diperlukan." />
    <main className="mx-auto max-w-5xl px-6 py-20"><div className="grid gap-8 lg:grid-cols-[1fr_.8fr]">
      <article className="overflow-hidden rounded-[32px] border border-white/5 bg-[#1f2937]"><div className="border-b border-white/5 bg-white/[.025] p-8"><div className="mb-5 flex items-center gap-4"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-2xl text-red-400"><i className="fa-solid fa-file-pdf" /></span><span className="rounded-full bg-[#facc15]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#facc15]">{document.type}</span></div><h1 className="text-3xl text-white md:text-4xl" style={serifStyle}>{document.title}</h1><p className="mt-4 leading-7 text-gray-400">{document.description}</p></div><div className="p-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#facc15]">Cakupan informasi</p><ul className="mt-5 space-y-4">{document.points.map((point) => <li key={point} className="flex gap-3 text-gray-300"><i className="fa-solid fa-check mt-1 text-sm text-[#facc15]" />{point}</li>)}</ul></div></article>
      <aside className="rounded-[32px] border border-[#facc15]/20 bg-[#facc15]/[.06] p-8"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#facc15] text-xl text-[#111928]"><i className="fa-solid fa-file-lines" /></span><h2 className="mt-7 text-2xl text-white" style={serifStyle}>Versi lengkap melalui permohonan</h2><p className="mt-4 text-sm leading-7 text-gray-400">Halaman ini hanya menampilkan ringkasan dokumen. Untuk memperoleh salinan atau melihat dokumen lengkap, ajukan permohonan informasi melalui formulir resmi PPID.</p><a href={REQUEST_FORM_URL} target="_blank" rel="noreferrer" className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#facc15] px-5 py-3 text-sm font-bold text-[#111928] transition hover:-translate-y-1">Ajukan Permohonan Dokumen <i className="fa-solid fa-arrow-up-right-from-square text-xs" /></a><Link href="/layanan-informasi#prosedur" className="mt-4 inline-flex w-full items-center justify-center gap-2 text-sm font-semibold text-[#facc15] hover:text-white">Pelajari prosedur layanan <i className="fa-solid fa-arrow-right text-xs" /></Link></aside>
    </div>{"previewUrl" in document && document.previewUrl ? (
      <DocumentPreviewViewer
        title={document.title}
        previewUrl={document.previewUrl}
        previewPages={document.previewPages}
        totalPages={document.totalPages}
        serifStyle={serifStyle}
      />
    ) : (
      <section className="mt-8 rounded-[32px] border border-white/5 bg-[#1f2937] p-8 text-sm leading-7 text-gray-400">
        Pratinjau PDF belum tersedia untuk dokumen ini. Silakan ajukan permohonan dokumen untuk memperoleh versi lengkap.
      </section>
    )}<div className="mt-8 flex justify-start"><Link href="/informasi-berkala#laporan" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition hover:text-[#facc15]"><i className="fa-solid fa-arrow-left text-xs" /> Kembali ke Laporan Publik</Link></div></main>
  </div>;
}
