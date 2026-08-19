import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/black-cape-guide",
  assetPrefix: "/black-cape-guide",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;