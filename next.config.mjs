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
    ],
  },
};

export default nextConfig;
