import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ConveyorsProjectsContent } from "@/components/pages/conveyors-projects";
import { SystemArchitecture } from "@/components/sections/system-architecture";
import { ConveyorCTA } from "@/components/sections/conveyor-cta";
import { pageMetadata } from "@/content/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbList } from "@/lib/schema";

export const metadata: Metadata = {
  title: pageMetadata.conveyorsProjects.title,
  description: pageMetadata.conveyorsProjects.description,
  alternates: { canonical: "https://automatedqs.com/solutions/conveyors/projects" },
  openGraph: {
    title: pageMetadata.conveyorsProjects.title,
    description: pageMetadata.conveyorsProjects.description,
  },
};

export default function ConveyorsProjectsPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbList([
            { name: "Home", path: "/" },
            { name: "Sanitary Conveyors", path: "/solutions/conveyors" },
            { name: "Projects", path: "/solutions/conveyors/projects" },
          ]),
        ]}
      />
      <Navigation />
      <ConveyorsProjectsContent />
      <SystemArchitecture currentProduct="conveyors" />
      <ConveyorCTA />
      <Footer />
    </>
  );
}
