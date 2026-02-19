"use client";

import { AnimatedSection, StaggerContainer } from "@/components/ui/animated-section";
import { SectionLabel, SectionTitle, SectionDesc } from "@/components/ui/section-header";
import { SolutionCard } from "@/components/ui/solution-card";
import { GlowOrb } from "@/components/ui/glow-orb";
import { solutions } from "@/content/solutions";

export function SolutionsOverview() {
  return (
    <section className="py-[110px] px-8 relative">
      <GlowOrb top="0" left="80%" size={400} color="0,102,255" />
      <div className="max-w-[1280px] mx-auto relative z-10">
        <AnimatedSection>
          <SectionLabel>Our Platform</SectionLabel>
          <SectionTitle>
            Integrated Solutions for Every Packaging Line
          </SectionTitle>
          <SectionDesc>
            From quality control and liquid recovery to robotic palletizing and
            sanitary conveyance — AQS provides modular building blocks to
            transform your production.
          </SectionDesc>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {solutions.map((s) => (
            <SolutionCard
              key={s.slug}
              icon={s.icon}
              title={s.title}
              subtitle={s.subtitle}
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
