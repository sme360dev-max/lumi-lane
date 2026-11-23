import type { NextConfig } from 'next';

// Static export for Cloudflare Pages. The Django backend is called directly from the browser.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  devIndicators: false,
  poweredByHeader: false,
};

export default nextConfig;
