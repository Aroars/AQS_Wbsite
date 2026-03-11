"use client";

import { useState } from "react";
import Link from "next/link";
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
import {
  CONVEYOR_ACCENT,
  categories,
  differentiators,
  constructionStats,
  hubStats,
  conveyorProjects,
  galleryImages,
} from "@/data/conveyors";

const accent = CONVEYOR_ACCENT;

/* ================================================
   Category Navigation Card
   ================================================ */

const categoryCardImages: Record<string, { src: string; alt: string }> = {
  "belt-systems": {
    src: "/images/conveyors/modular-clamshell-production.jpg",
    alt: "Modular belt conveyor system handling clamshell packaging in a sanitary production environment",
  },
  "roller-drive": {
    src: "/images/conveyors/sanitary-motor-detail.jpg",
    alt: "Close-up of sanitary conveyor motor and drive assembly with stainless steel construction",
  },
};

function CategoryCard({
  slug,
  title,
  subtitle,
  description,
  typeCount,
}: {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  typeCount: number;
}) {
  const [hovered, setHovered] = useState(false);
  const cardImage = categoryCardImages[slug];

  return (
    <Link href={`/solutions/conveyors/${slug}`} className="no-underline block h-full">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="rounded-xl h-full transition-all duration-300 flex flex-col relative overflow-hidden"
        style={{
          background: cardImage ? "transparent" : hovered ? `${accent}0C` : "rgba(17,34,64,0.5)",
          border: `1px solid ${hovered ? accent : "rgba(255,255,255,0.06)"}`,
          minHeight: cardImage ? "380px" : undefined,
        }}
      >
        {/* Background image + overlay */}
        {cardImage && (
          <>
            <div className="absolute inset-0 z-0">
              <Image
                src={cardImage.src}
                alt={cardImage.alt}
                fill
                className="object-cover transition-transform duration-500 ease-out"
                style={{ transform: hovered ? "scale(1.05)" : "scale(1)" }}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div
              className="absolute inset-0 z-[1] transition-all duration-400"
              style={{
                background: hovered
                  ? "linear-gradient(to top, rgba(10,12,20,0.92) 45%, rgba(10,12,20,0.4) 100%)"
                  : "linear-gradient(to top, rgba(10,12,20,0.85) 20%, rgba(10,12,20,0.25) 100%)",
              }}
            />
          </>
        )}

        {/* Content */}
        <div className={`relative z-[2] flex flex-col h-full ${cardImage ? "p-8 justify-end" : "p-8"}`}>
          <div
            className="font-mono text-[0.58rem] tracking-[0.12em] uppercase mb-3"
            style={{ color: accent }}
          >
            {typeCount} System Types
          </div>
          <div className="font-sans text-[1.25rem] font-bold text-white mb-1">
            {title}
          </div>
          <div className="font-sans text-[0.82rem] text-text-body mb-3">
            {subtitle}
          </div>
          <div
            className="transition-all duration-400 overflow-hidden"
            style={{
              maxHeight: hovered ? "200px" : "0px",
              opacity: hovered ? 1 : 0,
            }}
          >
            <p className="font-sans text-[0.85rem] text-text-body/70 leading-[1.6] mb-5">
              {description}
            </p>
          </div>
          {!cardImage && (
            <p className="font-sans text-[0.85rem] text-text-body/70 leading-[1.6] mb-5 flex-1">
              {description}
            </p>
          )}
          <div
            className="font-mono text-[0.72rem] tracking-[0.08em] uppercase transition-colors"
            style={{ color: hovered ? "#fff" : accent }}
          >
            Explore Systems →
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ================================================
   Differentiator Card
   ================================================ */

function DifferentiatorCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-5 rounded-xl bg-black/20 border border-white/[0.04]">
      <div className="text-lg mb-2" style={{ color: accent }}>
        {icon}
      </div>
      <div className="font-sans text-[0.9rem] font-semibold text-white mb-1.5">
        {title}
      </div>
      <p className="font-sans text-[0.8rem] text-text-body leading-[1.6] m-0">
        {description}
      </p>
    </div>
  );
}

/* ================================================
   Project Preview Card
   ================================================ */

function ProjectPreviewCard({
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
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4 -mx-2 -mt-2">
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
      <div className="font-sans text-[1.15rem] font-bold text-white mb-1">
        {title}
      </div>
      <div className="font-sans text-[0.78rem] mb-3" style={{ color: accent }}>
        {subtitle}
      </div>
      <p className="font-sans text-[0.85rem] text-text-body leading-[1.6] mb-3.5">
        {description}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span
            key={t}
            className="font-mono text-[0.56rem] border rounded-full px-2.5 py-1"
            style={{
              color: `${accent}BF`,
              borderColor: `${accent}2E`,
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ================================================
   Hub Page Content
   ================================================ */

export function ConveyorsHubContent() {
  return (
    <>
      {/* Hero with video background */}
      <section className="relative min-h-[80vh] flex items-center pt-[140px] pb-[100px] px-8 overflow-hidden">
        <GlowOrb top="-100px" left="80%" size={500} color="148,163,184" />

        {/* Video background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/conveyors/hero-loop-poster.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/video/conveyor-hero-loop.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1d2b]/80 via-[#1a1d2b]/60 to-[#1a1d2b]/90" />
        </div>

        <div className="max-w-[1280px] mx-auto relative z-10">
          <AnimatedSection>
            <div
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-[18px]"
              style={{
                background: `${accent}0D`,
                border: `1px solid ${accent}22`,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}` }}
              />
              <span
                className="font-mono text-[0.62rem] tracking-[0.1em] uppercase"
                style={{ color: accent }}
              >
                Custom Sanitary Conveyance
              </span>
            </div>
            <SectionLabel>Conveyor Systems</SectionLabel>
            <SectionTitle>
              Custom Sanitary Conveyors
            </SectionTitle>
            <SectionDesc>
              Engineered for your line. Built for your washdown. Every frame
              TIG-welded, every surface mirror-polished, every system designed to
              move your product — not slow you down.
            </SectionDesc>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-10 px-8 border-y border-border-default bg-black/20">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {hubStats.map((stat) => (
              <div key={stat.label}>
                <div
                  className="font-mono text-[1.5rem] font-bold mb-1"
                  style={{ color: accent }}
                >
                  {stat.value}
                </div>
                <div className="font-sans text-[0.78rem] text-text-body">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Video */}
      <section className="pb-[50px] pt-[20px] px-6">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection delay={0.05}>
            <div className="font-mono text-[0.58rem] tracking-[0.1em] uppercase mb-3" style={{ color: accent }}>
              Custom Conveyors In Action
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-border-default">
              <video
                controls
                preload="metadata"
                poster="/images/conveyors/conveyor-hero-poster.jpg"
                className="w-full h-full object-cover"
              >
                <source src="/video/conveyor-showcase.mp4" type="video/mp4" />
              </video>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-[72px] px-8">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection>
            <SectionLabel>System Categories</SectionLabel>
            <SectionTitle>Every Conveyor Type. One Sanitary Standard.</SectionTitle>
            <SectionDesc>
              AQS designs and builds the full range of sanitary conveyors. Every
              type shares the same construction DNA — welded stainless frames,
              mirror polish, aggressive drainage, and tool-less maintenance access.
            </SectionDesc>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            {categories.map((cat) => (
              <StaggerItem key={cat.slug}>
                <CategoryCard
                  slug={cat.slug}
                  title={cat.title}
                  subtitle={cat.subtitle}
                  description={cat.description}
                  typeCount={cat.types.length}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Key Differentiators */}
      <section className="py-[72px] px-8 bg-black/[0.06]">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection>
            <SectionLabel>Why AQS Conveyors</SectionLabel>
            <SectionTitle>Sanitary Conveyance That&apos;s Actually Sanitary</SectionTitle>
            <SectionDesc>
              Most &ldquo;sanitary&rdquo; conveyors are standard industrial hardware with a
              stainless steel skin. AQS builds conveyors differently — from the
              welds up.
            </SectionDesc>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {differentiators.map((d) => (
              <StaggerItem key={d.title}>
                <DifferentiatorCard
                  icon={d.icon}
                  title={d.title}
                  description={d.description}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Construction Standards */}
      <section className="py-[72px] px-8">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection>
            <SectionLabel>Construction Standards</SectionLabel>
            <SectionTitle>Built Different. On Purpose.</SectionTitle>
            <SectionDesc>
              Continuous TIG welds instead of bolted joints. Mirror-polished
              stainless instead of painted steel. Sloped geometry that drains water
              in seconds — not minutes. Sanitary is the baseline.
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

      {/* Photo Gallery */}
      <section className="py-[72px] px-8 bg-black/[0.06]">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection>
            <SectionLabel>In the Field</SectionLabel>
            <SectionTitle>Conveyor Gallery</SectionTitle>
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

      {/* Case Studies Preview */}
      <section className="py-[72px] px-8">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection>
            <SectionLabel>Projects</SectionLabel>
            <SectionTitle>Recent Conveyor Projects</SectionTitle>
            <SectionDesc>
              Real-world sanitary conveyor systems designed, built, and installed
              by AQS.
            </SectionDesc>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {conveyorProjects.map((p, i) => (
              <StaggerItem key={i}>
                <ProjectPreviewCard
                  title={p.title}
                  subtitle={p.subtitle}
                  description={p.description}
                  tags={p.tags}
                  image={p.image}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
          <AnimatedSection delay={0.1}>
            <div className="mt-6 text-center">
              <Link
                href="/solutions/conveyors/projects"
                className="inline-block font-mono text-[0.72rem] tracking-[0.1em] uppercase transition-colors no-underline"
                style={{ color: accent }}
              >
                View All Projects →
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
