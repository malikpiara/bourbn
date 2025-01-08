import type { NextConfig } from 'next';

const config: NextConfig = {
  webpack: (config) => {
    // Type assertion for the config object
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          canvas: false,
        },
      },
    };
  },
  // Configure headers for PDF.js worker
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
  // Allow worker to be loaded
  experimental: {
    turbo: {
      rules: {
        resolveAlias: {
          canvas: false,
        },
      },
    },
  },
};

export default config;
