import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { PageHero, serifStyle } from "../_components/info-page-shell";
import { getUrgentInformation } from "@/services/urgent-information.service";

export const revalidate = 300;
type PageProps = { searchParams?: Promise<{ page?: string }> };
const dateFormatter = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" });
function pageNumber(value?: string) { return Math.max(Number.parseInt(value || "1", 10) || 1, 1); }

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ title: "Informasi Serta Merta", description: "Informasi yang wajib diumumkan segera oleh Bandar Udara Tardamu Sabu Raijua.", path: "/informasi-serta-merta" });
}

export default async function InformasiSertaMertaPage({ searchParams }: PageProps) {
  const page = pageNumber((await searchParams)?.page);
  let result: Awaited<ReturnType<typeof getUrgentInformation>> | null = null;
  try { result = await getUrgentInformation(page, 10); } catch (error) { console.error("Failed to render urgent information:", error); }
  const href = (target: number) => target === 1 ? "/informasi-serta-merta" : `/informasi-serta-merta?page=${target}`;
  return <div className="bg-[#111928] text-gray-200">
    <PageHero backgroundImage="/assets/images/hero-bg.webp" gradient="linear-gradient(to bottom, rgba(17, 25, 40, .82), rgba(17, 25, 40, 1))" breadcrumbs={[{ href: "/", label: "Beranda" }, { href: "/informasi", label: "Informasi" }, { label: "Informasi Serta Merta" }]} title={<>Informasi <br /><span className="italic text-[#facc15]">Serta Merta</span></>} description="Informasi penting yang diumumkan segera untuk melindungi keselamatan, keamanan, dan kepentingan masyarakat." />
    <main className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 rounded-[28px] border border-[#facc15]/20 bg-[#facc15]/[.06] p-6 md:flex md:items-center md:gap-6"><span className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#facc15] text-[#111928] md:mb-0"><i className="fa-solid fa-triangle-exclamation" /></span><div><h2 className="text-xl text-white" style={serifStyle}>Pengumuman yang perlu diketahui segera</h2><p className="mt-2 text-sm leading-6 text-gray-400">Daftar ini memuat keadaan darurat, perubahan operasional, gangguan layanan, serta pemberitahuan penting lainnya.</p></div></div>
      {!result ? <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center text-red-200">Gagal memuat informasi serta merta.</div> : result.data.length === 0 ? <div className="rounded-3xl border border-white/5 bg-[#1f2937] p-10 text-center text-gray-400">Belum ada informasi serta merta yang dipublikasikan.</div> : <><div className="overflow-hidden rounded-[28px] border border-white/5 bg-[#1f2937]">{result.data.map((item, index) => <article key={item.id} className={`grid gap-5 p-6 md:grid-cols-[70px_1fr_auto] md:items-start md:p-8 ${index ? "border-t border-white/5" : ""}`}><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#facc15]/10 text-xl font-black text-[#facc15]">{String((page - 1) * 10 + index + 1).padStart(2, "0")}</div><div><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-[#facc15]">Diumumkan {dateFormatter.format(new Date(item.published_at))}</p><h2 className="text-2xl leading-tight text-white" style={serifStyle}>{item.title}</h2><p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-400">{item.description}</p></div>{item.attachment_url && <a href={item.attachment_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-[#facc15] transition hover:border-[#facc15] hover:bg-[#facc15]/10">Lampiran <i className="fa-solid fa-arrow-up-right-from-square text-xs" /></a>}</article>)}</div>{result.pagination.totalPages > 1 && <nav className="mt-10 flex items-center justify-center gap-3">{page > 1 && <Link href={href(page - 1)} className="rounded-full border border-white/10 px-5 py-2 text-sm hover:border-[#facc15]">Sebelumnya</Link>}<span className="text-sm text-gray-400">Halaman {page} dari {result.pagination.totalPages}</span>{page < result.pagination.totalPages && <Link href={href(page + 1)} className="rounded-full border border-white/10 px-5 py-2 text-sm hover:border-[#facc15]">Berikutnya</Link>}</nav>}</>}
    </main>
  </div>;
}
