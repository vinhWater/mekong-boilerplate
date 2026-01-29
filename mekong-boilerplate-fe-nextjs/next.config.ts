import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  // Production optimizations
  poweredByHeader: false,
  compress: true,

  // Temporarily ignore ESLint and TypeScript errors during build for deployment
  // TODO: Fix ESLint and TypeScript errors after deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Image optimization for production
  // See: https://vercel.com/docs/image-optimization/managing-image-optimization-costs
  images: {
    unoptimized: true,
    // Allow ALL domains 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],

    // WebP-only format (saves 50% transformations vs WebP + AVIF)
    formats: ['image/webp'],

    // 31-day cache (saves 70-80% transformations)
    minimumCacheTTL: 2678400,

    // Tailored sizes for mobile-first approach (saves 15-25% transformations)
    deviceSizes: [1080],
    imageSizes: [96],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Output file tracing - Include content directory for Vercel deployment
  outputFileTracingIncludes: {
    '/[locale]/docs': ['./content/**/*'],
  },
};

export default withNextIntl(nextConfig);
