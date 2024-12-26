/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during build
  },
  typescript: {
    ignoreBuildErrors: true, // Disable TypeScript type checking during build
  },
};

export default nextConfig;
