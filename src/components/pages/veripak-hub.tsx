"use client";

import { useState } from "react";
import Image from "next/image";
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
import { GlowOrb } from "@/components/ui/glow-orb";
import {
  DeviceIcon,
  ProductJourneyAnimation,
} from "@/components/ui/veripak-animations";
import { feedbackLoop } from "@/data/veripak-specs";
import {
  VERIPAK_ACCENT,
  coreFeatures,
  hubStats,
  veripakModules,
  machineDevices,
  userServices,
} from "@/data/veripak";

const accent = VERIPAK_ACCENT;
const feedbackColors = [accent, accent, "#f5a623", "#00d4aa"];

/* ================================================
   Core Feature Card (hover lift like IntelliPak)
   ================================================ */

function CoreFeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-xl p-5 h-full transition-all duration-300"
      style={{
        background: hovered ? `${accent}0C` : "rgba(17,34,64,0.5)",
        border: `1px solid ${hovered ? accent : "rgba(255,255,255,0.06)"}`,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      <div className="text-[1.3rem] mb-1.5">{icon}</div>
      <div
        className="font-sans text-[0.92rem] font-bold mb-1"
        style={{ color: hovered ? accent : "#fff" }}
      >
        {title}
      </div>
      <div className="font-sans text-[0.82rem] text-text-body leading-[1.5]">
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
                href={`/solutions/veripak/${m.slug}`}
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
                    className="font-mono text-[0.55rem] tracking-[0.1em] uppercase mb-3 relative z-10"
                    style={{ color: accent }}
                  >
                    {m.subtitle}
                  </div>
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
            href={`/solutions/veripak/${m.slug}`}
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
                className="font-mono text-[0.55rem] tracking-[0.1em] uppercase mb-3"
                style={{ color: accent }}
              >
                {m.subtitle}
              </div>
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
          HERO
          ══════════════════════════════════════════ */}
      <section className="pt-[140px] pb-[100px] px-8 relative overflow-hidden">
        <GlowOrb top="-100px" left="-5%" size={500} />

        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${accent} 1px, transparent 1px), linear-gradient(90deg, ${accent} 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

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
                className="w-1.5 h-1.5 rounded-full bg-accent-primary"
                style={{ boxShadow: `0 0 8px ${accent}` }}
              />
              <span className="font-mono text-[0.62rem] text-accent-primary tracking-[0.1em] uppercase">
                Standalone SCADA Platform
              </span>
            </div>
            <SectionLabel>VeriPak Inspection Systems</SectionLabel>
            <SectionTitle>
              VeriPak<span className="text-accent-primary">&reg;</span> Packaging
              SCADA
            </SectionTitle>
            <SectionDesc>
              Connect every QC device on your line. Record every product. Report
              everything. VeriPak is a standalone SCADA system purpose-built for
              packaging quality control &mdash; delivering real-time visibility,
              immediate operator feedback, and automated intervention the moment
              something goes wrong.
            </SectionDesc>
          </AnimatedSection>

          {/* Hero Video */}
          <AnimatedSection delay={0.1}>
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-border-default mt-8 mb-6">
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

          {/* CTAs */}
          <AnimatedSection delay={0.15}>
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/contact"
                className="font-sans font-bold text-[15px] px-8 py-3.5 rounded-lg bg-accent-primary text-[#0B1A2E] transition-all duration-200 hover:-translate-y-0.5"
                style={{ boxShadow: `0 4px 20px ${accent}44` }}
              >
                Request a System Review &rarr;
              </Link>
              <a
                href="#problem"
                className="font-sans font-semibold text-[15px] px-8 py-3.5 rounded-lg border border-white/15 text-text-body hover:border-accent-primary hover:text-white transition-all duration-200"
              >
                See How It Works
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PROBLEM / SOLUTION
          ══════════════════════════════════════════ */}
      <section
        id="problem"
        className="py-[100px] px-6 border-t border-border-default"
        style={{ background: "rgba(17,34,64,0.35)" }}
      >
        <div className="max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="font-mono text-[0.68rem] text-accent-primary tracking-[0.2em] uppercase mb-4">
              The Problem
            </div>
            <h2 className="font-sans font-extrabold text-[clamp(26px,4vw,44px)] leading-[1.15] text-white max-w-[700px] mb-7">
              Your QC Devices Already Work.
              <br />
              <span className="text-accent-red">
                They Just Don&apos;t Talk.
              </span>
            </h2>
            <p className="font-sans text-[17px] leading-[1.75] text-text-body max-w-[660px] mb-10">
              Your metal detector logs to its own screen. Your checkweigher
              prints its own reports. Your code date printer runs independently.
              When an auditor walks in and asks for proof that every package was
              inspected on Tuesday&apos;s second shift &mdash; you scramble.
            </p>
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
          CORE PLATFORM — Merged Config A + Config B
          ══════════════════════════════════════════ */}
      <section className="py-[100px] px-6 border-t border-border-default">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection>
            <SectionLabel>Core Platform</SectionLabel>
            <SectionTitle>
              VeriPak Doesn&apos;t Replace Your Equipment. It Connects It.
            </SectionTitle>
            <SectionDesc>
              Trend and alarm any Ethernet-connected equipment. Log every
              product-level data point. Track operators by role. Tag every
              package with its own unique quality record as it moves through
              every station.
            </SectionDesc>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-10 mt-4">
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

            {/* Right: Product Journey animation */}
            <AnimatedSection delay={0.2}>
              <div className="rounded-2xl overflow-hidden border border-border-default p-4 bg-black/20">
                <div className="font-mono text-[0.58rem] text-accent-primary tracking-[0.1em] uppercase mb-2">
                  QC Integration &mdash; Product Journey
                </div>
                <ProductJourneyAnimation />
                <div
                  className="mt-3 rounded-lg p-3 flex gap-2.5 items-start"
                  style={{
                    background: `${accent}08`,
                    border: `1px solid ${accent}18`,
                  }}
                >
                  <span className="text-sm leading-none mt-0.5">
                    &#x1F4A1;
                  </span>
                  <div className="font-sans text-[12px] text-text-body leading-[1.5]">
                    Every package carries its own record &mdash; even if a
                    reject mechanism fails, you know exactly which product had
                    which result.
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Scale Smart callout */}
          <AnimatedSection delay={0.25}>
            <div
              className="mt-10 rounded-xl p-7 flex gap-4 items-start max-w-[900px]"
              style={{
                background: `${accent}08`,
                border: `1px solid ${accent}22`,
              }}
            >
              <span className="text-2xl leading-none mt-0.5">&#x1F680;</span>
              <div>
                <div className="font-sans font-bold text-[1.05rem] text-white mb-1.5">
                  Start Simple.{" "}
                  <span className="text-accent-primary">Scale Smart.</span>
                </div>
                <div className="font-sans text-[14px] text-text-body leading-[1.65]">
                  Deploy VeriPak today as standalone SCADA monitoring. Add QC
                  integration, vision inspection, leak detection, and reject
                  modules as your quality program grows. Same HMI. Same data
                  engine. Same reports. No rip-and-replace.
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SYSTEM IMAGERY
          ══════════════════════════════════════════ */}
      <section className="pb-[50px] px-6">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection delay={0.05}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border-default">
                <Image
                  src="/images/veripak/hmi-dashboard.jpg"
                  alt="VeriPak SCADA HMI dashboard displaying real-time packaging inspection data"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border-default bg-[#e8e8e8]">
                <Image
                  src="/images/veripak/veripak-render-detail.png"
                  alt="VeriPak SCADA stainless steel enclosure — 3D render showing HMI, stack light, and sanitary cabinet"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
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
          NETWORK ARCHITECTURE
          ══════════════════════════════════════════ */}
      <section className="py-[100px] px-6 border-t border-border-default">
        <div className="max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="font-mono text-[0.68rem] text-accent-primary tracking-[0.2em] uppercase mb-4">
              Security Architecture
            </div>
            <h2 className="font-sans font-extrabold text-[clamp(26px,3.5vw,40px)] leading-[1.15] text-white mb-12">
              Data Flows Out.{" "}
              <span className="text-accent-primary">
                Threats Don&apos;t Flow In.
              </span>
            </h2>
          </AnimatedSection>

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
          FEEDBACK LOOP
          ══════════════════════════════════════════ */}
      <section className="py-[100px] px-6 border-t border-border-default">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection>
            <div className="font-mono text-[0.68rem] text-accent-primary tracking-[0.12em] uppercase mb-2.5">
              Immediate Feedback Loop
            </div>
            <h3 className="font-sans text-[1.3rem] font-bold text-white mb-6">
              From Detection to Decision in Real Time
            </h3>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {feedbackLoop.map((s, i) => (
              <StaggerItem key={i}>
                <div className="bg-bg-card border border-border-default rounded-xl p-6 relative h-full">
                  <div
                    className="font-mono text-[1.8rem] font-extrabold opacity-20 mb-1"
                    style={{ color: feedbackColors[i] }}
                  >
                    {s.step}
                  </div>
                  <div className="font-sans text-[0.95rem] font-bold text-white mb-1.5">
                    {s.title}
                  </div>
                  <div className="font-sans text-[0.82rem] text-text-body leading-[1.55]">
                    {s.description}
                  </div>
                  {i < 3 && (
                    <div className="hidden lg:block absolute -right-2.5 top-1/2 font-mono text-[0.9rem] text-accent-primary/20 z-10">
                      &rarr;
                    </div>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </>
  );
}
