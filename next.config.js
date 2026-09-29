/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },

  experimental: {
    appDir: false,
    esmExternals: "loose",
  },

  transpilePackages: ["nsfwjs"], // ✅ IMPORTANT

  webpack: (config) => {
    // ✅ FIX buffer issue
    config.resolve.alias = {
      ...config.resolve.alias,
      buffer: "buffer/index.js",
    };

    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve("buffer/"),
    };

    return config;
  },
};

module.exports = nextConfig;