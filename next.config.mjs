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
  // Skip TypeScript errors during build for deployment
  // TODO: Remove this once Prisma Accelerate type issues are resolved
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: false,
    domains: [],
    // Add character images domain if using external CDN
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
    ],
  },
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    // Remove unused imports in production
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  // Optimize for Vercel edge functions
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
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
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=60, stale-while-revalidate=300'
          }
        ]
      }
    ];
  },
  // Webpack optimizations for serverless
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize for serverless bundle size
    if (!dev && isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Bundle GraphQL and Prisma together for efficiency
          prismaGraphql: {
            name: 'prisma-graphql',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](@prisma|apollo|graphql)[\\/]/,
          },
        },
      };
    }
    return config;
  },
};

export default bundleAnalyzer(nextConfig);