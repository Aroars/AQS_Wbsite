"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
import {
  DeviceIcon,
  ProductJourneyAnimation,
} from "@/components/ui/veripak-animations";
import {
  VERIPAK_ACCENT,
  coreFeatures,
  hubStats,
  veripakModules,
  machineDevices,
  userServices,
} from "@/data/veripak";

const accent = VERIPAK_ACCENT;

/* ================================================
   Core Feature Card (hover lift)
   ================================================ */

function CoreFeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-xl px-4 py-3 h-full transition-all duration-300"
      style={{
        background: hovered ? `${accent}0C` : "rgba(17,34,64,0.5)",
        border: `1px solid ${hovered ? accent : "rgba(255,255,255,0.06)"}`,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      <div className="flex items-center gap-2.5 mb-1">
        <div className="text-[1rem] leading-none">{icon}</div>
        <div
          className="font-sans text-[0.88rem] font-bold"
          style={{ color: hovered ? accent : "#fff" }}
        >
          {title}
        </div>
      </div>
      <div className="font-sans text-[0.78rem] text-text-body leading-[1.5] pl-[1.65rem]">
        {desc}
      </div>
    </div>
  );
}

/* ================================================
   Module Carousel Card
   ================================================ */

function ModuleCarousel() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      {/* Desktop: overlapping deck */}
      <div
        className="hidden md:flex justify-center items-stretch"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {veripakModules.map((m, i) => {
          const isHovered = hoveredIndex === i;
          const isAnyHovered = hoveredIndex !== null;
          let spreadX = 0;
          if (isAnyHovered && hoveredIndex !== null && !isHovered) {
            spreadX = i < hoveredIndex ? -20 : 20;
          }
          return (
            <motion.div
              key={m.slug}
              className="relative"
              style={{
                marginLeft: i === 0 ? 0 : -28,
                zIndex: isHovered ? 50 : i + 1,
                width: 280,
                flexShrink: 0,
              }}
              animate={{
                y: isHovered ? -14 : 0,
                x: spreadX,
                scale: isHovered ? 1.04 : isAnyHovered ? 0.98 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onMouseEnter={() => setHoveredIndex(i)}
            >
              <Link
                href={m.href || `/solutions/veripak/${m.slug}`}
                className="block h-full no-underline"
              >
                <div
                  className="relative overflow-hidden flex flex-col h-full transition-colors duration-300"
                  style={{
                    background: isHovered
                      ? "rgba(0,0,0,0.50)"
                      : "rgba(0,0,0,0.32)",
                    border: `1px solid ${isHovered ? accent + "50" : "rgba(0,0,0,0.25)"}`,
                    borderRadius: 14,
                    padding: "28px 22px",
                    minHeight: 340,
                    boxShadow: isHovered
                      ? `0 20px 40px rgba(0,0,0,0.4), 0 0 30px ${accent}15`
                      : "0 4px 12px rgba(0,0,0,0.2)",
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                    style={{
                      opacity: isHovered ? 0.1 : 0,
                      background: `radial-gradient(circle at 50% 0%, ${accent}, transparent 70%)`,
                    }}
                  />
                  <div className="text-[1.8rem] mb-2.5 relative z-10">
                    {m.icon}
                  </div>
                  <div className="font-sans text-[1.05rem] font-bold text-white mb-1 relative z-10">
                    {m.title}
                  </div>
                  <div
                    className="font-mono text-[0.55rem] tracking-[0.1em] uppercase mb-2 relative z-10"
                    style={{ color: accent }}
                  >
                    {m.subtitle}
                  </div>
                  {m.badge && (
                    <div
                      className="inline-block font-mono text-[0.5rem] tracking-[0.08em] uppercase px-2 py-0.5 rounded-full mb-3 relative z-10"
                      style={{ background: "rgba(0,194,255,0.1)", border: "1px solid rgba(0,194,255,0.2)", color: "#00c2ff" }}
                    >
                      {m.badge}
                    </div>
                  )}
                  <div className="flex-1 relative z-10">
                    {m.features.map((f, fi) => (
                      <div
                        key={fi}
                        className="font-sans text-[0.78rem] text-text-body leading-[1.6] pl-3 relative mb-0.5"
                      >
                        <span
                          className="absolute left-0 text-[0.55rem] top-[4px]"
                          style={{ color: accent }}
                        >
                          &#x25B8;
                        </span>
                        {f}
                      </div>
                    ))}
                  </div>
                  <div
                    className="font-sans text-[0.75rem] font-semibold mt-3 relative z-10"
                    style={{ color: accent }}
                  >
                    Learn more &rarr;
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile: vertical stack */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {veripakModules.map((m) => (
          <Link
            key={m.slug}
            href={m.href || `/solutions/veripak/${m.slug}`}
            className="block no-underline"
          >
            <div
              className="relative overflow-hidden flex flex-col h-full"
              style={{
                background: "rgba(0,0,0,0.28)",
                border: "1px solid rgba(0,0,0,0.25)",
                borderRadius: 14,
                padding: "28px 22px",
              }}
            >
              <div className="text-[1.8rem] mb-2.5">{m.icon}</div>
              <div className="font-sans text-[1.05rem] font-bold text-white mb-1">
                {m.title}
              </div>
              <div
                className="font-mono text-[0.55rem] tracking-[0.1em] uppercase mb-2"
                style={{ color: accent }}
              >
                {m.subtitle}
              </div>
              {m.badge && (
                <div
                  className="inline-block font-mono text-[0.5rem] tracking-[0.08em] uppercase px-2 py-0.5 rounded-full mb-3"
                  style={{ background: "rgba(0,194,255,0.1)", border: "1px solid rgba(0,194,255,0.2)", color: "#00c2ff" }}
                >
                  {m.badge}
                </div>
              )}
              <div className="flex-1">
                {m.features.slice(0, 3).map((f, fi) => (
                  <div
                    key={fi}
                    className="font-sans text-[0.8rem] text-text-body leading-[1.6] pl-3 relative mb-0.5"
                  >
                    <span
                      className="absolute left-0 text-[0.55rem] top-[4px]"
                      style={{ color: accent }}
                    >
                      &#x25B8;
                    </span>
                    {f}
                  </div>
                ))}
              </div>
              <div
                className="font-sans text-[0.75rem] font-semibold mt-3"
                style={{ color: accent }}
              >
                Learn more &rarr;
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

/* ================================================
   Hub Page Content
   ================================================ */

export function VeriPakHubContent() {
  return (
    <>
      {/* ══════════════════════════════════════════
          SECTION 1: HERO
          ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ height: "88vh", minHeight: 540, maxHeight: "88vh" }}>
        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/veripak/hero-loop-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video/veripak-hero-loop.mp4" type="video/mp4" />
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
                    className="w-1.5 h-1.5 rounded-full bg-accent-primary"
                    style={{ boxShadow: `0 0 8px ${accent}` }}
                  />
                  <span className="font-mono text-[0.65rem] text-accent-primary tracking-[0.1em] uppercase">
                    VeriPak SCADA Platform
                  </span>
                </div>

                {/* Headline */}
                <h1 className="font-sans font-extrabold text-[clamp(32px,5vw,56px)] leading-[1.1] text-white mb-6">
                  Stop Proving Quality
                  <br />
                  <span className="text-accent-primary">After the Fact</span>
                </h1>

                {/* Subheadline */}
                <p className="font-sans text-[clamp(16px,2vw,20px)] text-text-body leading-[1.65] mb-8 max-w-[600px]">
                  Your plant runs quality checks on every package. But when an
                  auditor or a customer asks you to prove a <em className="text-white not-italic font-medium">specific</em> package
                  passed &mdash; you can&apos;t. VeriPak changes that.
                </p>

                {/* CTAs */}
                <div className="flex gap-4 flex-wrap">
                  <a
                    href="#product-journey"
                    className="font-sans font-bold text-[15px] px-8 py-3.5 rounded-lg bg-accent-primary text-[#0B1A2E] transition-all duration-200 hover:-translate-y-0.5"
                    style={{ boxShadow: `0 4px 20px ${accent}44` }}
                  >
                    See How It Works &rarr;
                  </a>
                  <Link
                    href="/contact"
                    className="font-sans font-semibold text-[15px] px-8 py-3.5 rounded-lg border border-white/20 text-text-body hover:border-accent-primary hover:text-white transition-all duration-200"
                  >
                    Request a Quote
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2: THE PROBLEM (The Status Quo)
          ══════════════════════════════════════════ */}
      <section
        id="problem"
        className="py-[100px] px-6 border-t border-border-default"
        style={{ background: "rgba(17,34,64,0.35)" }}
      >
        <div className="max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="font-mono text-[0.68rem] text-accent-primary tracking-[0.2em] uppercase mb-4">
              The Status Quo
            </div>
            <h2 className="font-sans font-extrabold text-[clamp(26px,4vw,44px)] leading-[1.15] text-white max-w-[700px] mb-7">
              Your QC Devices Work.
              <br />
              <span className="text-accent-red">
                They Just Don&apos;t Talk.
              </span>
            </h2>
            <div className="space-y-5 mb-10">
              <p className="font-sans text-[16px] leading-[1.75] text-text-body max-w-[700px]">
                Every packaging line has inspection equipment &mdash; metal detectors,
                checkweighers, code date printers, maybe X-ray or vision. Each device
                does its job. Each one logs data to its own screen, its own USB drive,
                its own binder.
              </p>
              <p className="font-sans text-[16px] leading-[1.75] text-text-body max-w-[700px]">
                The problem isn&apos;t that bad product is getting through. Your
                equipment catches it.
              </p>
              <p className="font-sans text-[16px] leading-[1.75] text-white font-medium max-w-[700px]">
                The problem is what happens next.
              </p>
              <p className="font-sans text-[16px] leading-[1.75] text-text-body max-w-[700px]">
                An auditor shows up and asks you to prove every package was inspected
                on Tuesday&apos;s second shift. A customer files a chargeback claiming
                a case arrived underweight. Your QC manager gets a notification on
                Friday that Thursday&apos;s run was ten percent over target weight
                &mdash; margin you already gave away and can never recover.
              </p>
              <p className="font-sans text-[16px] leading-[1.75] text-text-body max-w-[700px]">
                In every one of these situations, you&apos;re working backwards.
                Pulling logs from disconnected systems, cross-referencing timestamps
                by hand, trying to reconstruct what happened after the fact. And even
                when you piece it together, you still can&apos;t tie the data to a
                specific package.
              </p>
              <p className="font-sans text-[16px] leading-[1.75] text-white font-semibold max-w-[700px]">
                That&apos;s the gap VeriPak closes.
              </p>
            </div>
          </AnimatedSection>

          {/* Before / After */}
          <AnimatedSection delay={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Status Quo */}
              <div
                className="rounded-xl p-7 relative overflow-hidden"
                style={{
                  background: "#0B1A2E",
                  border: "1px solid rgba(255,102,102,0.2)",
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{
                    background:
                      "linear-gradient(90deg, #ff6666, #ff666644)",
                  }}
                />
                <div className="font-mono text-[0.62rem] tracking-[0.15em] uppercase text-accent-red mb-4">
                  Status Quo
                </div>
                <div className="flex gap-2.5 mb-4 flex-wrap">
                  {(["md", "cw", "printer", "xray"] as const).map((t) => (
                    <div
                      key={t}
                      className="w-11 h-11 rounded-lg flex items-center justify-center"
                      style={{
                        background: "rgba(17,34,64,0.5)",
                        border: "1px solid rgba(136,146,176,0.2)",
                      }}
                    >
                      <DeviceIcon type={t} size={22} color="#8892B0" />
                    </div>
                  ))}
                </div>
                {[
                  "Devices operate in isolation",
                  "Manual logs and clipboards",
                  "Auditor asks \u2192 you scramble",
                  "No centralized traceability",
                ].map((t, i) => (
                  <div
                    key={i}
                    className="font-sans text-[13px] text-text-dim py-1 flex items-center gap-2"
                  >
                    <span className="text-accent-red text-sm">&times;</span> {t}
                  </div>
                ))}
              </div>

              {/* With VeriPak */}
              <div
                className="rounded-xl p-7 relative overflow-hidden"
                style={{
                  background: "#0B1A2E",
                  border: `1px solid ${accent}33`,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{
                    background: `linear-gradient(90deg, ${accent}, ${accent}44)`,
                  }}
                />
                <div className="font-mono text-[0.62rem] tracking-[0.15em] uppercase text-accent-primary mb-4">
                  With VeriPak
                </div>
                <div className="flex gap-2.5 mb-4 flex-wrap items-center">
                  {(["md", "cw", "printer", "xray"] as const).map((t) => (
                    <div
                      key={t}
                      className="w-11 h-11 rounded-lg flex items-center justify-center"
                      style={{
                        background: `${accent}11`,
                        border: `1px solid ${accent}44`,
                      }}
                    >
                      <DeviceIcon type={t} size={22} color={accent} />
                    </div>
                  ))}
                  <span className="text-accent-primary text-lg">&rarr;</span>
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center"
                    style={{
                      background: `${accent}22`,
                      border: `1.5px solid ${accent}`,
                      boxShadow: `0 0 12px ${accent}33`,
                    }}
                  >
                    <DeviceIcon type="veripak" size={22} color={accent} />
                  </div>
                </div>
                {[
                  "One platform, all devices connected",
                  "Every product auto-logged in real time",
                  "Auditor asks \u2192 one click, done",
                  "Complete product-level traceability",
                ].map((t, i) => (
                  <div
                    key={i}
                    className="font-sans text-[13px] text-text-body py-1 flex items-center gap-2"
                  >
                    <span className="text-accent-green text-sm">&#x2713;</span>{" "}
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3: THE PRODUCT JOURNEY
          ══════════════════════════════════════════ */}
      <section id="product-journey" className="py-[100px] px-6 border-t border-border-default">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection>
            <div className="font-mono text-[0.68rem] text-accent-primary tracking-[0.2em] uppercase mb-4">
              The VeriPak Difference
            </div>
            <h2 className="font-sans font-extrabold text-[clamp(26px,4vw,44px)] leading-[1.15] text-white max-w-[700px] mb-4">
              One Package. One Identity.
              <br />
              <span className="text-accent-primary">Every Inspection Recorded.</span>
            </h2>
            <p className="font-sans text-[16px] text-text-body leading-[1.75] max-w-[700px] mb-10">
              VeriPak doesn&apos;t just monitor your inspection equipment &mdash; it assigns
              a verifiable identity to every individual package and collects quality data
              at every station along the line. Weight, metal detection, vision inspection,
              leak testing, code date verification. All of it tied to one product record.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-10">
            {/* Left: Feature cards */}
            <AnimatedSection delay={0.1}>
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {coreFeatures.map((f, i) => (
                  <StaggerItem key={i}>
                    <CoreFeatureCard icon={f.icon} title={f.title} desc={f.desc} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </AnimatedSection>

            {/* Right: Product Journey animation + result callout */}
            <AnimatedSection delay={0.2}>
              <div className="rounded-2xl overflow-hidden border border-border-default p-4 bg-black/20">
                <div className="font-mono text-[0.58rem] text-accent-primary tracking-[0.1em] uppercase mb-2">
                  QC Integration &mdash; Product Journey
                </div>
                <ProductJourneyAnimation />
              </div>

              {/* Callout box */}
              <div
                className="mt-4 rounded-xl px-7 py-5"
                style={{
                  background: `${accent}08`,
                  border: `1px solid ${accent}22`,
                }}
              >
                <div className="font-sans text-[14px] text-text-body leading-[1.75]">
                  <span className="font-bold text-white">The result:</span>{" "}
                  Every package that leaves your facility carries a verifiable data
                  trail &mdash; weight, metal detection, visual image, leak integrity,
                  operator, timestamp, SKU. If a customer ever questions a specific
                  product, you pull up the record and show them exactly what happened.
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4: THREE PROBLEMS VERIPAK SOLVES
          ══════════════════════════════════════════ */}
      <section
        className="py-[100px] px-6 border-t border-border-default"
        style={{ background: "rgba(17,34,64,0.35)" }}
      >
        <div className="max-w-[1100px] mx-auto">
          <AnimatedSection>
            <div className="font-mono text-[0.68rem] text-accent-primary tracking-[0.2em] uppercase mb-4">
              Why It Matters
            </div>
            <h2 className="font-sans font-extrabold text-[clamp(26px,4vw,44px)] leading-[1.15] text-white mb-12">
              Built for the Three Moments
              <br />
              <span className="text-accent-primary">That Cost You Money</span>
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. The Audit */}
            <StaggerItem>
              <div className="bg-bg-card border border-border-default rounded-xl p-7 h-full" style={{ borderTopWidth: 3, borderTopColor: accent }}>
                <div className="font-mono text-[2rem] font-extrabold opacity-15 text-accent-primary mb-2">01</div>
                <h3 className="font-sans text-[1.1rem] font-bold text-white mb-3">The Audit</h3>
                <p className="font-sans text-[0.85rem] text-text-body leading-[1.65] mb-5">
                  An auditor asks your QC team to prove compliance for a specific
                  production run. Without VeriPak, this is a two-week scramble
                  through binders, USB drives, and spreadsheets. With VeriPak,
                  it&apos;s one screen, one query, one report &mdash; every package,
                  every inspection, every operator, timestamped and exportable.
                </p>
                <div
                  className="font-mono text-[0.68rem] tracking-[0.08em] uppercase"
                  style={{ color: accent }}
                >
                  Audit response: weeks &rarr; same day
                </div>
              </div>
            </StaggerItem>

            {/* 2. The Chargeback */}
            <StaggerItem>
              <div className="bg-bg-card border border-border-default rounded-xl p-7 h-full" style={{ borderTopWidth: 3, borderTopColor: accent }}>
                <div className="font-mono text-[2rem] font-extrabold opacity-15 text-accent-primary mb-2">02</div>
                <h3 className="font-sans text-[1.1rem] font-bold text-white mb-3">The Chargeback</h3>
                <p className="font-sans text-[0.85rem] text-text-body leading-[1.65] mb-5">
                  A customer claims a case was underweight, a package was damaged,
                  or a seal failed. Today, you can prove your equipment was running.
                  But you can&apos;t prove <em className="text-white not-italic font-medium">that specific package</em> was
                  in spec. VeriPak can. Pull up the unique product record &mdash;
                  the weight reading, the metal detection pass, the package image.
                </p>
                <div
                  className="font-mono text-[0.68rem] tracking-[0.08em] uppercase"
                  style={{ color: accent }}
                >
                  Prove conformance per package
                </div>
              </div>
            </StaggerItem>

            {/* 3. The Discovery */}
            <StaggerItem>
              <div className="bg-bg-card border border-border-default rounded-xl p-7 h-full" style={{ borderTopWidth: 3, borderTopColor: "#f5a623" }}>
                <div className="font-mono text-[2rem] font-extrabold opacity-15 text-accent-warning mb-2">03</div>
                <h3 className="font-sans text-[1.1rem] font-bold text-white mb-3">The Discovery</h3>
                <p className="font-sans text-[0.85rem] text-text-body leading-[1.65] mb-5">
                  Your QC manager realizes Monday morning that Friday&apos;s second
                  shift ran 10% overweight. That&apos;s margin you already gave away.
                  With VeriPak, real-time dashboards and configurable alarm escalation
                  catch drift as it happens &mdash; visual alerts on the floor, then
                  email/text, then RACI-based routing if nobody responds.
                </p>
                <div
                  className="font-mono text-[0.68rem] tracking-[0.08em] uppercase"
                  style={{ color: "#f5a623" }}
                >
                  Real-time alarm escalation
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 5: TECHNICAL ARCHITECTURE
          ══════════════════════════════════════════ */}
      <section className="py-[100px] px-6 border-t border-border-default">
        <div className="max-w-[1100px] mx-auto">
          <AnimatedSection>
            <div className="font-mono text-[0.68rem] text-accent-primary tracking-[0.2em] uppercase mb-4">
              Under the Hood
            </div>
            <h2 className="font-sans font-extrabold text-[clamp(26px,4vw,44px)] leading-[1.15] text-white mb-5">
              Standalone SCADA.{" "}
              <span className="text-accent-primary">No Middleware. No IT Headaches.</span>
            </h2>
            <p className="font-sans text-[16px] text-text-body leading-[1.75] max-w-[720px] mb-12">
              VeriPak runs on its own Allen-Bradley CompactLogix PLC with a 12-inch
              Optix touchscreen. It&apos;s the same controls platform most plants
              already standardize on &mdash; no exotic hardware, no proprietary
              software stack, no middleware layer between your equipment and your data.
            </p>
          </AnimatedSection>

          {/* Three architecture points */}
          <AnimatedSection delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
              <div className="bg-bg-card border border-border-default rounded-xl p-7">
                <h3 className="font-sans text-[1rem] font-bold text-white mb-2">
                  Connects to What You Already Have
                </h3>
                <p className="font-sans text-[0.85rem] text-text-body leading-[1.65]">
                  VeriPak integrates with any QC device that speaks Ethernet/IP,
                  Modbus-TCP, or digital I/O &mdash; regardless of manufacturer.
                  You don&apos;t rip and replace. You connect and centralize.
                </p>
              </div>
              <div className="bg-bg-card border border-border-default rounded-xl p-7">
                <h3 className="font-sans text-[1rem] font-bold text-white mb-2">
                  Dual-Network Security
                </h3>
                <p className="font-sans text-[0.85rem] text-text-body leading-[1.65]">
                  The machine network stays isolated. The HMI connects to your
                  user network for dashboards and reporting without bridging the
                  firewall. No attack surface created.
                </p>
              </div>
              <div className="bg-bg-card border border-border-default rounded-xl p-7">
                <h3 className="font-sans text-[1rem] font-bold text-white mb-2">
                  Grows With Your Line
                </h3>
                <p className="font-sans text-[0.85rem] text-text-body leading-[1.65]">
                  Start with SCADA monitoring. Add third-party QC integration.
                  Add AQS leak detection and vision. Scale to a full-stack quality
                  control architecture. Every step builds on the same platform.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Network Architecture Diagram */}
          <AnimatedSection delay={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr]">
              {/* Machine Network */}
              <div
                className="rounded-xl md:rounded-r-none p-7"
                style={{
                  background: "rgba(17,34,64,0.5)",
                  border: "1px solid rgba(26,48,85,1)",
                }}
              >
                <div className="font-mono text-[0.62rem] tracking-[0.12em] uppercase text-accent-red mb-4 flex items-center gap-1.5">
                  <span>&#x1F512;</span> Machine Network (Isolated)
                </div>
                {machineDevices.map((d, i) => (
                  <div
                    key={i}
                    className="font-sans text-[13px] text-text-body py-1 flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                    {d}
                  </div>
                ))}
              </div>

              {/* VeriPak HMI Bridge */}
              <div
                className="flex flex-col items-center justify-center gap-3 py-7 px-6 min-w-[140px]"
                style={{
                  background: `linear-gradient(180deg, ${accent}15, ${accent}08)`,
                  border: `1.5px solid ${accent}44`,
                }}
              >
                <DeviceIcon type="veripak" size={36} color={accent} />
                <div className="font-mono text-[11px] font-bold text-accent-primary text-center tracking-[0.08em]">
                  VeriPak HMI
                </div>
                <div className="font-sans text-[11px] text-text-body text-center leading-[1.4]">
                  Reads data
                  <br />
                  from machine side
                  <br />
                  Serves reports
                  <br />
                  to user side
                </div>
                <div
                  className="w-10 h-10 rounded-full"
                  style={{
                    border: `2px solid ${accent}44`,
                    animation: "radarPulse 2s ease-out infinite",
                  }}
                />
              </div>

              {/* User Network */}
              <div
                className="rounded-xl md:rounded-l-none p-7"
                style={{
                  background: "rgba(17,34,64,0.5)",
                  border: "1px solid rgba(26,48,85,1)",
                }}
              >
                <div className="font-mono text-[0.62rem] tracking-[0.12em] uppercase text-accent-green mb-4 flex items-center gap-1.5">
                  <span>&#x1F310;</span> User Network (Reporting)
                </div>
                {userServices.map((d, i) => (
                  <div
                    key={i}
                    className="font-sans text-[13px] text-text-body py-1 flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                    {d}
                  </div>
                ))}
              </div>
            </div>

            {/* IT callout */}
            <div
              className="mt-5 rounded-xl px-5 py-3.5 flex items-center gap-3"
              style={{
                background: "rgba(0,212,170,0.05)",
                border: "1px solid rgba(0,212,170,0.15)",
              }}
            >
              <span className="text-accent-green text-lg">&#x2713;</span>
              <span className="font-sans text-[14px] text-text-body">
                IT departments approve VeriPak because it provides visibility
                without creating attack surface.
              </span>
            </div>
          </AnimatedSection>

          {/* Technical specs grid */}
          <AnimatedSection delay={0.2}>
            <div className="mt-14">
              <h3 className="font-sans text-[1.1rem] font-bold text-white mb-6">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-border-default rounded-xl overflow-hidden">
                {[
                  { label: "PLC", value: "Allen-Bradley CompactLogix with expandable I/O" },
                  { label: "HMI", value: "Allen-Bradley Optix 12\u201D color touchscreen" },
                  { label: "Network", value: "Ethernet/IP, Modbus-TCP, digital I/O" },
                  { label: "Enclosure", value: "NEMA 4X stainless steel, IP69K washdown" },
                  { label: "Vision", value: "Keyence camera integration via Ethernet/IP" },
                  { label: "Devices", value: "Up to 24 / 32 / 60 depending on tier" },
                  { label: "Operators", value: "Manual entry or RFID/HID badge scan" },
                  { label: "Remote", value: "Secure VPN connectivity for AQS diagnostics" },
                  { label: "ERP", value: "SAP, Maximo (Enterprise tier)" },
                ].map((spec, i) => (
                  <div
                    key={i}
                    className="p-4 border-b border-r border-border-default last:border-b-0"
                    style={{ background: "rgba(17,34,64,0.3)" }}
                  >
                    <div className="font-mono text-[0.62rem] tracking-[0.1em] uppercase text-accent-primary mb-1">
                      {spec.label}
                    </div>
                    <div className="font-sans text-[0.85rem] text-text-body leading-[1.5]">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 6: WHO VERIPAK IS FOR
          ══════════════════════════════════════════ */}
      <section
        className="py-[100px] px-6 border-t border-border-default"
        style={{ background: "rgba(17,34,64,0.35)" }}
      >
        <div className="max-w-[1100px] mx-auto">
          <AnimatedSection>
            <div className="font-mono text-[0.68rem] text-accent-primary tracking-[0.2em] uppercase mb-4">
              Built for Your Role
            </div>
            <h2 className="font-sans font-extrabold text-[clamp(26px,3.5vw,40px)] leading-[1.15] text-white mb-10">
              Who VeriPak Is For
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StaggerItem>
              <div className="bg-bg-card border border-border-default rounded-xl p-7 h-full">
                <div className="font-mono text-[0.62rem] tracking-[0.1em] uppercase text-accent-primary mb-3">
                  QC Manager / Plant Engineer
                </div>
                <p className="font-sans text-[0.88rem] text-text-body leading-[1.65]">
                  You&apos;re the one pulling reports at 6 AM and rebuilding data
                  trails from memory. VeriPak gives you one platform where every
                  device on the line feeds into one dashboard, one historian, one
                  report generator. Operator tracking, shift reports, SKU-level
                  data &mdash; all automatic, all audit-ready.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-bg-card border border-border-default rounded-xl p-7 h-full">
                <div className="font-mono text-[0.62rem] tracking-[0.1em] uppercase text-accent-primary mb-3">
                  VP of Operations / Plant Director
                </div>
                <p className="font-sans text-[0.88rem] text-text-body leading-[1.65]">
                  You care about two things: protecting margin and protecting the
                  company. VeriPak gives you real-time visibility into quality
                  performance without waiting for your QC team to compile reports.
                  When an auditor walks in or a customer disputes a shipment, the
                  data is already there.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-bg-card border border-border-default rounded-xl p-7 h-full">
                <div className="font-mono text-[0.62rem] tracking-[0.1em] uppercase text-accent-primary mb-3">
                  Multi-Facility Evaluator
                </div>
                <p className="font-sans text-[0.88rem] text-text-body leading-[1.65]">
                  Enterprise SCADA nodes connect into a Master Dashboard for
                  plant-wide or multi-facility quality oversight. Historian export
                  feeds your MES/ERP for OEE tracking, downtime logging, and
                  compliance automation across locations.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SHOWCASE VIDEO
          ══════════════════════════════════════════ */}
      <section className="py-[72px] px-6 border-t border-border-default">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection delay={0.05}>
            <div className="font-mono text-[0.58rem] text-accent-primary tracking-[0.1em] uppercase mb-3">
              VeriPak In Action
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-border-default">
              <video
                controls
                preload="metadata"
                poster="/images/veripak/showcase-poster.jpg"
                className="w-full h-full object-cover"
              >
                <source src="/video/veripak-showcase.mp4" type="video/mp4" />
              </video>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MODULE CAROUSEL
          ══════════════════════════════════════════ */}
      <section
        className="py-[72px] px-8 border-t border-border-default"
        style={{ background: "rgba(17,34,64,0.35)" }}
      >
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection>
            <SectionLabel>Add-On Modules</SectionLabel>
            <SectionTitle>Expand Your Quality Program</SectionTitle>
            <SectionDesc>
              VeriPak&apos;s modular architecture lets you add inspection, leak
              detection, and reject capability when you&apos;re ready. Each
              module integrates into the same platform &mdash; same HMI, same
              data engine.
            </SectionDesc>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <ModuleCarousel />
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS
          ══════════════════════════════════════════ */}
      <section
        className="py-20 px-6 border-t border-border-default"
        style={{ background: "rgba(17,34,64,0.35)" }}
      >
        <StaggerContainer className="max-w-[900px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {hubStats.map((s, i) => (
            <StaggerItem key={i}>
              <div className="text-center">
                <div className="font-mono font-bold text-[clamp(28px,4vw,42px)] text-accent-primary">
                  {s.value}
                </div>
                <div className="font-sans text-[13px] text-text-dim mt-1.5">
                  {s.label}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ══════════════════════════════════════════
          CTA — Page-specific
          ══════════════════════════════════════════ */}
      <section className="py-[100px] px-6 border-t border-border-default">
        <div className="max-w-[700px] mx-auto text-center">
          <AnimatedSection>
            <h2 className="font-sans font-extrabold text-[clamp(26px,4vw,40px)] leading-[1.15] text-white mb-5">
              See What Verifiable Quality Data Looks Like
            </h2>
            <p className="font-sans text-[16px] text-text-body leading-[1.7] mb-8">
              Whether you need to connect existing equipment, prepare for an audit,
              or build a complete inspection architecture &mdash; start with a
              project review.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/contact"
                className="font-sans font-bold text-[15px] px-8 py-3.5 rounded-lg bg-accent-primary text-[#0B1A2E] transition-all duration-200 hover:-translate-y-0.5"
                style={{ boxShadow: `0 4px 20px ${accent}44` }}
              >
                Start a Project Review &rarr;
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
