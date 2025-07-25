const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable React Server Components
    serverActions: {
      bodySizeLimit: '2mb'
    },
    // Turbopack configuration
    turbo: {
      rules: {
        // Custom rules for Turbopack
      },
      resolve: {
        // Custom resolve options
      }
    }
  },
  images: {
    domains: ['images.unsplash.com'],
    // Enable new image optimization
    unoptimized: false,
    // Modern image formats
    formats: ['image/avif', 'image/webp']
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Add performance optimisations
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  // Add security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  },
};

module.exports = nextConfig;
