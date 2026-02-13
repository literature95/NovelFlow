/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    DOCKER_ENV: process.env.DOCKER_ENV || 'false',
  },
  // 禁用图片优化以减小镜像大小
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;