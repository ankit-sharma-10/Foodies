/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  serverExternalPackages: ['better-sqlite3'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  outputFileTracingIncludes: {
    '/**': ['./meals.db'],
  },
};

export default nextConfig;
