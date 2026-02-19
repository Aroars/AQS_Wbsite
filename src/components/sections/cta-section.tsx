"use client";

import Link from "next/link";
import { AnimatedSection } from "@/components/ui/animated-section";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { SectionTitle } from "@/components/ui/section-header";
import { GlowOrb } from "@/components/ui/glow-orb";

export function CTASection() {
  return (
    <section className="py-[90px] px-8 relative overflow-hidden">
      <GlowOrb top="-100px" left="30%" size={600} />
      <div className="max-w-[780px] mx-auto text-center relative z-10">
        <AnimatedSection>
          <SectionTitle className="text-center">
            Ready to Eliminate Quality Blind Spots?
          </SectionTitle>
          <p className="font-sans text-[1.02rem] text-text-body leading-[1.7] max-w-[520px] mx-auto mb-8">
            Whether you need VeriPak, EvacuPak, leak detection, sanitary
            robotics, or custom conveyors — let&apos;s architect your next
            system together.
          </p>
          <MagneticButton
            as="a"
            href="/contact"
            className="font-sans text-[0.92rem] font-bold text-bg-primary bg-gradient-to-br from-accent-primary to-[#0088ff] px-9 py-3.5 rounded-lg no-underline shadow-[0_0_36px_rgba(0,194,255,0.3)] inline-block"
          >
            Start a Project Review →
          </MagneticButton>
        </AnimatedSection>
      </div>
    </section>
  );
}
