/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "iili.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "w3.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "files.oaiusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**", // Fallback for all other HTTPS sources
      },
    ],
  },
};

module.exports = nextConfig;