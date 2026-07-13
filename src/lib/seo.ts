import type { Metadata } from "next";

const FALLBACK_SITE_URL = "http://127.0.0.1:3000";

export const siteConfig = {
  name: "Bandar Udara Tardamu Sabu Raijua",
  shortName: "Bandara Tardamu",
  description:
    "Website resmi Bandar Udara Tardamu Sabu Raijua untuk informasi jadwal penerbangan, layanan penumpang, berita, dan layanan informasi publik.",
  locale: "id_ID",
  defaultImage: "/assets/images/hero-bg.webp",
};

export function getSiteUrl() {
  const rawUrl =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.BETTER_AUTH_URL ||
    FALLBACK_SITE_URL;

  return rawUrl.replace(/\/$/, "");
}

export function buildAbsoluteUrl(path = "/") {
  return new URL(path, `${getSiteUrl()}/`).toString();
}

export function stripHtml(content: string, maxLength = 160) {
  const normalized = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 3).trimEnd()}...`;
}

type BuildPageMetadataInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
};

export function buildPageMetadata({
  title,
  description,
  path = "/",
  image = siteConfig.defaultImage,
  keywords,
  noIndex,
  type = "website",
  publishedTime,
  modifiedTime,
}: BuildPageMetadataInput): Metadata {
  const canonical = buildAbsoluteUrl(path);
  const imageUrl = image.startsWith("http") ? image : buildAbsoluteUrl(image);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [
        {
          url: imageUrl,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
  };
}
