import type { NextConfig } from "next";

// Governs the quoting-tool apps index (/apps) only.
// false sends /apps home with a 307 so browsers do not cache a permanent redirect.
// Flip to true to serve the page again.
const APPS_ENABLED = false;

const APPS_REDIRECTS: { source: string; destination: string; permanent: false }[] =
  APPS_ENABLED
    ? []
    : ["/apps", "/apps/:path*"].map((source) => ({ source, destination: "/", permanent: false }));

// The Engineering Toolbox and ROI calculator moved to Roars OS; old URLs go home.
const REMOVED_TOOL_REDIRECTS: { source: string; destination: string; permanent: true }[] = [
  "/toolbox",
  "/toolbox/:path*",
  "/calculators",
  "/calculators/:path*",
].map((source) => ({ source, destination: "/", permanent: true }));

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      ...REMOVED_TOOL_REDIRECTS,
      ...APPS_REDIRECTS,
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
