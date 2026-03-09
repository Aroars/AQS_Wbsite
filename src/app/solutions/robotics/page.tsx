import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { RoboticsContent } from "@/components/pages/robotics-page";
import { SystemArchitecture } from "@/components/sections/system-architecture";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/content/seo";

export const metadata: Metadata = {
  title: pageMetadata.robotics.title,
  description: pageMetadata.robotics.description,
  openGraph: {
    title: pageMetadata.robotics.title,
    description: pageMetadata.robotics.description,
  },
};

export default function RoboticsPage() {
  const schema = {"@context":"https://schema.org","@type":"Service","name":"Sanitary Robotics Integration","description":"Fully washdown-rated robotic systems for palletizing, case packing, pick-and-place, and end-of-line automation. 316L stainless, IP69K, USDA/FDA compliant.","provider":{"@type":"Organization","name":"Automated Quality Solutions"},"serviceType":"Industrial Automation","areaServed":"US","url":"https://www.automatedqs.com/solutions/robotics"};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Navigation />
      <RoboticsContent />
      <SystemArchitecture currentProduct="robotics" />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
}
