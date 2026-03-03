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
};

export default function IntelliPakPage() {
  return (
    <>
      <Navigation />
      <IntelliPakContent />
      <SystemArchitecture currentProduct="intellipak" />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
}
