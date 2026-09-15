"use client";

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
import { ProjectCard } from "@/components/ui/project-card";
import { ConveyorGallery } from "@/components/ui/conveyor-gallery";
import { ConstructionStandards } from "@/components/ui/construction-standards";
import {
  CONVEYOR_ACCENT,
  categories,
  differentiators,
  hubClaims,
  conveyorProjects,
  galleryImages,
} from "@/data/conveyors";
import { getTypePage } from "@/data/conveyor-type-pages";

const accent = CONVEYOR_ACCENT;
const typeCount = categories.reduce((n, c) => n + c.types.length, 0);
const TYPE_COUNT_WORDS: Record<number, string> = { 9: "Nine", 10: "Ten", 11: "Eleven", 12: "Twelve" };

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
   Hub Page Content
   ================================================ */

export function ConveyorsHubContent() {
  return (
    <>
      {/* Hero with video background — matches VeriPak hero format */}
      <section className="relative overflow-hidden" style={{ height: "88vh", minHeight: 540, maxHeight: "88vh" }}>
        {/* Background video */}
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

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/[0.72]" />

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${accent} 1px, transparent 1px), linear-gradient(90deg, ${accent} 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Text content — left-aligned */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-[1280px] mx-auto px-8 w-full">
            <div className="max-w-[680px]">
              <AnimatedSection>
                {/* Badge pill */}
                <div
                  className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-5"
                  style={{
                    background: `${accent}15`,
                    border: `1px solid ${accent}33`,
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}` }}
                  />
                  <span
                    className="font-mono text-[0.65rem] tracking-[0.1em] uppercase"
                    style={{ color: accent }}
                  >
                    Belt · MDR · Pallet
                  </span>
                </div>

                {/* Headline */}
                <h1 className="font-sans font-extrabold text-[clamp(32px,5vw,56px)] leading-[1.1] text-white mb-6">
                  Sanitary, Washdown &amp; Food-Grade Conveyors
                  <br />
                  <span style={{ color: accent }}>Built for Your Line</span>
                </h1>

                {/* Subheadline */}
                <p className="font-sans text-[clamp(16px,2vw,20px)] text-text-body leading-[1.65] mb-8 max-w-[600px]">
                  Sanitary belt conveyors, 24V MDR conveyors, and washdown pallet
                  conveyors, engineered for your line and built for your washdown.
                  Every frame TIG-welded, every surface mirror-polished, every system
                  designed to move your product &mdash; not slow you down.
                </p>

                {/* CTAs */}
                <div className="flex gap-4 flex-wrap">
                  <a
                    href="#categories"
                    className="inline-flex items-center gap-1.5 font-sans text-[15px] font-bold text-white px-8 py-3.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: `linear-gradient(135deg, ${accent}, #3388cc)`, boxShadow: `0 4px 20px ${accent}44` }}
                  >
                    Explore Systems &rarr;
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 font-sans text-[15px] font-semibold text-text-body px-8 py-3.5 rounded-lg border border-white/20 hover:border-[#66b3ff] hover:text-white transition-all duration-200"
                  >
                    Request a Quote
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Claims strip — four construction facts, not marketing counts */}
      <section className="py-10 px-8 border-y border-border-default bg-black/20">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {hubClaims.map((stat) => (
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

      {/* Find Your Conveyor — three families, each its own page, types listed under each */}
      <section id="categories" className="py-[72px] px-8">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection>
            <SectionLabel>Find Your Conveyor</SectionLabel>
            <SectionTitle>Three Families. {TYPE_COUNT_WORDS[typeCount] ?? typeCount} System Types.</SectionTitle>
            <SectionDesc>
              Every sanitary conveyor we build shares the same construction DNA
              &mdash; welded stainless frames, mirror polish, aggressive drainage,
              and tool-less maintenance access. Start with the family that moves
              your product: belt for trays, pouches, and cartons; MDR for cases and
              totes with zone control; pallet for end of line.
            </SectionDesc>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2">
            {categories.map((cat) => (
              <StaggerItem key={cat.slug}>
                {/* The whole card opens the family page (stretched link); the type rows are their own links above it */}
                <div className="group/card relative rounded-xl overflow-hidden h-full flex flex-col bg-[rgba(17,34,64,0.5)] border border-white/[0.06] hover:border-[#94A3B8]/60 hover:-translate-y-1 transition-all duration-300">
                  <Link
                    href={`/solutions/conveyors/${cat.slug}`}
                    aria-label={`Explore ${cat.shortTitle} conveyors`}
                    className="absolute inset-0 z-0 rounded-xl"
                  />
                  {cat.heroImage && (
                    <div className="relative aspect-[16/9] overflow-hidden pointer-events-none">
                      <Image
                        src={cat.heroImage.src}
                        alt={cat.heroImage.alt}
                        fill
                        className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(17,34,64,0.9)] to-transparent" />
                    </div>
                  )}
                  <div className="relative p-6 flex-1 flex flex-col pointer-events-none">
                    <div className="font-mono text-[0.58rem] tracking-[0.12em] uppercase mb-2" style={{ color: accent }}>
                      {cat.subtitle}
                    </div>
                    <h3 className="font-sans text-[1.25rem] font-bold text-white mb-2 group-hover/card:text-[#cbd5e1] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="font-sans text-[0.82rem] text-text-body leading-[1.6] mb-4">
                      {cat.description}
                    </p>
                    <ul className="space-y-1.5 mb-5 flex-1 pointer-events-auto">
                      {cat.types.map((type) => (
                        <li key={type.slug} className="relative z-10">
                          <Link
                            href={getTypePage(cat.slug, type.slug)?.href ?? `/solutions/conveyors/${cat.slug}#${type.slug}`}
                            className="flex items-baseline gap-2 no-underline group"
                          >
                            <span className="shrink-0 text-[0.7rem]" style={{ color: accent }}>&rarr;</span>
                            <span className="font-sans text-[0.85rem] font-semibold text-white group-hover:text-[#cbd5e1] transition-colors">
                              {type.shortTitle}
                            </span>
                            <span className="font-sans text-[0.72rem] text-text-dim hidden xl:inline">
                              {type.useCase}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <span
                      className="inline-flex items-center gap-1.5 font-mono text-[0.62rem] tracking-[0.08em] uppercase group-hover/card:text-white transition-colors"
                      style={{ color: accent }}
                    >
                      Explore {cat.shortTitle} conveyors &rarr;
                    </span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
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
      <ConstructionStandards variant="full" />

      {/* Photo Gallery */}
      <ConveyorGallery images={galleryImages} />

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
            {conveyorProjects.map((p) => (
              <StaggerItem key={p.slug}>
                <ProjectCard project={p} size="preview" />
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
