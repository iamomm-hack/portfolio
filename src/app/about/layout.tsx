import type { Metadata } from "next";

import { config } from "@/data/config";

export const metadata: Metadata = {
  title: "About",
  description: config.description.profile,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About | ${config.compactTitle}`,
    description: config.description.profile,
    url: "/about",
    siteName: config.title,
    images: [config.ogImg],
  },
  twitter: {
    card: "summary_large_image",
    title: `About | ${config.compactTitle}`,
    description: config.description.profile,
    images: [config.ogImg],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
