import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ConveyorsHubContent } from "@/components/pages/conveyors-hub";
import { SystemArchitecture } from "@/components/sections/system-architecture";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/content/seo";
import { conveyorFAQs } from "@/data/conveyors";

export const metadata: Metadata = {
  title: pageMetadata.conveyors.title,
  description: pageMetadata.conveyors.description,
};

export default function ConveyorsPage() {
  return (
    <>
      <Navigation />
      <ConveyorsHubContent />
      <SystemArchitecture currentProduct="conveyors" />
      <FAQSection items={conveyorFAQs} />
      <CTASection />
      <Footer />
    </>
  );
}
