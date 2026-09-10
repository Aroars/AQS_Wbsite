import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ToolboxLinks } from "@/components/sections/toolbox-links";
import { ConveyorsHubContent } from "@/components/pages/conveyors-hub";
import { SystemArchitecture } from "@/components/sections/system-architecture";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/content/seo";
import { conveyorFAQs } from "@/data/conveyors";

export const metadata: Metadata = {
  title: pageMetadata.conveyors.title,
  description: pageMetadata.conveyors.description,
  openGraph: {
    title: pageMetadata.conveyors.title,
    description: pageMetadata.conveyors.description,
  },
  alternates: { canonical: "https://automatedqs.com/solutions/conveyors" },
};

export default function ConveyorsPage() {
  const schema = {"@context":"https://schema.org","@type":"Service","name":"Custom Sanitary Conveyor Systems","description":"Custom-engineered sanitary conveyors: belt, modular, MDR, chain, incline, accumulation, merge/divert, freezer, and washdown pallet systems.","provider":{"@type":"Organization","name":"Automated Quality Solutions"},"serviceType":"Custom Conveyor Engineering","areaServed":"US","url":"https://automatedqs.com/solutions/conveyors"};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Navigation />
      <ConveyorsHubContent />
      <ToolboxLinks tools={['belt-pull-calculator', 'conveyor-speed-calculator', 'conveyor-throughput-calculator', 'mdr-motorized-roller-selection', 'incline-conveyor-calculator', 'uhmw-wearstrip-span-calculator']} />
      <SystemArchitecture currentProduct="conveyors" />
      <FAQSection items={conveyorFAQs} />
      <CTASection />
      <Footer />
    </>
  );
}
