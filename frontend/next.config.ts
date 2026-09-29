import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.8.215"],

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

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8080/api/:path*',
      },
    ];
  },
};

export default nextConfig;