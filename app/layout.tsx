import type { CSSProperties, ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif } from "next/font/google";

import {
  brandVariables,
  openingHoursSpecification,
  site,
} from "@/lib/site";
import "./globals.css";

/* --------------------------------------------------------------------------
   Type
   Instrument Serif is used at display sizes only; Archivo carries every piece
   of UI text. Both are self-hosted by next/font, so there is no render-blocking
   request to fonts.googleapis.com and no layout shift.
   -------------------------------------------------------------------------- */
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const sans = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-archivo",
  display: "swap",
});

const metaTitle = `${site.name} — ${site.tagline}`;

/* Absolute URL for a file in /public. Built from site.url rather than left
   relative to metadataBase, because a GitHub Pages project page is served from a
   subpath: a bare "/images/og.jpg" would resolve against the domain root and
   silently drop the /<repo> prefix, producing a broken social card. */
const absolute = (path: string) => `${site.url.replace(/\/$/, "")}${path}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: metaTitle,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: absolute("/") },
  openGraph: {
    type: "website",
    url: absolute("/"),
    siteName: site.name,
    title: metaTitle,
    description: site.description,
    locale: "en_US",
    images: [
      {
        url: absolute("/images/og.jpg"),
        width: 1200,
        height: 630,
        alt: `${site.name}, ${site.industry}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: metaTitle,
    description: site.description,
    images: [absolute("/images/og.jpg")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport: Viewport = {
  themeColor: site.brand.ink,
  colorScheme: "light",
};

/* --------------------------------------------------------------------------
   Structured data
   Address, contact details and opening hours are read from lib/site.ts, so the
   markup can never disagree with what is rendered on the page.
   -------------------------------------------------------------------------- */
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": site.url,
  name: site.name,
  description: site.description,
  url: site.url,
  telephone: site.contact.phoneHref,
  email: site.contact.email,
  image: absolute("/images/og.jpg"),
  address: {
    "@type": "PostalAddress",
    streetAddress: site.visit.address.street,
    addressLocality: site.visit.address.locality,
    addressRegion: site.visit.address.region,
    postalCode: site.visit.address.postalCode,
    addressCountry: site.visit.address.country,
  },
  openingHoursSpecification: openingHoursSpecification(),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  /* The brand palette is the single source of truth in lib/site.ts. Casting is
     required because React's CSSProperties has no index signature for custom
     properties. */
  const brandStyle = brandVariables() as unknown as CSSProperties;

  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} style={brandStyle}>
      <body>
        <div id="top" aria-hidden="true" />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-[2px] focus:bg-ink focus:px-4 focus:py-2.5 focus:text-[0.72rem] focus:font-medium focus:tracking-[0.16em] focus:text-paper focus:uppercase"
        >
          Skip to content
        </a>

        {children}

        {/* Decorative paper grain. Remove this and the `.grain` rule in
            globals.css for a flat background. */}
        <div className="grain" aria-hidden="true" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
