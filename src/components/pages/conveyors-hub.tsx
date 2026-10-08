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
import { WhatAreYouConveying } from "@/components/ui/what-are-you-conveying";
import { ImageShuffle } from "@/components/ui/image-shuffle";
import {
  CONVEYOR_ACCENT,
  categories,
  differentiators,
  hubClaims,
  conveyorProjects,
  galleryImages,
} from "@/data/conveyors";
import { getTypePage } from "@/data/conveyor-type-pages";

/* The conveyor accent (steel) is used for fills, edges, dots, borders, and
   glows only; text on the light surfaces is on the semantic tokens and text
   inside the dark hero band is on the brand tokens (plan section 3). */
const accent = CONVEYOR_ACCENT;
const typeCount = categories.reduce((n, c) => n + c.types.length, 0);
const TYPE_COUNT_WORDS: Record<number, string> = { 9: "Nine", 10: "Ten", 11: "Eleven", 12: "Twelve" };

/* ================================================
   Differentiator Card
   ================================================ */

/* Sits inside a card-surface band, so the card is on the page ground */
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
    <div className="p-5 rounded-xl bg-surface-page border border-border">
      <div className="text-lg text-accent-text mb-2">
        {icon}
      </div>
      <div className="font-sans text-[0.9rem] font-semibold text-text-strong mb-1.5">
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
      {/* Hero with video background — a dark band in both themes, like the
          homepage hero: brand tokens only, never the semantic surfaces */}
      <section className="relative overflow-hidden bg-brand-navy-band" style={{ height: "88vh", minHeight: 540, maxHeight: "88vh" }}>
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

        {/* Dark scrim */}
        <div className="absolute inset-0 bg-brand-navy-band/80" />

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
                  <span className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-brand-steel">
                    Belt · MDR · Pallet
                  </span>
                </div>

                {/* Headline */}
                <h1 className="font-sans font-extrabold text-[clamp(32px,5vw,56px)] leading-[1.1] text-white mb-6">
                  Sanitary, Washdown &amp; Food-Grade Conveyors
                  <br />
                  <span className="text-brand-steel">Built for Your Line</span>
                </h1>

                {/* Subheadline */}
                <p className="font-sans text-[clamp(16px,2vw,20px)] text-[#CBD5E1] leading-[1.65] mb-8 max-w-[600px]">
                  Sanitary belt conveyors, 24V MDR conveyors, and washdown pallet
                  conveyors, engineered for your line and built for your washdown.
                  Every frame TIG-welded, every surface mirror-polished, every system
                  designed to move your product &mdash; not slow you down.
                </p>

                {/* CTAs */}
                <div className="flex gap-4 flex-wrap">
                  <a
                    href="#categories"
                    className="inline-flex items-center gap-1.5 font-sans text-[15px] font-bold text-brand-navy-deep bg-brand-steel px-8 py-3.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                    style={{ boxShadow: `0 4px 20px ${accent}44` }}
                  >
                    Explore Systems &rarr;
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 font-sans text-[15px] font-semibold text-[#CBD5E1] px-8 py-3.5 rounded-lg border border-brand-steel/40 hover:border-brand-steel hover:text-white transition-all duration-200"
                  >
                    Request a Quote
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Claims strip — four construction facts, not marketing counts; a card-surface band */}
      <section className="py-10 px-8 bg-surface-card border-y border-border">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {hubClaims.map((stat) => (
              <div key={stat.label}>
                <div className="font-mono text-[1.5rem] font-bold text-accent-text mb-1">
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
                <div className="group/card relative rounded-xl overflow-hidden h-full flex flex-col bg-surface-card border border-border hover:border-brand-steel/60 hover:-translate-y-1 transition-all duration-300">
                  <Link
                    href={`/solutions/conveyors/${cat.slug}`}
                    aria-label={`Explore ${cat.shortTitle} conveyors`}
                    className="absolute inset-0 z-0 rounded-xl"
                  />
                  {(cat.cardImages?.length || cat.heroImage) && (
                    <div className="relative aspect-[16/9] overflow-hidden pointer-events-none">
                      {cat.cardImages && cat.cardImages.length > 1 ? (
                        <ImageShuffle images={cat.cardImages} sizes="(max-width: 1024px) 100vw, 33vw" />
                      ) : (
                        <Image
                          src={(cat.cardImages?.[0] ?? cat.heroImage)!.src}
                          alt={(cat.cardImages?.[0] ?? cat.heroImage)!.alt}
                          fill
                          className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                      )}
                      {/* Blends the photo into the card surface in either theme */}
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-card to-transparent" />
                    </div>
                  )}
                  <div className="relative p-6 flex-1 flex flex-col pointer-events-none">
                    <div className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-accent-text mb-2">
                      {cat.subtitle}
                    </div>
                    <h3 className="font-sans text-[1.25rem] font-bold text-text-strong mb-2 group-hover/card:text-accent-text transition-colors">
                      {cat.title}
                    </h3>
                    <p className="font-sans text-[0.82rem] text-text-body leading-[1.6] mb-4">
                      {cat.description}
                    </p>
                    <ul className="space-y-2 mb-5 flex-1 pointer-events-auto">
                      {cat.types.map((type) => (
                        <li key={type.slug} className="relative z-10">
                          <Link
                            href={getTypePage(cat.slug, type.slug)?.href ?? `/solutions/conveyors/${cat.slug}#${type.slug}`}
                            className="flex items-center gap-2.5 no-underline group"
                          >
                            <span className="shrink-0 text-[0.75rem] text-accent-text">&rarr;</span>
                            <span className="font-sans text-[0.98rem] font-semibold text-text-strong group-hover:text-accent-text transition-colors">
                              {type.shortTitle}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[0.62rem] tracking-[0.08em] uppercase text-accent-text group-hover/card:text-text-strong transition-colors">
                      Explore {cat.shortTitle} conveyors &rarr;
                    </span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* What are you conveying? — hover a product, see the types that carry it */}
      <WhatAreYouConveying />

      {/* Showcase Video */}
      <section className="pb-[50px] pt-[20px] px-6">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection delay={0.05}>
            <div className="font-mono text-[0.58rem] tracking-[0.1em] uppercase text-accent-text mb-3">
              Custom Conveyors In Action
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-border bg-brand-navy-band">
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

      {/* Key Differentiators — a card-surface band with the cards on the page ground */}
      <section className="py-[72px] px-8 bg-surface-card border-y border-border">
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
          <AnimatedSection>
            <p className="mt-8 font-sans text-[0.9rem] text-text-body leading-[1.6]">
              Why AQS builds its own conveyors, and what the purchased ones got wrong:{" "}
              <Link href="/blog/we-bought-them-first" className="text-accent-text font-semibold hover:text-text-strong transition-colors">
                read the white paper, We Bought Them First &rarr;
              </Link>
            </p>
          </AnimatedSection>
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
                className="inline-block font-mono text-[0.72rem] tracking-[0.1em] uppercase text-accent-text hover:text-text-strong transition-colors no-underline"
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
