/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.BUILD_STANDALONE === 'true' ? { output: 'standalone' } : {}),
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    domains: ['cdn.hello-hi.in', 'hello-hi.in', 'images.unsplash.com']
  }
};

module.exports = nextConfig;

