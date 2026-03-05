import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { VeriPakLeakDetectionContent } from "@/components/pages/veripak-leak-detection";
import { SystemArchitecture } from "@/components/sections/system-architecture";
import { CTASection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/content/seo";

export const metadata: Metadata = {
  title: pageMetadata.veripakLeakDetection.title,
  description: pageMetadata.veripakLeakDetection.description,
};

export default function VeriPakLeakDetectionPage() {
  return (
    <>
      <Navigation />
      <VeriPakLeakDetectionContent />
      <SystemArchitecture currentProduct="veripak" />
      <CTASection />
      <Footer />
    </>
  );
}
