import type { Metadata } from "next";
import "@fontsource-variable/inter/wght.css";
import "@fontsource/archivo-black/latin-400.css";
import "./globals.css";
import { config } from "@/data/config";

import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import Script from "next/script";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  metadataBase: new URL(config.site),
  title: {
    default: config.title,
    template: "%s — Om Kumar",
  },
  description: config.description.long,
  keywords: config.keywords,
  authors: [{ name: config.author }],
  creator: config.author,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: config.title,
    description: config.description.short,
    url: config.site,
    siteName: config.author,
    images: [
      {
        url: config.ogImg,
        width: 1200,
        height: 630,
        alt: "Om Kumar product engineering portfolio",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: config.title,
    description: config.description.short,
    images: [config.ogImg],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: config.author,
    url: config.site,
    email: `mailto:${config.email}`,
    jobTitle: "Product Engineer",
    sameAs: [
      config.social.github,
      config.social.linkedin,
      config.social.twitter,
    ],
  };

  return (
    <html lang="en" className="dark font-sans">
      <head>
        {process.env.UMAMI_DOMAIN && process.env.UMAMI_SITE_ID ? (
          <Script
            defer
            src={process.env.UMAMI_DOMAIN}
            data-website-id={process.env.UMAMI_SITE_ID}
          />
        ) : null}
      </head>
      <body>
        <script
          id="person-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
