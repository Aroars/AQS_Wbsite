import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { VeriPakFullInspectionContent } from "@/components/pages/veripak-full-inspection";
import { SystemArchitecture } from "@/components/sections/system-architecture";
import { CTASection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/content/seo";

export const metadata: Metadata = {
  title: pageMetadata.veripakFullInspection.title,
  description: pageMetadata.veripakFullInspection.description,
};

export default function VeriPakFullInspectionPage() {
  return (
    <>
      <Navigation />
      <VeriPakFullInspectionContent />
      <SystemArchitecture currentProduct="veripak" />
      <CTASection />
      <Footer />
    </>
  );
}
