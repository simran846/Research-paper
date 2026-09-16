import type { NextConfig } from "next";

const backendUrl = process.env.INTERNAL_API_URL || process.env.BACKEND_URL || "http://127.0.0.1:8000";
const targetApiUrl = backendUrl.endsWith("/api") ? backendUrl : `${backendUrl}/api`;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${targetApiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
