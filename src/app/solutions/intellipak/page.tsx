import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { IntelliPakContent } from "@/components/pages/intellipak-page";
import { SystemArchitecture } from "@/components/sections/system-architecture";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/content/seo";

export const metadata: Metadata = {
  title: pageMetadata.intellipak.title,
  description: pageMetadata.intellipak.description,
  openGraph: {
    title: pageMetadata.intellipak.title,
    description: pageMetadata.intellipak.description,
  },
};

export default function IntelliPakPage() {
  const schema = {"@context":"https://schema.org","@type":"Product","name":"IntelliPak Feed Systems","description":"Mag-Drive powered precision infeed for sanitary packaging lines. Gap, merge, collate, and time products at up to 500 PPM with zero gears and zero oil.","manufacturer":{"@type":"Organization","name":"Automated Quality Solutions"},"category":"Feed Systems","url":"https://www.automatedqs.com/solutions/intellipak"};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Navigation />
      <IntelliPakContent />
      <SystemArchitecture currentProduct="intellipak" />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
}
