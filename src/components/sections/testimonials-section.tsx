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
    <section className="py-[90px] px-8 border-t border-border-default">
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
              <div className="bg-bg-card border border-border-default rounded-xl p-7 h-full flex flex-col group hover:bg-bg-card-hover hover:-translate-y-1 transition-all duration-400">
                <div className="font-mono text-[1.8rem] text-accent-primary/[0.18] leading-none mb-3">
                  &ldquo;
                </div>
                <p className="font-sans text-[0.92rem] text-white/50 leading-[1.7] italic flex-1">
                  {t.quote}
                </p>
                <div className="mt-4 pt-4 border-t border-border-default">
                  <div className="font-sans text-[0.88rem] font-semibold text-white">
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
