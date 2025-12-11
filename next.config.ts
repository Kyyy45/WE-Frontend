import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Pengaturan ukuran dan format gambar (tidak perlu diubah)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    formats: ['image/webp'], 
    
    // DAFTAR DOMAIN GAMBAR YANG DIIZINKAN
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      }
    ],
  },
};

export default nextConfig;