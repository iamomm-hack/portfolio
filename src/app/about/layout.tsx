import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Om Kumar's product engineering practice, tools, and technical focus.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Om Kumar",
    description:
      "About Om Kumar's product engineering practice, tools, and technical focus.",
    url: "/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
