import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { IntelliPakContent } from "@/components/pages/intellipak-page";
import { SystemArchitecture } from "@/components/sections/system-architecture";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/content/seo";
import { intellipakFAQs } from "@/data/intellipak";

export const metadata: Metadata = {
  title: pageMetadata.intellipak.title,
  description: pageMetadata.intellipak.description,
  openGraph: {
    title: pageMetadata.intellipak.title,
    description: pageMetadata.intellipak.description,
  },
};

export default function IntelliPakPage() {
  const schema = {"@context":"https://schema.org","@type":"Product","name":"IntelliPak Feed Systems","description":"Smart conveyor system with precision gapping and intelligent batching for sanitary packaging lines. Up to 500 PPM, up to 7 independent belt zones, on-the-fly batch size changes.","manufacturer":{"@type":"Organization","name":"Automated Quality Solutions"},"category":"Feed Systems","url":"https://www.automatedqs.com/solutions/intellipak"};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Navigation />
      <IntelliPakContent />
      <SystemArchitecture currentProduct="intellipak" />
      <FAQSection items={intellipakFAQs} />
      <CTASection />
      <Footer />
    </>
  );
}
