import type { MetadataRoute } from "next";

import { getBlogPosts } from "@/lib/mdx";
import { config } from "@/data/config";
import { FEATURED_PROJECT_IDS } from "@/data/project-records";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/blogs", "/contact", "/projects"];
  const projectRoutes = FEATURED_PROJECT_IDS.map((id) => `/projects/${id}`);
  const blogRoutes = getBlogPosts().map((post) => `/blogs/${post.slug}`);

  return [...staticRoutes, ...projectRoutes, ...blogRoutes].map((route) => ({
    url: `${config.site}${route}`,
    changeFrequency: route === "" ? "monthly" : "yearly",
    priority: route === "" ? 1 : 0.7,
  }));
}
