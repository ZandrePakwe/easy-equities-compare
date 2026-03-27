import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "compare.easyequities.co.za",
        pathname: "/hubfs/**",
      },
    ],
  },
};

export default nextConfig;
