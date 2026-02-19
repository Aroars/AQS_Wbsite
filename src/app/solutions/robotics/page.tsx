import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { RoboticsContent } from "@/components/pages/robotics-page";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/content/seo";

export const metadata: Metadata = {
  title: pageMetadata.robotics.title,
  description: pageMetadata.robotics.description,
};

export default function RoboticsPage() {
  return (
    <>
      <Navigation />
      <RoboticsContent />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
}
