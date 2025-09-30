import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "4ef45ee1c7cf.ngrok-free.app",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "4ef45ee1c7cf.ngrok-free.app",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "a9c5955352d5.ngrok-free.app",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
