import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration for Vercel deployment with dynamic features
  images: {
    domains: ['vercel.app', 'vercel.com'],
    unoptimized: false,
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
  
  // Environment variables for build
  env: {
    CUSTOM_KEY: 'my-value',
  },
};

export default nextConfig;
