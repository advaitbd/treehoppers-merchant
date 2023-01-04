/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler:{
    styledComponents: true,
  },
  webpack: (config, { isServer }) => {
    
    // If client-side, don't polyfill `fs`
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    return config;
  },
  env: {
    JWT: process.env.JWT,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
  }
}

module.exports = nextConfig
