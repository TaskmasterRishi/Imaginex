import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "replicate.delivery"
      },
      {
        protocol: "https",
        hostname: "sqpnoouughfpnbpfzbcd.supabase.co"
      },
    ]
  }
};

export default nextConfig;
