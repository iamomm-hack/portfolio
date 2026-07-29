import type { MetadataRoute } from "next";

import { config } from "@/data/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: config.title,
    short_name: config.compactTitle,
    description: config.description.profile,
    start_url: "/",
    display: "standalone",
    background_color: "#07090a",
    theme_color: "#07090a",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
