import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Old Wix site URLs → new Next.js routes
      {
        source: "/palletizingwithrobotics",
        destination: "/solutions/robotics",
        permanent: true,
      },
      {
        source: "/liquidrecovery",
        destination: "/solutions/evacupak",
        permanent: true,
      },
      {
        source: "/inspection-systems",
        destination: "/solutions/veripak",
        permanent: true,
      },
      {
        source: "/resources",
        destination: "/solutions",
        permanent: true,
      },
      {
        source: "/conveyorsolutions/:slug*",
        destination: "/solutions/conveyors",
        permanent: true,
      },
      {
        source: "/customsolutions",
        destination: "/solutions/intellipak",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
