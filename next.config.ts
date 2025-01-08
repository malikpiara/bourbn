import type { NextConfig } from 'next';

const config: NextConfig = {
  webpack: (config) => {
    // First, let's handle the polyfill entry point
    const entry = async () => {
      const entries = await (typeof config.entry === 'function'
        ? config.entry()
        : config.entry);
      return {
        ...entries,
        // Add our polyfill as a new entry point
        polyfills: './polyfills.ts',
      };
    };

    // Now return the complete configuration
    return {
      ...config,
      entry, // Add our modified entry configuration
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          canvas: false,
        },
      },
    };
  },

  // Keep your existing headers configuration
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

  // Keep your existing experimental configuration
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
