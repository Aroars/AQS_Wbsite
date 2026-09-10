import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ToolboxLinks } from "@/components/sections/toolbox-links";
import { ConveyorFamilyContent } from "@/components/pages/conveyor-family";
import { SystemArchitecture } from "@/components/sections/system-architecture";
import { CTASection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/content/seo";

export const metadata: Metadata = {
  title: pageMetadata.conveyorsPallet.title,
  description: pageMetadata.conveyorsPallet.description,
  alternates: { canonical: "https://automatedqs.com/solutions/conveyors/pallet" },
  openGraph: {
    title: pageMetadata.conveyorsPallet.title,
    description: pageMetadata.conveyorsPallet.description,
  },
};

export default function ConveyorFamilyPage() {
  return (
    <>
      <Navigation />
      <ConveyorFamilyContent family="pallet" />
      <ToolboxLinks tools={['conveyor-throughput-calculator', 'conveyor-speed-calculator', 'mdr-motorized-roller-selection', 'belt-pull-calculator', 'light-curtain-safety-distance-calculator', 'machine-guard-opening-distance']} title="Size a Pallet Line Yourself" />
      <SystemArchitecture currentProduct="conveyors" />
      <CTASection />
      <Footer />
    </>
  );
}
