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
  applicationName: config.title,
  title: {
    default: config.title,
    template: `%s | ${config.compactTitle}`,
  },
  description: config.description.meta,
  keywords: config.keywords,
  authors: [{ name: config.author }],
  creator: config.author,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: config.title,
    description: config.description.social,
    url: config.site,
    siteName: config.title,
    images: [
      {
        url: config.ogImg,
        width: 1200,
        height: 630,
        alt: "Om Kumar full-stack development and Web3 portfolio",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: config.title,
    description: config.description.social,
    images: [config.ogImg],
  },
  appleWebApp: {
    capable: true,
    title: config.title,
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
  },
  manifest: "/manifest.webmanifest",
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
    "@graph": [
      {
        "@type": "Person",
        "@id": `${config.site}/#person`,
        name: config.author,
        url: config.site,
        email: `mailto:${config.email}`,
        jobTitle: "Full-Stack Developer",
        description: config.description.profile,
        knowsAbout: [
          "Full-Stack Development",
          "Web3",
          "Blockchain",
          "AI",
          "Backend Engineering",
          "React",
          "Next.js",
          "TypeScript",
          "Node.js",
          "Stellar",
          "Solidity",
          "Smart Contracts",
        ],
        sameAs: [
          config.social.github,
          config.social.linkedin,
          config.social.twitter,
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${config.site}/#website`,
        url: config.site,
        name: config.title,
        headline: config.title,
        description: config.description.meta,
        author: { "@id": `${config.site}/#person` },
      },
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
