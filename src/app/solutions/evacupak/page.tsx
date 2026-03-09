import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { EvacuPakContent } from "@/components/pages/evacupak-page";
import { SystemArchitecture } from "@/components/sections/system-architecture";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/content/seo";

export const metadata: Metadata = {
  title: pageMetadata.evacupak.title,
  description: pageMetadata.evacupak.description,
  openGraph: {
    title: pageMetadata.evacupak.title,
    description: pageMetadata.evacupak.description,
  },
};

export default function EvacuPakPage() {
  const schema = {"@context":"https://schema.org","@type":"Product","name":"EvacuPak Liquid Recovery System","description":"Patented fluid recovery with up to 97% product recovery from packaging. 3A certified hygienic lances, CIP capable, full HACCP traceability.","manufacturer":{"@type":"Organization","name":"Automated Quality Solutions"},"category":"Liquid Recovery Systems","url":"https://www.automatedqs.com/solutions/evacupak"};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Navigation />
      <EvacuPakContent />
      <SystemArchitecture currentProduct="evacupak" />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
}
