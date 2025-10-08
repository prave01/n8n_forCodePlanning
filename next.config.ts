import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import type { NextConfig } from "next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "zod/v3": resolve(__dirname, "node_modules/zod/index.mjs"),
    };
    return config;
  },
};

export default nextConfig;
