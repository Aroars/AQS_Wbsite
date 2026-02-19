import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { LeakDetectionContent } from "@/components/pages/leak-detection-page";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/content/seo";

export const metadata: Metadata = {
  title: pageMetadata.leakDetection.title,
  description: pageMetadata.leakDetection.description,
};

export default function LeakDetectionPage() {
  return (
    <>
      <Navigation />
      <LeakDetectionContent />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
}
