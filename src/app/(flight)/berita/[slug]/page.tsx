import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { DynamicImage } from "@/components/dynamic-image";
import { buildPageMetadata, stripHtml } from "@/lib/seo";
import { getAllNews, getNewsBySlug } from "@/services/news.service";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

const fallbackImage =
  "https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2670&auto=format&fit=crop";
const sidebarFallbackImage =
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop";
const getCachedNewsBySlug = cache((slug: string) => getNewsBySlug(slug));

function formatDate(dateString: string | Date | null | undefined) {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function toIsoString(dateValue: string | Date | null | undefined) {
  if (!dateValue) return undefined;

  const parsedDate = new Date(dateValue);
  return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate.toISOString();
}

function renderArticleContent(content: string) {
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(content);

  if (hasHtml) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  const paragraphs = content
    .split(/\n\n|\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getCachedNewsBySlug(slug);

  if (!article) {
    return buildPageMetadata({
      title: "Berita Tidak Ditemukan - Bandara Tardamu Sabu Raijua",
      description: "Artikel berita yang Anda cari tidak tersedia atau sudah dipindahkan.",
      path: `/berita/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: article.title,
    description: stripHtml(article.content, 160),
    path: `/berita/${article.slug}`,
    image: article.image_url || fallbackImage,
    type: "article",
    publishedTime: toIsoString(article.created_at),
    modifiedTime: toIsoString(article.updated_at),
  });
}

export default async function BeritaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [article, latestNewsResult] = await Promise.all([
    getCachedNewsBySlug(slug),
    getAllNews(1, 6),
  ]);

  if (!article) {
    notFound();
  }

  const { data: latestNews } = latestNewsResult;
  const sidebarNews = latestNews.filter((item) => item.slug !== article.slug).slice(0, 5);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .news-detail-wrapper {
              background-color: #f4f6f9;
              padding: 100px 0 60px;
              min-height: 100vh;
            }

            .news-detail-container {
              max-width: 1120px;
              margin: 0 auto;
              display: flex;
              gap: 32px;
            }

            .news-detail__main {
              flex: 7;
              background: #fff;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
            }

            .news-detail__breadcrumb {
              display: flex;
              align-items: center;
              flex-wrap: wrap;
              gap: 10px;
              font-size: 13px;
              margin-bottom: 24px;
            }

            .news-detail__breadcrumb a {
              color: #6c757d;
              transition: color 0.2s ease;
            }

            .news-detail__breadcrumb a:hover {
              color: #f1c40f;
            }

            .news-detail__breadcrumb i {
              font-size: 9px;
              color: #adb5bd;
            }

            .news-detail__breadcrumb span {
              color: #1a2a44;
              font-weight: 600;
            }

            .news-article__title {
              font-family: "Outfit", sans-serif;
              font-size: clamp(26px, 4vw, 36px);
              font-weight: 700;
              color: #1a2a44;
              line-height: 1.3;
              margin-bottom: 16px;
            }

            .news-article__meta {
              display: flex;
              flex-wrap: wrap;
              gap: 20px;
              color: #6c757d;
              font-size: 14px;
              margin-bottom: 24px;
              padding-bottom: 24px;
              border-bottom: 1px solid #ebebeb;
            }

            .news-article__meta span {
              display: flex;
              align-items: center;
              gap: 8px;
            }

            .news-article__meta i {
              color: #f1c40f;
            }

            .news-article__hero {
              width: 100%;
              aspect-ratio: 16 / 9;
              object-fit: cover;
              border-radius: 12px;
              margin-bottom: 32px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
            }

            .news-article__content {
              color: #333;
              line-height: 1.8;
              font-size: 16px;
              text-align: justify;
              text-justify: inter-word;
              hyphens: auto;
            }

            .news-article__content p {
              margin-bottom: 16px;
              text-indent: 2.5em;
            }

            .news-article__content p:last-child {
              margin-bottom: 0;
            }

            .news-article__content strong {
              color: #1a2a44;
              font-weight: 600;
            }

            .news-detail__sidebar {
              flex: 3;
            }

            .sidebar-widget {
              background: #fff;
              border-radius: 12px;
              padding: 32px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
              margin-bottom: 32px;
              position: sticky;
              top: calc(var(--header-h) + 24px);
            }

            .sidebar-widget__title {
              font-family: "Outfit", sans-serif;
              font-size: 20px;
              font-weight: 700;
              color: #1a2a44;
              margin-bottom: 24px;
              position: relative;
              padding-bottom: 12px;
            }

            .sidebar-widget__title::after {
              content: "";
              position: absolute;
              left: 0;
              bottom: 0;
              width: 40px;
              height: 3px;
              background: #f1c40f;
              border-radius: 2px;
            }

            .popular-news-list {
              display: flex;
              flex-direction: column;
              gap: 20px;
            }

            .popular-news-item {
              display: flex;
              gap: 16px;
              align-items: flex-start;
              text-decoration: none;
            }

            .popular-news-item__img {
              width: 80px;
              height: 80px;
              border-radius: 8px;
              object-fit: cover;
              border: 2px solid transparent;
              transition: border-color 0.3s var(--ease-smooth);
              flex-shrink: 0;
            }

            .popular-news-item:hover .popular-news-item__img {
              border-color: #f1c40f;
            }

            .popular-news-item__info {
              display: flex;
              flex-direction: column;
              gap: 6px;
            }

            .popular-news-item__title {
              font-size: 14px;
              font-weight: 600;
              color: #1a2a44;
              line-height: 1.4;
              transition: color 0.3s var(--ease-smooth);
            }

            .popular-news-item:hover .popular-news-item__title {
              color: #f1c40f;
            }

            .popular-news-item__date {
              font-size: 12px;
              color: #8c98a4;
            }

            @media (max-width: 991px) {
              .news-detail-container {
                flex-direction: column;
              }

              .news-detail__main,
              .news-detail__sidebar {
                width: 100%;
              }

              .sidebar-widget {
                position: static;
              }
            }

            @media (max-width: 600px) {
              .news-detail__main {
                padding: 24px;
              }

              .sidebar-widget {
                padding: 24px;
              }
            }
          `,
        }}
      />

      <main className="news-detail-wrapper">
        <div className="news-detail-container">
          <article className="news-detail__main">
            <nav className="news-detail__breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Beranda</Link>
              <i className="fa-solid fa-chevron-right"></i>
              <Link href="/berita">Berita</Link>
              <i className="fa-solid fa-chevron-right"></i>
              <span>{article.title}</span>
            </nav>

            <h1 className="news-article__title">{article.title}</h1>

            <div className="news-article__meta">
              <span>
                <i className="fa-solid fa-calendar"></i> {formatDate(article.created_at)}
              </span>
              <span>
                <i className="fa-solid fa-user-pen"></i>{" "}
                {article.author || "Redaksi Bandara"}
              </span>
            </div>

            <DynamicImage
              src={article.image_url || fallbackImage}
              alt={article.title}
              width={1600}
              height={900}
              sizes="(max-width: 1200px) 100vw, 760px"
              className="news-article__hero"
            />

            <div className="news-article__content">{renderArticleContent(article.content)}</div>
          </article>

          <aside className="news-detail__sidebar">
            <div className="sidebar-widget">
              <h3 className="sidebar-widget__title">Berita Terpopuler</h3>
              <div className="popular-news-list">
                {sidebarNews.length > 0 ? (
                  sidebarNews.map((item) => (
                    <Link key={item.id} href={`/berita/${item.slug}`} className="popular-news-item">
                      <DynamicImage
                        src={item.image_url || sidebarFallbackImage}
                        alt={item.title}
                        width={80}
                        height={80}
                        sizes="80px"
                        className="popular-news-item__img"
                      />
                      <div className="popular-news-item__info">
                        <h4 className="popular-news-item__title">{item.title}</h4>
                        <span className="popular-news-item__date">
                          {formatDate(item.created_at)}
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm italic text-slate-400">Belum ada berita lainnya.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
