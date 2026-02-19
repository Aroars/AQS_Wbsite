import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { VeriPakContent } from "@/components/pages/veripak-page";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/content/seo";

export const metadata: Metadata = {
  title: pageMetadata.veripak.title,
  description: pageMetadata.veripak.description,
};

export default function VeriPakPage() {
  return (
    <>
      <Navigation />
      <VeriPakContent />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
}
