import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow all local images; add external hostnames here if needed
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Uncomment for Vercel Edge/standalone deployments:
  // output: "standalone",
};

export default nextConfig;
