import type { Metadata } from "next";
import Link from "next/link";
import { DynamicImage } from "@/components/dynamic-image";
import { buildPageMetadata } from "@/lib/seo";
import { getAllNews } from "@/services/news.service";
import { PageHero, serifStyle } from "../_components/info-page-shell";

export const revalidate = 300;
type Props = { searchParams?: Promise<{ page?: string }> };
function currentPage(value?: string) { return Math.max(Number.parseInt(value || "1", 10) || 1, 1); }
const formatDate = (value: Date | string) => new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

export async function generateMetadata(): Promise<Metadata> { return buildPageMetadata({ title: "Berita", description: "Kumpulan berita dan pengumuman terbaru Bandar Udara Tardamu Sabu Raijua.", path: "/berita" }); }

export default async function BeritaPage({ searchParams }: Props) {
  const page = currentPage((await searchParams)?.page);
  let result: Awaited<ReturnType<typeof getAllNews>> | null = null;
  try { result = await getAllNews(page, 9); } catch (error) { console.error("Failed to render news page:", error); }
  const href = (target: number) => target === 1 ? "/berita" : `/berita?page=${target}`;
  return <div className="bg-[#111928] text-gray-200"><PageHero backgroundImage="/assets/images/hero-bg.webp" gradient="linear-gradient(to bottom, rgba(17, 25, 40, .82), rgba(17, 25, 40, 1))" breadcrumbs={[{ href: "/", label: "Beranda" }, { label: "Berita" }]} title={<>Berita & <span className="italic text-[#facc15]">Pengumuman</span></>} description="Ikuti kabar terbaru, pengumuman resmi, dan perkembangan layanan Bandar Udara Tardamu Sabu." />
    <main className="mx-auto max-w-7xl px-6 py-20">{!result ? <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center text-red-200">Gagal memuat daftar berita.</div> : result.data.length === 0 ? <div className="rounded-3xl border border-white/5 bg-[#1f2937] p-10 text-center text-gray-400">Belum ada berita yang dipublikasikan.</div> : <><div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">{result.data.map((article) => <article key={article.id} className="group overflow-hidden rounded-[28px] border border-white/5 bg-[#1f2937] transition hover:-translate-y-2 hover:border-[#facc15]"><Link href={`/berita/${article.slug}`}><div className="relative h-56 overflow-hidden"><DynamicImage src={article.image_url || "/assets/images/hero-bg.webp"} alt={article.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" /></div><div className="p-7"><p className="text-xs uppercase tracking-widest text-[#facc15]">{formatDate(article.created_at)}</p><h2 className="mt-3 text-2xl text-white" style={serifStyle}>{article.title}</h2><p className="mt-4 line-clamp-3 text-sm leading-relaxed text-gray-400">{article.content}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#facc15]">Baca selengkapnya <i className="fa-solid fa-arrow-right text-[10px] transition group-hover:translate-x-1" /></span></div></Link></article>)}</div>{result.pagination.totalPages > 1 && <nav className="mt-12 flex items-center justify-center gap-3">{page > 1 && <Link href={href(page - 1)} className="rounded-full border border-white/10 px-5 py-2 text-sm hover:border-[#facc15]">Sebelumnya</Link>}<span className="text-sm text-gray-400">Halaman {page} dari {result.pagination.totalPages}</span>{page < result.pagination.totalPages && <Link href={href(page + 1)} className="rounded-full border border-white/10 px-5 py-2 text-sm hover:border-[#facc15]">Berikutnya</Link>}</nav>}</>}</main>
  </div>;
}
