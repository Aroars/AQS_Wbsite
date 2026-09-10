"use client";

import Link from "next/link";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionLabel, SectionTitle, SectionDesc } from "@/components/ui/section-header";
import { GiveawayCalculatorStandalone } from "@/toolbox/components/calculators/GiveawayCalculator";

/** The product giveaway calculator embedded on the VeriPak page */
export function GiveawaySection() {
  return (
    <section className="py-[72px] px-8 border-t border-border-default" style={{ background: "rgba(17,34,64,0.35)" }}>
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
          <div className="toolbox-scope rounded-xl border border-white/[0.06] bg-black/20 p-5 md:p-6 mt-2">
            <GiveawayCalculatorStandalone />
          </div>
          <p className="font-sans text-text-body text-[0.82rem] mt-4">
            Want to keep your numbers? The same calculator lives in the{" "}
            <Link href="/toolbox/product-giveaway-calculator" className="text-accent-primary hover:underline">Engineering Toolbox</Link>, where inputs are saved in your browser.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
