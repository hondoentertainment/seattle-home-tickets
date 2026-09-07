import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "lh4.googleusercontent.com" },
      { protocol: "https", hostname: "lh5.googleusercontent.com" },
      { protocol: "https", hostname: "lh6.googleusercontent.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/ticket-stats", destination: "/stats", permanent: false },
      { source: "/faq", destination: "/about", permanent: false },
    ];
  },
};

export default nextConfig;
