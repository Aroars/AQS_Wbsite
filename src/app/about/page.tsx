import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { AboutContent } from "@/components/pages/about-page";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/content/seo";

export const metadata: Metadata = {
  title: pageMetadata.about.title,
  description: pageMetadata.about.description,
};

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <AboutContent />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
}
