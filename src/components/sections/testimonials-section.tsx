"use client";

import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/animated-section";
import { SectionLabel, SectionTitle } from "@/components/ui/section-header";
import { testimonials } from "@/content/solutions";

export function TestimonialsSection() {
  return (
    <section className="py-[90px] px-8">
      <div className="max-w-[1280px] mx-auto">
        <AnimatedSection>
          <div className="text-center mb-11">
            <SectionLabel>Client Outcomes</SectionLabel>
            <SectionTitle className="text-center">
              Trusted by Production Leaders
            </SectionTitle>
          </div>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <StaggerItem key={i}>
              <div className="bg-surface-card border border-border rounded-xl p-7 h-full flex flex-col group hover:bg-surface-card-hover hover:-translate-y-1 transition-all duration-400">
                {/* Decorative quote mark: a brand fill, not text */}
                <div className="font-mono text-[1.8rem] text-brand-cyan leading-none mb-3" aria-hidden>
                  &ldquo;
                </div>
                <p className="font-sans text-[0.92rem] text-text-body leading-[1.7] italic flex-1">
                  {t.quote}
                </p>
                <div className="mt-4 pt-4 border-t border-border-soft">
                  <div className="font-sans text-[0.88rem] font-semibold text-text-strong">
                    {t.name}
                  </div>
                  <div className="font-sans text-[0.72rem] text-text-dim">
                    {t.title}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
