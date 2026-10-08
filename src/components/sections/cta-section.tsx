"use client";

import { AnimatedSection } from "@/components/ui/animated-section";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { GlowOrb } from "@/components/ui/glow-orb";

export interface CTASectionProps {
  /** Defaults to the site-wide VeriPak-led copy */
  title?: string;
  body?: string;
  buttonLabel?: string;
  href?: string;
  /** Button fill (the brand cyan by default) */
  accent?: string;
}

/* A dark band in both themes: brand tokens only (plan section 5i). */
export function CTASection({
  title = "Ready to Eliminate Quality Blind Spots?",
  body = "Whether you need VeriPak, EvacuPak, leak detection, sanitary robotics, or custom conveyors — let's architect your next system together.",
  buttonLabel = "Start a Project Review →",
  href = "/contact",
  accent = "#00C2FF",
}: CTASectionProps = {}) {
  return (
    <section className="py-[90px] px-8 relative overflow-hidden bg-brand-navy-band">
      <GlowOrb top="-100px" left="30%" size={600} />
      <div className="max-w-[780px] mx-auto text-center relative z-10">
        <AnimatedSection>
          <h2 className="font-sans text-[clamp(2rem,4vw,3rem)] font-extrabold text-white mb-4 leading-[1.1] text-center">
            {title}
          </h2>
          <p className="font-sans text-[1.02rem] text-[#CBD5E1] leading-[1.7] max-w-[520px] mx-auto mb-8">
            {body}
          </p>
          <MagneticButton
            as="a"
            href={href}
            className="font-sans text-[0.92rem] font-bold text-brand-navy-deep px-9 py-3.5 rounded-lg no-underline inline-block"
            style={{
              background: accent,
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
