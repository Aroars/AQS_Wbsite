"use client";

import Image from "next/image";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { SectionLabel, SectionTitle, SectionDesc } from "@/components/ui/section-header";
import { GlowOrb } from "@/components/ui/glow-orb";
import { caseStudies, conveyorTypes } from "@/data/case-studies";

const caseStudyImages = [
  { src: "/images/conveyors/elevated-conveyor.jpg", alt: "Elevated freezer conveyor system installed at a marshmallow production facility" },
  { src: "/images/conveyors/eq70-line.jpg", alt: "EQ70 accumulation conveyor system at a major dairy facility" },
];

const galleryImages = [
  { src: "/images/conveyors/mdr-detail.jpg", alt: "MDR motorized driven roller conveyor detail showing sanitary construction" },
  { src: "/images/conveyors/dairy-facility.jpg", alt: "Dual conveyor lines installed in a dairy production facility" },
  { src: "/images/conveyors/sanitary-conveyor.jpg", alt: "Sanitary belt conveyor with washdown-rated stainless steel frame" },
  { src: "/images/conveyors/curved-conveyor.jpg", alt: "Curved modular belt conveyor for product routing" },
];

export function ConveyorsContent() {
  return (
    <section className="pt-[140px] pb-[100px] px-8 relative">
      <GlowOrb top="0" left="80%" size={400} color="102,179,255" />
      <div className="max-w-[1280px] mx-auto relative z-10">
        <AnimatedSection>
          <SectionLabel>Sanitary Conveyor Systems</SectionLabel>
          <SectionTitle>
            Custom-Engineered for Your Production Line
          </SectionTitle>
          <SectionDesc>
            Over 50 years of combined experience engineering unique sanitary
            solutions. Our team works closely with customers on challenging
            conveyor projects that elevate safety, profitability, and efficiency
            at scale.
          </SectionDesc>
        </AnimatedSection>

        {/* Hero conveyor image */}
        <AnimatedSection delay={0.05}>
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-border-default mb-[50px]">
            <Image
              src="/images/conveyors/freezer-belt-hero.jpg"
              alt="Custom-built sanitary freezer conveyor with blue urethane belt and stainless steel frame"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </AnimatedSection>

        {/* Case Studies */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {caseStudies.map((cs, i) => (
            <StaggerItem key={i}>
              <div className="bg-bg-card border border-border-default rounded-[14px] p-8 h-full group hover:bg-bg-card-hover hover:-translate-y-1 transition-all duration-400">
                {caseStudyImages[i] && (
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4 -mx-2 -mt-2">
                    <Image
                      src={caseStudyImages[i].src}
                      alt={caseStudyImages[i].alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}
                <div className="font-mono text-[0.58rem] text-[#66b3ff] tracking-[0.1em] uppercase mb-1.5">
                  Case Study
                </div>
                <div className="font-sans text-[1.15rem] font-bold text-white mb-1">
                  {cs.title}
                </div>
                <div className="font-sans text-[0.78rem] text-accent-primary mb-3">
                  {cs.subtitle}
                </div>
                <p className="font-sans text-[0.85rem] text-text-body leading-[1.6] mb-3.5">
                  {cs.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cs.tags.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[0.56rem] text-[rgba(102,179,255,0.75)] border border-[rgba(102,179,255,0.18)] rounded-full px-2.5 py-1"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Photo gallery */}
        <AnimatedSection delay={0.15}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-[30px] mb-[20px]">
            {galleryImages.map((img) => (
              <div key={img.src} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border-default group">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Conveyor Types */}
        <AnimatedSection delay={0.2}>
          <div className="mt-[50px]">
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {conveyorTypes.map((c, i) => (
                <StaggerItem key={i}>
                  <div className="bg-bg-card border border-border-default rounded-[10px] p-[22px] h-full group hover:bg-bg-card-hover hover:-translate-y-1 transition-all duration-400">
                    <div className="font-sans text-[0.95rem] font-semibold text-white mb-1">
                      {c.title}
                    </div>
                    <div className="font-sans text-[0.8rem] text-text-body leading-[1.5]">
                      {c.description}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
