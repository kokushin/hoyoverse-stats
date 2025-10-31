/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.hoyoverse.com',
      },
      {
        protocol: 'https',
        hostname: '**.mihoyo.com',
      },
      {
        protocol: 'https',
        hostname: 'enka.network',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'api.mihomo.me',
      },
    ],
  },
};

export default nextConfig;
