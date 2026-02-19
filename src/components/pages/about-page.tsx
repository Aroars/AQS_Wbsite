"use client";

import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { SectionLabel, SectionTitle, SectionDesc } from "@/components/ui/section-header";
import { GlowOrb } from "@/components/ui/glow-orb";
import { coreValues, leadership } from "@/content/about";

export function AboutContent() {
  return (
    <section className="pt-[140px] pb-[100px] px-8 relative">
      <GlowOrb top="-100px" left="-5%" size={500} />
      <div className="max-w-[1280px] mx-auto relative z-10">
        <AnimatedSection>
          <SectionLabel>About AQS</SectionLabel>
          <SectionTitle>
            Exceptional People. Innovative Solutions.
          </SectionTitle>
          <SectionDesc>
            At AQS we believe in exceptional people and innovative solutions. We
            are dedicated to providing sustainable solutions that contribute to
            environmental conservation while helping our clients maximize
            profitability.
          </SectionDesc>
        </AnimatedSection>

        {/* Core Values */}
        <AnimatedSection delay={0.1}>
          <h3 className="font-sans text-[1.3rem] font-bold text-white mb-5">
            Our Core Values
          </h3>
        </AnimatedSection>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-[70px]">
          {coreValues.map((v) => (
            <StaggerItem key={v.number}>
              <div className="bg-bg-card border border-border-default rounded-xl p-7 h-full group hover:bg-bg-card-hover hover:-translate-y-1 transition-all duration-400">
                <div className="font-mono text-[0.65rem] text-accent-primary tracking-[0.1em] mb-2">
                  {v.number}
                </div>
                <div className="font-sans text-[1.1rem] font-bold text-white mb-2">
                  {v.title}
                </div>
                <div className="font-sans text-[0.85rem] text-text-body leading-[1.6]">
                  {v.description}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Leadership */}
        <AnimatedSection delay={0.2}>
          <h3 className="font-sans text-[1.3rem] font-bold text-white mb-5">
            Leadership Team
          </h3>
        </AnimatedSection>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {leadership.map((p) => (
            <StaggerItem key={p.name}>
              <div className="bg-bg-card border border-border-default rounded-xl p-7 group hover:bg-bg-card-hover hover:-translate-y-1 transition-all duration-400">
                {/* TODO: Replace with real headshot from /public/media/team/ */}
                <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-br from-accent-primary/[0.12] to-accent-secondary/[0.08] flex items-center justify-center font-mono text-[0.9rem] font-bold text-accent-primary mb-3.5">
                  {p.initials}
                </div>
                <div className="font-sans text-[1.05rem] font-bold text-white">
                  {p.name}
                </div>
                <div className="font-mono text-[0.6rem] text-accent-primary tracking-[0.08em] uppercase mb-2">
                  {p.role}
                </div>
                <div className="font-sans text-[0.84rem] text-text-body leading-[1.6] mb-2.5">
                  {p.bio}
                </div>
                <a
                  href={p.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[0.78rem] text-accent-primary no-underline hover:underline"
                  data-cursor-hover
                >
                  LinkedIn →
                </a>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
