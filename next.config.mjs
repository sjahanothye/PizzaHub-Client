/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'i.ibb.co',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure no reload issues on production routes
  reactStrictMode: false,
};

export default nextConfig;
