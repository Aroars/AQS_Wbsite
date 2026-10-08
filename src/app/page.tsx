import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { PartnersBar } from "@/components/sections/partners-bar";
import { SolutionsOverview } from "@/components/sections/solutions-overview";
import { WhyAQS } from "@/components/sections/why-aqs";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { IndustriesSection } from "@/components/sections/industries-section";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";

export default function HomePage() {
  return (
    <>
      <Navigation />
      <HeroSection />
      <PartnersBar />
      <SolutionsOverview />
      <WhyAQS />
      <TestimonialsSection />
      <IndustriesSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
}
