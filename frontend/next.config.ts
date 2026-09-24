import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.ypfb.gob.bo',
      },
      {
        protocol: 'https',
        hostname: 'thumb.wikimedia.org',
      },
      // Aquí pa lo deel AWS
    ],
  },
};

export default nextConfig;