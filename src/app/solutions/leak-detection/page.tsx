import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { LeakDetectionContent } from "@/components/pages/leak-detection-page";
import { SystemArchitecture } from "@/components/sections/system-architecture";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/content/seo";

export const metadata: Metadata = {
  title: pageMetadata.leakDetection.title,
  description: pageMetadata.leakDetection.description,
  openGraph: {
    title: pageMetadata.leakDetection.title,
    description: pageMetadata.leakDetection.description,
  },
};

export default function LeakDetectionPage() {
  const schema = {"@context":"https://schema.org","@type":"Service","name":"Leak Detection — Dual-Pull Suction Technology","description":"VeriPak SCADA module — mechanical dual-pull suction system that detects pinholes, grease-in-seal, and board cuts that camera systems miss. Patent pending. Available through the Founding Partner Program.","provider":{"@type":"Organization","name":"Automated Quality Solutions"},"serviceType":"Leak Detection Systems","areaServed":"US","url":"https://www.automatedqs.com/solutions/leak-detection"};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Navigation />
      <LeakDetectionContent />
      <SystemArchitecture currentProduct="leak-detection" />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
}
