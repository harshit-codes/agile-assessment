/** @type {import('next').NextConfig} */
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  experimental: {
    optimizeCss: true,
    // Prevent FOUC by optimizing font loading
    optimizeServerReact: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: false,
    domains: [],
  },
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Font optimization is handled by Next.js automatically
  // Preload critical resources
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Link',
            value: '<https://fonts.googleapis.com>; rel=preconnect'
          }
        ]
      }
    ];
  },
};

export default bundleAnalyzer(nextConfig);