import type { Metadata } from "next";

// Dipakai HANYA bila tidak ada env sama sekali. Sengaja domain produksi
// supaya metadata (canonical, OG, sitemap) tidak pernah bocor ke localhost.
const FALLBACK_SITE_URL = "https://tardamuairport.id";

export const siteConfig = {
  name: "Bandar Udara Tardamu Sabu Raijua",
  shortName: "Bandara Tardamu",
  // Nama alternatif untuk pencarian bahasa Inggris ("tardamu airport").
  alternateName: ["Tardamu Airport", "Bandara Tardamu", "Bandar Udara Tardamu"],
  iataCode: "SAU",
  description:
    "Website resmi Bandar Udara Tardamu Sabu Raijua (Tardamu Airport) untuk informasi jadwal penerbangan, layanan penumpang, berita, dan layanan informasi publik.",
  keywords: [
    "Bandara Tardamu",
    "Bandar Udara Tardamu",
    "Tardamu Airport",
    "Bandara Sabu Raijua",
    "Bandara Sabu",
    "Bandara SAU",
    "jadwal penerbangan Sabu Raijua",
    "Sabu Raijua NTT",
  ],
  locale: "id_ID",
  defaultImage: "/assets/images/hero-bg.webp",
  logo: "/assets/images/logo-sau.png",
  geo: { latitude: -10.4941185, longitude: 121.8454013 },
  address: {
    locality: "Sabu Raijua",
    region: "Nusa Tenggara Timur",
    country: "ID",
  },
  sameAs: [
    "https://www.facebook.com/tardamusabuairport",
    "https://www.instagram.com/tardamuairport",
    "https://www.youtube.com/channel/UCGdlwT6j283tcnpAM7lfEgw",
    "https://www.tiktok.com/@tardamuairport",
  ],
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

// Structured data (schema.org) untuk memperkuat pencarian nama bandara dan
// membantu Google menampilkan knowledge panel / sitelinks.
export function buildAirportJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Airport",
        "@id": `${siteUrl}/#airport`,
        name: siteConfig.name,
        alternateName: siteConfig.alternateName,
        iataCode: siteConfig.iataCode,
        url: siteUrl,
        logo: buildAbsoluteUrl(siteConfig.logo),
        image: buildAbsoluteUrl(siteConfig.defaultImage),
        description: siteConfig.description,
        address: {
          "@type": "PostalAddress",
          addressLocality: siteConfig.address.locality,
          addressRegion: siteConfig.address.region,
          addressCountry: siteConfig.address.country,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: siteConfig.geo.latitude,
          longitude: siteConfig.geo.longitude,
        },
        sameAs: siteConfig.sameAs,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteConfig.name,
        alternateName: siteConfig.alternateName,
        inLanguage: "id-ID",
        publisher: { "@id": `${siteUrl}/#airport` },
      },
    ],
  };
}
