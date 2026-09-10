import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ToolboxLinks } from "@/components/sections/toolbox-links";
import { ConveyorFamilyContent } from "@/components/pages/conveyor-family";
import { SystemArchitecture } from "@/components/sections/system-architecture";
import { CTASection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/content/seo";

export const metadata: Metadata = {
  title: pageMetadata.conveyorsMdr.title,
  description: pageMetadata.conveyorsMdr.description,
  alternates: { canonical: "https://automatedqs.com/solutions/conveyors/mdr" },
  openGraph: {
    title: pageMetadata.conveyorsMdr.title,
    description: pageMetadata.conveyorsMdr.description,
  },
};

export default function ConveyorFamilyPage() {
  return (
    <>
      <Navigation />
      <ConveyorFamilyContent family="mdr" />
      <ToolboxLinks tools={['mdr-hub-motor-selection', 'conveyor-speed-calculator', 'conveyor-throughput-calculator', 'line-flow-simulator', 'belt-pull-calculator', 'light-curtain-safety-distance-calculator']} title="Size an MDR Line Yourself" />
      <SystemArchitecture currentProduct="conveyors" />
      <CTASection />
      <Footer />
    </>
  );
}
