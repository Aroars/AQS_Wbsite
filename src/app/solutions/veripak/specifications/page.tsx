import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { VeriPakSpecificationsContent } from "@/components/pages/veripak-specifications";
import { SystemArchitecture } from "@/components/sections/system-architecture";
import { CTASection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/content/seo";

export const metadata: Metadata = {
  title: pageMetadata.veripakSpecifications.title,
  description: pageMetadata.veripakSpecifications.description,
  openGraph: {
    title: pageMetadata.veripakSpecifications.title,
    description: pageMetadata.veripakSpecifications.description,
  },
};

export default function VeriPakSpecificationsPage() {
  return (
    // data-theme-ready: this route is on the light/dark token model (see globals.css)
    <div data-theme-ready>
      <Navigation />
      <VeriPakSpecificationsContent />
      <SystemArchitecture currentProduct="veripak" />
      <CTASection />
      <Footer />
    </div>
  );
}
