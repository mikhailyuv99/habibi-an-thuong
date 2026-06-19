import { SiteShell } from "@/components/habibi/SiteShell";
import { HERO_IMAGE } from "@/components/habibi/Hero";
import type { Metadata } from "next";
import { client, phoneHref } from "@/lib/client";
import { cityForTitle, metaDescription } from "@/lib/copy";
import { fontVariables, themeStyle } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${client.slug}.vercel.app`),
  title: `${client.name} | ${cityForTitle()}`,
  description: metaDescription(),
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: client.name,
    description: metaDescription(),
    images: [{ url: HERO_IMAGE, width: 1200, height: 630, alt: client.name }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: client.name,
    description: metaDescription(),
    images: [HERO_IMAGE],
  },
};

function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: client.name,
    image: [HERO_IMAGE, "/brand/logo.png"],
    address: client.address,
    telephone: phoneHref,
    url: client.maps_url,
    ...(client.rating != null
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: client.rating,
            reviewCount: client.review_count ?? client.reviews.length,
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} style={themeStyle()}>
      <head>
        <link rel="stylesheet" href="/habibi.css" />
        <link rel="preconnect" href="https://maps.google.com" />
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://maps.google.com" />
        <link rel="preload" as="image" href="/brand/logo.png" />
        <link rel="preload" as="image" href="/photos/maps/photo-22.jpg" />
        <LocalBusinessJsonLd />
      </head>
      <body className="antialiased" style={{ background: "#fbf3e1" }}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
