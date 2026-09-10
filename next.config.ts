import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Toolbox: search-first slugs (2026-09)
      {
        source: "/toolbox/wearstrip-span-calculator",
        destination: "/toolbox/uhmw-wearstrip-span-calculator",
        permanent: true,
      },
      {
        source: "/toolbox/mdr-hub-motor-selection",
        destination: "/toolbox/mdr-motorized-roller-selection",
        permanent: true,
      },
      {
        source: "/toolbox/modular-belt-specs",
        destination: "/toolbox/modular-belt-comparison-chart",
        permanent: true,
      },
      {
        source: "/toolbox/guard-opening-distance",
        destination: "/toolbox/machine-guard-opening-distance",
        permanent: true,
      },
      {
        source: "/toolbox/friction-coefficient-chart",
        destination: "/toolbox/friction-coefficient-table",
        permanent: true,
      },
      {
        source: "/toolbox/air-fitting-thread-chart",
        destination: "/toolbox/pipe-thread-air-fitting-reference",
        permanent: true,
      },
      {
        source: "/toolbox/expression-calculator",
        destination: "/toolbox/engineering-expression-calculator",
        permanent: true,
      },
      {
        source: "/toolbox/electrical-power-calculator",
        destination: "/toolbox/panel-load-kw-to-amps-calculator",
        permanent: true,
      },
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
