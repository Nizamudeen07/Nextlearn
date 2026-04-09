/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nexlearn.noviindusdemosites.in',
      },
    ],
  },
};

export default nextConfig;
