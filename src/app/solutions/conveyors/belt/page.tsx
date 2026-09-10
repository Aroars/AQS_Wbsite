import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ToolboxLinks } from "@/components/sections/toolbox-links";
import { ConveyorFamilyContent } from "@/components/pages/conveyor-family";
import { SystemArchitecture } from "@/components/sections/system-architecture";
import { CTASection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/content/seo";

export const metadata: Metadata = {
  title: pageMetadata.conveyorsBeltFamily.title,
  description: pageMetadata.conveyorsBeltFamily.description,
  alternates: { canonical: "https://automatedqs.com/solutions/conveyors/belt" },
  openGraph: {
    title: pageMetadata.conveyorsBeltFamily.title,
    description: pageMetadata.conveyorsBeltFamily.description,
  },
};

export default function ConveyorFamilyPage() {
  return (
    <>
      <Navigation />
      <ConveyorFamilyContent family="belt" />
      <ToolboxLinks tools={['belt-pull-calculator', 'uhmw-wearstrip-span-calculator', 'incline-conveyor-calculator', 'conveyor-speed-calculator', 'conveyor-throughput-calculator', 'friction-coefficient-table']} title="Size a Belt Conveyor Yourself" />
      <SystemArchitecture currentProduct="conveyors" />
      <CTASection />
      <Footer />
    </>
  );
}
