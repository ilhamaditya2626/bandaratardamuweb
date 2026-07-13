import type { MetadataRoute } from "next";
import { buildAbsoluteUrl } from "@/lib/seo";
import { getNewsSitemapEntries } from "@/services/news.service";

export const revalidate = 3600;

const staticRoutes: Array<{
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}> = [
  { path: "/", changeFrequency: "hourly", priority: 1 },
  { path: "/penerbangan", changeFrequency: "hourly", priority: 0.9 },
  { path: "/penumpang", changeFrequency: "daily", priority: 0.9 },
  { path: "/berita", changeFrequency: "daily", priority: 0.8 },
  { path: "/tentang", changeFrequency: "monthly", priority: 0.8 },
  { path: "/fasilitas", changeFrequency: "monthly", priority: 0.7 },
  { path: "/regulasi", changeFrequency: "monthly", priority: 0.7 },
  { path: "/ppid", changeFrequency: "weekly", priority: 0.8 },
  { path: "/unit-kerja", changeFrequency: "monthly", priority: 0.6 },
  { path: "/jelajah-sabu", changeFrequency: "weekly", priority: 0.8 },
  { path: "/destinasi-wisata", changeFrequency: "weekly", priority: 0.7 },
  { path: "/transportasi-akses", changeFrequency: "weekly", priority: 0.7 },
  { path: "/akomodasi-penginapan", changeFrequency: "weekly", priority: 0.7 },
  { path: "/informasi", changeFrequency: "weekly", priority: 0.8 },
  { path: "/informasi-berkala", changeFrequency: "weekly", priority: 0.7 },
  { path: "/laporan", changeFrequency: "weekly", priority: 0.7 },
  { path: "/informasi-dikecualikan", changeFrequency: "monthly", priority: 0.5 },
  { path: "/layanan-informasi", changeFrequency: "weekly", priority: 0.8 },
  { path: "/bantuan", changeFrequency: "monthly", priority: 0.7 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const newsEntries = await getNewsSitemapEntries().catch(() => []);
  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: buildAbsoluteUrl(route.path),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...newsEntries.map((article) => ({
      url: buildAbsoluteUrl(`/berita/${article.slug}`),
      lastModified: article.updated_at ?? article.created_at ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
