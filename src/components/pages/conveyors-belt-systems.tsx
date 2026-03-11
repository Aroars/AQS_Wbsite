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
  categories,
  constructionStats,
  driveTechnologies,
} from "@/data/conveyors";
import type { ConveyorType } from "@/data/conveyors";

const accent = CONVEYOR_ACCENT;
const category = categories.find((c) => c.slug === "belt-systems")!;

/* ================================================
   Type Detail Card
   ================================================ */

function TypeDetailCard({ type }: { type: ConveyorType }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{
        background: hovered ? `${accent}0C` : "rgba(17,34,64,0.5)",
        border: `1px solid ${hovered ? accent : "rgba(255,255,255,0.06)"}`,
      }}
    >
      <div className={`flex flex-col ${type.image ? "md:flex-row" : ""}`}>
        {/* Text content */}
        <div className={`p-8 ${type.image ? "md:flex-1" : ""}`}>
          <div
            className="font-mono text-[0.58rem] tracking-[0.12em] uppercase mb-2"
            style={{ color: accent }}
          >
            {type.useCase}
          </div>
          <h3 className="font-sans text-[1.25rem] font-bold text-white mb-3">
            {type.title}
          </h3>
          <p className="font-sans text-[0.88rem] text-text-body leading-[1.65] mb-4">
            {type.description}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-4">
            {type.features.map((f) => (
              <div
                key={f}
                className="flex items-start gap-2 text-[0.82rem] text-text-body"
              >
                <span style={{ color: accent }} className="mt-0.5 shrink-0">
                  ✓
                </span>
                {f}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {type.idealFor.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[0.56rem] border rounded-full px-2.5 py-1"
                style={{ color: `${accent}BF`, borderColor: `${accent}2E` }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        {/* Inline image on right */}
        {type.image && (
          <div className="relative w-full md:w-[380px] md:min-h-[280px] aspect-[4/3] md:aspect-auto shrink-0 overflow-hidden">
            <Image
              src={type.image.src}
              alt={type.image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 380px"
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================
   Page Content
   ================================================ */

export function ConveyorsBeltSystemsContent() {
  return (
    <>
      {/* Hero with background image */}
      <section className="relative pt-[140px] pb-[80px] px-8 overflow-hidden">
        {category.heroImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={category.heroImage.src}
              alt={category.heroImage.alt}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a1d2b]/80 via-[#1a1d2b]/60 to-[#1a1d2b]/90" />
          </div>
        )}
        <GlowOrb top="-100px" left="80%" size={500} color="148,163,184" />
        <div className="max-w-[1280px] mx-auto relative z-10">
          <AnimatedSection>
            <ConveyorBreadcrumb current="Belt Systems" />
            <SectionLabel>{category.subtitle}</SectionLabel>
            <SectionTitle>{category.title}</SectionTitle>
            <SectionDesc>{category.description}</SectionDesc>
          </AnimatedSection>
        </div>
      </section>

      {/* Type Detail Cards */}
      <section className="pb-[72px] px-8">
        <div className="max-w-[1280px] mx-auto">
          <StaggerContainer className="flex flex-col gap-4">
            {category.types.map((type) => (
              <StaggerItem key={type.slug}>
                <TypeDetailCard type={type} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Construction Standards */}
      <section className="py-[72px] px-8 bg-black/[0.06]">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection>
            <SectionLabel>Construction Standards</SectionLabel>
            <SectionTitle>Built Different. On Purpose.</SectionTitle>
            <SectionDesc>
              Every belt conveyor shares the same sanitary construction DNA —
              continuous TIG welds, mirror-polished stainless, sloped drainage,
              and FDA-approved belting.
            </SectionDesc>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {constructionStats.map((stat) => (
              <AnimatedSection key={stat.label} delay={0.05}>
                <div className="text-center p-6 rounded-xl bg-black/20 border border-white/[0.04]">
                  <div
                    className="font-mono text-[1.3rem] font-bold mb-1"
                    style={{ color: accent }}
                  >
                    {stat.value}
                  </div>
                  <div className="font-sans text-[0.78rem] text-text-body">
                    {stat.label}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Drive Technology */}
      <section className="py-[72px] px-8">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection>
            <SectionLabel>Drive Technology</SectionLabel>
            <SectionTitle>Power Options</SectionTitle>
            <SectionDesc>
              Choose the drive technology that matches your application — from
              precision Mag-Drive to proven gear motors.
            </SectionDesc>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            {driveTechnologies.slice(0, 2).map((drive) => (
              <StaggerItem key={drive.title}>
                <div className="rounded-xl p-6 bg-black/20 border border-white/[0.04] h-full">
                  <div className="font-sans text-[1rem] font-semibold text-white mb-2">
                    {drive.title}
                  </div>
                  <p className="font-sans text-[0.82rem] text-text-body leading-[1.6] mb-3">
                    {drive.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {drive.highlights.map((h) => (
                      <span
                        key={h}
                        className="font-mono text-[0.56rem] border rounded-full px-2.5 py-1"
                        style={{ color: `${accent}BF`, borderColor: `${accent}2E` }}
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </>
  );
}
