import type { NextConfig } from "next";

// Get the API URL from environment variable
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiUrlObj = new URL(apiUrl || "");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: apiUrlObj.protocol.replace(":", "") as "http" | "https",
        hostname: apiUrlObj.hostname,
        ...(apiUrlObj.port && { port: apiUrlObj.port }),
        pathname: "/uploads/**",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
