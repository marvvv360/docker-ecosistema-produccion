import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // <-- ¡Indispensable para el Dockerfile multi-stage!
};

export default nextConfig;
