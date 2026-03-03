import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ConveyorsContent } from "@/components/pages/conveyors-page";
import { SystemArchitecture } from "@/components/sections/system-architecture";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/content/seo";

export const metadata: Metadata = {
  title: pageMetadata.conveyors.title,
  description: pageMetadata.conveyors.description,
};

export default function ConveyorsPage() {
  return (
    <>
      <Navigation />
      <ConveyorsContent />
      <SystemArchitecture currentProduct="conveyors" />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
}
