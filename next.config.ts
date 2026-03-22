import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@wopr-network/platform-ui-core"],
};

export default nextConfig;
