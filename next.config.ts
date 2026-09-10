import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Toolbox: the belt load page became the throughput calculator
      {
        source: "/toolbox/belt-load-calculator",
        destination: "/toolbox/conveyor-throughput-calculator",
        permanent: true,
      },
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
      // 2026-09 conveyor families: old category pages → belt / mdr / pallet
      { source: "/solutions/conveyors/belt-systems", destination: "/solutions/conveyors/belt", permanent: true },
      { source: "/solutions/conveyors/roller-drive", destination: "/solutions/conveyors/mdr", permanent: true },
      { source: "/solutions/conveyors/specialty", destination: "/solutions/conveyors/pallet", permanent: true },
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
