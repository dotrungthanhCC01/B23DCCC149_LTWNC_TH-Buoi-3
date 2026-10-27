import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Đảm bảo các file JSON trong /data được đóng gói khi deploy (Vercel)
  outputFileTracingIncludes: { "/**": ["./data/**/*", "./assets/**/*"] },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "avatars.githubusercontent.com" }],
  },
  async redirects() {
    return [{ source: "/subjects", destination: "/subjects/web-nang-cao", permanent: false }];
  },
};

export default nextConfig;
