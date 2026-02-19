"use client";

import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/animated-section";
import { SectionLabel, SectionTitle } from "@/components/ui/section-header";
import { industries } from "@/content/solutions";

export function IndustriesSection() {
  return (
    <section className="py-[90px] px-8">
      <div className="max-w-[1280px] mx-auto">
        <AnimatedSection>
          <div className="text-center mb-11">
            <SectionLabel>Industries We Serve</SectionLabel>
            <SectionTitle className="text-center">
              Built for the Toughest Environments
            </SectionTitle>
          </div>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {industries.map((ind) => (
            <StaggerItem key={ind.name}>
              <div className="bg-bg-card border border-border-default rounded-[10px] p-6 text-center group hover:bg-bg-card-hover hover:-translate-y-1 transition-all duration-400">
                <div className="text-[1.6rem] mb-2 group-hover:scale-110 transition-transform duration-300">
                  {ind.icon}
                </div>
                <div className="font-sans text-[0.88rem] font-semibold text-white">
                  {ind.name}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
