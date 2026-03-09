import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { VeriPakHubContent } from "@/components/pages/veripak-hub";
import { SystemArchitecture } from "@/components/sections/system-architecture";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/content/seo";
import { veripakFAQs } from "@/data/veripak";

export const metadata: Metadata = {
  title: pageMetadata.veripak.title,
  description: pageMetadata.veripak.description,
  openGraph: {
    title: pageMetadata.veripak.title,
    description: pageMetadata.veripak.description,
  },
};

export default function VeriPakPage() {
  const schema = {"@context":"https://schema.org","@type":"Product","name":"VeriPak Standalone SCADA Platform","description":"Packaging quality control SCADA system with real-time dashboards, sub-second alerts, auto line stop, and audit-ready records. Allen-Bradley CompactLogix, no middleware required.","manufacturer":{"@type":"Organization","name":"Automated Quality Solutions"},"category":"SCADA Systems","url":"https://www.automatedqs.com/solutions/veripak"};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Navigation />
      <VeriPakHubContent />
      <SystemArchitecture currentProduct="veripak" />
      <FAQSection items={veripakFAQs} />
      <CTASection />
      <Footer />
    </>
  );
}
