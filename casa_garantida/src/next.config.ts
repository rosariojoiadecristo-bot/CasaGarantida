import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.56.1:3000', '192.168.56.1'],
  transpilePackages: ['@heroui/react'],
};

export default nextConfig;
