import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/ticket-stats", destination: "/stats", permanent: false },
      { source: "/faq", destination: "/about", permanent: false },
    ];
  },
};

export default nextConfig;
