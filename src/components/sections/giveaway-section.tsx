"use client";

import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionLabel, SectionTitle, SectionDesc } from "@/components/ui/section-header";
import { GiveawayCalculatorStandalone } from "@/components/sections/giveaway/GiveawayCalculator";

/** The product giveaway calculator embedded on the VeriPak page */
export function GiveawaySection() {
  return (
    <section className="py-[72px] px-8 bg-surface-card border-y border-border">
      <div className="max-w-[1280px] mx-auto">
        <AnimatedSection>
          <SectionLabel>What Overfill Costs</SectionLabel>
          <SectionTitle>Product Giveaway Calculator</SectionTitle>
          <SectionDesc>
            Every package filled above its declared weight gives product away. Enter your
            target and average fill, the line rate, and what the product costs, and see the
            yearly giveaway a checkweigher-to-filler feedback loop takes back.
          </SectionDesc>
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <div className="rounded-xl border border-border bg-surface-page p-5 md:p-6 mt-2">
            <GiveawayCalculatorStandalone />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
