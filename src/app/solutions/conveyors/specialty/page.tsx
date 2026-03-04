import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ConveyorsSpecialtyContent } from "@/components/pages/conveyors-specialty";
import { SystemArchitecture } from "@/components/sections/system-architecture";
import { CTASection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/content/seo";

export const metadata: Metadata = {
  title: pageMetadata.conveyorsSpecialty.title,
  description: pageMetadata.conveyorsSpecialty.description,
};

export default function ConveyorsSpecialtyPage() {
  return (
    <>
      <Navigation />
      <ConveyorsSpecialtyContent />
      <SystemArchitecture currentProduct="conveyors" />
      <CTASection />
      <Footer />
    </>
  );
}
