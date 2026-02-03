import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@prisma/client', 'bcrypt'],
  env: {
    DOCKER_ENV: process.env.DOCKER_ENV || 'false',
  },
  // 禁用图片优化以减小镜像大小
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
