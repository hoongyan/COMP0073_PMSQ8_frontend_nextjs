import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true, // Skip ESLint during production builds
      },
    typescript: {
        ignoreBuildErrors: true,
      },
};

export default nextConfig;