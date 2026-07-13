import type { Metadata } from "next";
import Link from "next/link";
import { DynamicImage } from "@/components/dynamic-image";
import { buildPageMetadata } from "@/lib/seo";
import { PageHero, serifStyle } from "../_components/info-page-shell";
import { getAllNews } from "@/services/news.service";

export const revalidate = 300;

type PageProps = {
  searchParams?: Promise<{ page?: string }>;
};

function formatDate(dateString: string | Date) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function parsePageNumber(rawValue?: string) {
  const page = Number.parseInt(rawValue || "1", 10);

  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return page;
}

function getPageHref(page: number) {
  return page <= 1 ? "/berita" : `/berita?page=${page}`;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const resolvedSearchParams = (await searchParams) ?? {};
  const page = parsePageNumber(resolvedSearchParams.page);
  const title = page > 1 ? `Berita & Informasi Terkini - Halaman ${page}` : "Berita & Informasi Terkini";

  return buildPageMetadata({
    title,
    description:
      "Update berita terbaru, pengumuman resmi, dan informasi operasional Bandar Udara Tardamu Sabu Raijua.",
    path: page > 1 ? `/berita?page=${page}` : "/berita",
  });
}

export default async function BeritaPage({ searchParams }: PageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const page = parsePageNumber(resolvedSearchParams.page);
  const limit = 6;

  let articles: Awaited<ReturnType<typeof getAllNews>>["data"] = [];
  let pagination: Awaited<ReturnType<typeof getAllNews>>["pagination"] | null = null;
  let loadFailed = false;

  try {
    const result = await getAllNews(page, limit);
    articles = result.data;
    pagination = result.pagination;
  } catch (error) {
    console.error("Failed to render /berita:", error);
    loadFailed = true;
  }

  return (
    <div className="bg-[#111928] text-gray-200">
      <PageHero
        backgroundImage="/assets/images/hero-bg.webp"
        gradient="linear-gradient(to bottom, rgba(17, 25, 40, 0.82), rgba(17, 25, 40, 1))"
        breadcrumbs={[
          { href: "/", label: "Beranda" },
          { href: "/informasi", label: "Informasi" },
          { label: "Berita" },
        ]}
        title={
          <>
            Berita & <br />
            <span className="italic text-[#facc15]">Informasi Terkini</span>
          </>
        }
        description="Ikuti perkembangan terbaru mengenai operasional, rute penerbangan baru, dan pengumuman resmi dari otoritas Bandara Tardamu."
      />

      <main className="mx-auto max-w-7xl px-6 py-20">
        {loadFailed ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center text-red-200">
            Gagal memuat daftar berita.
          </div>
        ) : articles.length === 0 ? (
          <div className="rounded-3xl border border-white/5 bg-[#1f2937] p-10 text-center text-gray-400">
            Belum ada berita yang dipublikasikan.
          </div>
        ) : (
          <>
            <div id="newsGrid" className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="news-card overflow-hidden rounded-[28px] border border-white/5 bg-[#1f2937] transition duration-300 hover:-translate-y-2 hover:border-[#facc15]"
                >
                  <div className="img-container relative h-56 overflow-hidden">
                    <DynamicImage
                      src={article.image_url || "/assets/images/hero-bg.webp"}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition duration-700"
                    />
                  </div>
                  <div className="p-7">
                    <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-widest text-gray-500">
                      <span>{formatDate(article.created_at)}</span>
                      <span className="h-1 w-1 rounded-full bg-[#facc15]"></span>
                      <span>{article.author || "Admin"}</span>
                    </div>
                    <h3 className="mb-4 text-2xl text-white" style={serifStyle}>
                      {article.title}
                    </h3>
                    <p className="mb-6 text-sm leading-relaxed text-gray-400">
                      {article.content}...
                    </p>
                    <Link
                      href={`/berita/${article.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#facc15] transition hover:text-white"
                    >
                      Baca Selengkapnya <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div id="newsPagination" className="mt-12 flex flex-wrap justify-center gap-3">
                {page === 1 ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white opacity-40">
                    Sebelumnya
                  </span>
                ) : (
                  <Link
                    href={getPageHref(page - 1)}
                    className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white transition hover:border-[#facc15] hover:text-[#facc15]"
                  >
                    Sebelumnya
                  </Link>
                )}

                {Array.from({ length: pagination.totalPages }).map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <Link
                      key={pageNumber}
                      href={getPageHref(pageNumber)}
                      className={`h-10 min-w-10 rounded-full px-3 text-sm font-semibold transition ${
                        page === pageNumber
                          ? "bg-[#facc15] text-[#111928]"
                          : "border border-white/10 bg-white/5 text-white"
                      }`}
                    >
                      {pageNumber}
                    </Link>
                  );
                })}

                {page === pagination.totalPages ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white opacity-40">
                    Berikutnya
                  </span>
                ) : (
                  <Link
                    href={getPageHref(page + 1)}
                    className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white transition hover:border-[#facc15] hover:text-[#facc15]"
                  >
                    Berikutnya
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
