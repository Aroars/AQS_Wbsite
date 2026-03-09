import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ConveyorsBeltSystemsContent } from "@/components/pages/conveyors-belt-systems";
import { SystemArchitecture } from "@/components/sections/system-architecture";
import { CTASection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/content/seo";

export const metadata: Metadata = {
  title: pageMetadata.conveyorsBelt.title,
  description: pageMetadata.conveyorsBelt.description,
  openGraph: {
    title: pageMetadata.conveyorsBelt.title,
    description: pageMetadata.conveyorsBelt.description,
  },
};

export default function ConveyorsBeltPage() {
  return (
    <>
      <Navigation />
      <ConveyorsBeltSystemsContent />
      <SystemArchitecture currentProduct="conveyors" />
      <CTASection />
      <Footer />
    </>
  );
}
