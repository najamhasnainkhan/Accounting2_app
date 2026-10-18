/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Required by NextAuth v5 in App Router
    typedRoutes: false,
  },
};

module.exports = nextConfig;
