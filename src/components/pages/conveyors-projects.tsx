"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/animated-section";
import {
  SectionLabel,
  SectionTitle,
  SectionDesc,
} from "@/components/ui/section-header";
import { GlowOrb } from "@/components/ui/glow-orb";
import { ConveyorBreadcrumb } from "@/components/ui/conveyor-breadcrumb";
import {
  CONVEYOR_ACCENT,
  conveyorProjects,
  galleryImages,
} from "@/data/conveyors";

const accent = CONVEYOR_ACCENT;

/* ================================================
   Project Card
   ================================================ */

function ProjectCard({
  title,
  subtitle,
  description,
  tags,
  image,
}: {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  image?: { src: string; alt: string };
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-xl p-8 h-full transition-all duration-300"
      style={{
        background: hovered ? `${accent}0C` : "rgba(17,34,64,0.5)",
        border: `1px solid ${hovered ? accent : "rgba(255,255,255,0.06)"}`,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {image && (
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-5 -mx-2 -mt-2">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}
      <div
        className="font-mono text-[0.58rem] tracking-[0.1em] uppercase mb-1.5"
        style={{ color: accent }}
      >
        Case Study
      </div>
      <div className="font-sans text-[1.25rem] font-bold text-white mb-1">
        {title}
      </div>
      <div className="font-sans text-[0.82rem] mb-3" style={{ color: accent }}>
        {subtitle}
      </div>
      <p className="font-sans text-[0.88rem] text-text-body leading-[1.65] mb-4">
        {description}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span
            key={t}
            className="font-mono text-[0.56rem] border rounded-full px-2.5 py-1"
            style={{ color: `${accent}BF`, borderColor: `${accent}2E` }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ================================================
   Page Content
   ================================================ */

export function ConveyorsProjectsContent() {
  return (
    <>
      {/* Hero */}
      <section className="pt-[140px] pb-[80px] px-8 relative overflow-hidden">
        <GlowOrb top="-100px" left="80%" size={500} color="148,163,184" />
        <div className="max-w-[1280px] mx-auto relative z-10">
          <AnimatedSection>
            <ConveyorBreadcrumb current="Projects" />
            <SectionLabel>Project Portfolio</SectionLabel>
            <SectionTitle>Conveyor Projects & Case Studies</SectionTitle>
            <SectionDesc>
              Real-world sanitary conveyor systems designed, built, and installed
              by AQS — from freezer-rated marshmallow lines to high-capacity dairy
              accumulation systems.
            </SectionDesc>
          </AnimatedSection>
        </div>
      </section>

      {/* Project Cards */}
      <section className="pb-[72px] px-8">
        <div className="max-w-[1280px] mx-auto">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {conveyorProjects.map((p, i) => (
              <StaggerItem key={i}>
                <ProjectCard
                  title={p.title}
                  subtitle={p.subtitle}
                  description={p.description}
                  tags={p.tags}
                  image={p.image}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-[72px] px-8 bg-black/[0.06]">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection>
            <SectionLabel>In the Field</SectionLabel>
            <SectionTitle>Conveyor Gallery</SectionTitle>
            <SectionDesc>
              AQS conveyor systems installed across dairy, protein, bakery, and
              frozen food production facilities.
            </SectionDesc>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
            {galleryImages.map((img) => (
              <div
                key={img.src}
                className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border-default group"
              >
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
        </div>
      </section>
    </>
  );
}
