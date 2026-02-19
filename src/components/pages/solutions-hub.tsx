"use client";

import { AnimatedSection, StaggerContainer } from "@/components/ui/animated-section";
import { SectionLabel, SectionTitle, SectionDesc } from "@/components/ui/section-header";
import { SolutionCard } from "@/components/ui/solution-card";
import { GlowOrb } from "@/components/ui/glow-orb";
import { solutions } from "@/content/solutions";

export function SolutionsHubContent() {
  return (
    <section className="pt-[140px] pb-[100px] px-8 relative">
      <GlowOrb top="-100px" left="50%" size={500} />
      <div className="max-w-[1280px] mx-auto relative z-10">
        <AnimatedSection>
          <SectionLabel>What We Can Do for You</SectionLabel>
          <SectionTitle>Our Solutions</SectionTitle>
          <SectionDesc>
            We specialize in innovative production solutions that help food
            facilities increase production while reducing risk. Every system is
            engineered for washdown, sanitary, and cold environments.
          </SectionDesc>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {solutions.map((s) => (
            <SolutionCard
              key={s.slug}
              icon={s.icon}
              title={s.title === "VeriPak SCADA" ? "VeriPak SCADA" : s.title}
              subtitle={
                s.slug === "veripak"
                  ? "Standalone Quality Control Platform"
                  : s.subtitle
              }
              features={s.shortFeatures}
              accent={s.accent}
              href={s.route}
            />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
