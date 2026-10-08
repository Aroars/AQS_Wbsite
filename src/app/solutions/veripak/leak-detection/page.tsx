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
  openGraph: {
    title: pageMetadata.veripakLeakDetection.title,
    description: pageMetadata.veripakLeakDetection.description,
  },
};

export default function VeriPakLeakDetectionPage() {
  return (
    // data-theme-ready: this route is on the light/dark token model (see globals.css)
    <div data-theme-ready>
      <Navigation />
      <VeriPakLeakDetectionContent />
      <SystemArchitecture currentProduct="veripak" />
      <CTASection />
      <Footer />
    </div>
  );
}
