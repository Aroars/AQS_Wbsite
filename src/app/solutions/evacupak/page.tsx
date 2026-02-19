import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { EvacuPakContent } from "@/components/pages/evacupak-page";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/content/seo";

export const metadata: Metadata = {
  title: pageMetadata.evacupak.title,
  description: pageMetadata.evacupak.description,
};

export default function EvacuPakPage() {
  return (
    <>
      <Navigation />
      <EvacuPakContent />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
}
