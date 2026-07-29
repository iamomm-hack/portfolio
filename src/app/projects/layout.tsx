import type { Metadata } from "next";

import { config } from "@/data/config";

export const metadata: Metadata = {
  title: "Projects",
  description: config.description.meta,
  alternates: { canonical: "/projects" },
  openGraph: {
    title: `Projects | ${config.compactTitle}`,
    description: config.description.meta,
    url: "/projects",
    siteName: config.title,
    images: [config.ogImg],
  },
  twitter: {
    card: "summary_large_image",
    title: `Projects | ${config.compactTitle}`,
    description: config.description.meta,
    images: [config.ogImg],
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
