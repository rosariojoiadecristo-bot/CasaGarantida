import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.56.1:3000', '192.168.56.1'],
  transpilePackages: ['@heroui/react', '@kinde-oss/kinde-auth-nextjs', '@kinde-oss/kinde-auth-react'],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5160",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;