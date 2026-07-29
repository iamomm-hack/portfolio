import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected product engineering work by Om Kumar.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects — Om Kumar",
    description: "Selected product engineering work by Om Kumar.",
    url: "/projects",
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
