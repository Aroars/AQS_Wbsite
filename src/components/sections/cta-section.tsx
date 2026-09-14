"use client";

import Link from "next/link";
import { AnimatedSection } from "@/components/ui/animated-section";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { SectionTitle } from "@/components/ui/section-header";
import { GlowOrb } from "@/components/ui/glow-orb";

export interface CTASectionProps {
  /** Defaults to the site-wide VeriPak-led copy */
  title?: string;
  body?: string;
  buttonLabel?: string;
  href?: string;
  /** Button gradient start colour (the site cyan by default) */
  accent?: string;
}

export function CTASection({
  title = "Ready to Eliminate Quality Blind Spots?",
  body = "Whether you need VeriPak, EvacuPak, leak detection, sanitary robotics, or custom conveyors — let's architect your next system together.",
  buttonLabel = "Start a Project Review →",
  href = "/contact",
  accent = "#00c2ff",
}: CTASectionProps = {}) {
  return (
    <section className="py-[90px] px-8 relative overflow-hidden">
      <GlowOrb top="-100px" left="30%" size={600} />
      <div className="max-w-[780px] mx-auto text-center relative z-10">
        <AnimatedSection>
          <SectionTitle className="text-center">{title}</SectionTitle>
          <p className="font-sans text-[1.02rem] text-text-body leading-[1.7] max-w-[520px] mx-auto mb-8">
            {body}
          </p>
          <MagneticButton
            as="a"
            href={href}
            className="font-sans text-[0.92rem] font-bold text-bg-primary px-9 py-3.5 rounded-lg no-underline inline-block"
            style={{
              background: `linear-gradient(135deg, ${accent}, #0088ff)`,
              boxShadow: `0 0 36px ${accent}4D`,
            }}
          >
            {buttonLabel}
          </MagneticButton>
        </AnimatedSection>
      </div>
    </section>
  );
}
