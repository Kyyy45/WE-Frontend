import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'api.dicebear.com',
        protocol: 'https',
      },
      {
        hostname: 'ik.imagekit.io',
        protocol: 'https',
      },
      {
        protocol: 'https',
        hostname: 'alt.tailus.io',
        port: '',
        pathname: '/images/**',
      }
    ]
  }
};

export default nextConfig;
