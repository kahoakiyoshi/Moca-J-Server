import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: ".",
  },
  allowedDevOrigins: [
    "*"
  ],
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/public/upload-audio',
          destination: '/api/public/upload-audio',
        },
      ],
    };
  },
} as any;

export default nextConfig;
