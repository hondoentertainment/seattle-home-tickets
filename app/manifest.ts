import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Seattle Home Tickets",
    short_name: "SEA Homes",
    description:
      "Published Seattle home games with unofficial mid-tier estimates. Not a box office.",
    start_url: "/",
    display: "standalone",
    background_color: "#06110e",
    theme_color: "#06110e",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
