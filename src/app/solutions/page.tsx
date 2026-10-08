import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { SolutionsHubContent } from "@/components/pages/solutions-hub";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/content/seo";

export const metadata: Metadata = {
  title: pageMetadata.solutions.title,
  description: pageMetadata.solutions.description,
  openGraph: {
    title: pageMetadata.solutions.title,
    description: pageMetadata.solutions.description,
  },
};

export default function SolutionsPage() {
  return (
    // data-theme-ready: this route is on the light/dark token model (see globals.css)
    <div data-theme-ready>
      <Navigation />
      <SolutionsHubContent />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
