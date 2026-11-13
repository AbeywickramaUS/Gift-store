import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable caching of React Server Components
  cacheComponents: true,

  // Partial prefetching for faster navigation
  partialPrefetching: true,

  // Allow images from Supabase Storage domain
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },

  // Turbopack (dev) CSS config
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
