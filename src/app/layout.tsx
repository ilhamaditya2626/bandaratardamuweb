import type { Metadata } from "next";
import "./globals.css";
import { getSiteUrl, siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: siteConfig.shortName,
  title: siteConfig.shortName,
  description: siteConfig.description,
  icons: {
    icon: "/assets/favicon.ico",
    shortcut: "/assets/favicon.ico",
  },
  openGraph: {
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: siteConfig.defaultImage,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [siteConfig.defaultImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { QueryProvider } from "@/components/providers/query-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
