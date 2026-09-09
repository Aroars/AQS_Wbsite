import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ConveyorFamilyContent } from "@/components/pages/conveyor-family";
import { SystemArchitecture } from "@/components/sections/system-architecture";
import { CTASection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/content/seo";

export const metadata: Metadata = {
  title: pageMetadata.conveyorsPallet.title,
  description: pageMetadata.conveyorsPallet.description,
  alternates: { canonical: "https://www.automatedqs.com/solutions/conveyors/pallet" },
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
      <SystemArchitecture currentProduct="conveyors" />
      <CTASection />
      <Footer />
    </>
  );
}
