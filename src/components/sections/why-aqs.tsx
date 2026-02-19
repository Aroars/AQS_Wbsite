"use client";

import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/animated-section";
import { SectionLabel, SectionTitle } from "@/components/ui/section-header";
import { whyAQS } from "@/content/solutions";

export function WhyAQS() {
  return (
    <section className="py-[90px] px-8">
      <div className="max-w-[1280px] mx-auto">
        <AnimatedSection>
          <div className="text-center mb-[50px]">
            <SectionLabel>Why Choose AQS</SectionLabel>
            <SectionTitle className="text-center">
              Built on Integrity. Driven by Results.
            </SectionTitle>
          </div>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {whyAQS.map((v) => (
            <StaggerItem key={v.title}>
              <div className="bg-bg-card border border-border-default rounded-xl p-7 h-full group hover:bg-bg-card-hover hover:-translate-y-1 transition-all duration-400">
                <div className="text-[1.6rem] mb-3 group-hover:scale-110 transition-transform duration-300">
                  {v.icon}
                </div>
                <div className="font-sans text-[1.05rem] font-bold text-white mb-1.5">
                  {v.title}
                </div>
                <div className="font-sans text-[0.85rem] text-text-body leading-[1.6]">
                  {v.desc}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
