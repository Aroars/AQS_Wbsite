"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { SectionLabel, SectionTitle, SectionDesc } from "@/components/ui/section-header";
import { GlowOrb } from "@/components/ui/glow-orb";
import { ConveyorAnimation, MagDriveAnimation, BeforeAfterAnimation } from "@/components/ui/intellipak-animations";
import {
  intellipakStats,
  intellipakCapabilities,
  intellipakApplications,
  magDriveSpecs,
} from "@/data/intellipak";

function CapabilityCard({
  icon,
  title,
  accent,
  items,
}: {
  icon: string;
  title: string;
  accent: string;
  items: string[];
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-xl p-7 h-full transition-all duration-300"
      style={{
        background: hovered ? `${accent}0C` : "rgba(17,34,64,0.5)",
        border: `1px solid ${hovered ? accent : "rgba(255,255,255,0.06)"}`,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      <div className="text-[1.5rem] mb-2">{icon}</div>
      <div
        className="font-sans text-[1.02rem] font-bold mb-3"
        style={{ color: accent }}
      >
        {title}
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item, j) => (
          <li key={j} className="flex gap-2 items-start">
            <span
              className="mt-[5px] shrink-0 text-[0.6rem]"
              style={{ color: accent }}
            >
              &#9656;
            </span>
            <span className="font-sans text-[0.84rem] text-text-body leading-[1.55]">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ApplicationCard({ machine, desc }: { machine: string; desc: string }) {
  const [hovered, setHovered] = useState(false);
  const accent = "#00C6D7";
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-xl p-6 h-full transition-all duration-300"
      style={{
        background: hovered ? `${accent}0C` : "rgba(17,34,64,0.5)",
        border: `1px solid ${hovered ? accent : "rgba(255,255,255,0.06)"}`,
        borderLeft: `3px solid ${accent}`,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      <div className="font-sans text-[0.95rem] font-bold text-white mb-1">
        {machine}
      </div>
      <div className="font-sans text-[0.84rem] text-text-body leading-[1.55]">
        {desc}
      </div>
    </div>
  );
}

export function IntelliPakContent() {
  return (
    <>
      {/* ── Hero Section ── */}
      <section className="pt-[140px] pb-[100px] px-8 relative">
        <GlowOrb top="-100px" left="-5%" size={500} color="245,166,35" />
        <div className="max-w-[1280px] mx-auto relative z-10">
          <AnimatedSection>
            <div
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-[18px]"
              style={{
                background: "rgba(245,166,35,0.08)",
                border: "1px solid rgba(245,166,35,0.15)",
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full bg-[#f5a623]"
                style={{ boxShadow: "0 0 8px #f5a623" }}
              />
              <span className="font-mono text-[0.62rem] text-[#f5a623] tracking-[0.1em] uppercase">
                Smart Infeed &amp; Product Handling
              </span>
            </div>
            <SectionLabel>IntelliPak Feed Systems</SectionLabel>
            <SectionTitle>
              IntelliPak&reg;
              <br />
              <span className="text-text-body text-[clamp(1.2rem,2.5vw,1.8rem)]">
                Feed Systems
              </span>
            </SectionTitle>
            <SectionDesc>
              Precision product handling for sanitary packaging lines. Mag-Drive
              powered conveyors that gap, merge, collate, and time your products
              with servo-like accuracy &mdash; no gears, no oil, no guesswork.
            </SectionDesc>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 font-sans text-[0.88rem] font-semibold text-white px-6 py-3 rounded-lg bg-gradient-to-r from-[#f5a623] to-[#e09000] hover:brightness-110 transition-all"
              >
                Request a Quote &rarr;
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 font-sans text-[0.88rem] font-semibold text-white px-6 py-3 rounded-lg border border-white/20 hover:bg-white/5 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Conveyor Animation Section ── */}
      <section className="px-8 mb-[50px]">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection delay={0.05}>
            <div className="font-mono text-[0.58rem] text-[#f5a623] tracking-[0.12em] uppercase mb-4">
              Live Product Flow &mdash; Random &rarr; Batched Precision
            </div>
            <ConveyorAnimation />
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="font-mono text-[0.6rem] text-text-dim tracking-[0.08em] uppercase">
                  Infeed
                </div>
                <div className="font-sans text-[0.78rem] text-text-body mt-0.5">
                  Random product arrival
                </div>
              </div>
              <div className="text-center">
                <div className="font-mono text-[0.6rem] text-[#f5a623] tracking-[0.08em] uppercase">
                  IntelliPak
                </div>
                <div className="font-sans text-[0.78rem] text-text-body mt-0.5">
                  Gapping, merging &amp; timing
                </div>
              </div>
              <div className="text-center">
                <div className="font-mono text-[0.6rem] text-text-dim tracking-[0.08em] uppercase">
                  Output
                </div>
                <div className="font-sans text-[0.78rem] text-text-body mt-0.5">
                  Uniform batches at speed
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="mb-[50px]">
        <AnimatedSection delay={0.08}>
          <div className="bg-gradient-to-r from-[#112240] to-[#1A3055]/50 py-10 px-8">
            <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
              {intellipakStats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="font-mono text-[2rem] font-bold text-[#f5a623]">
                    {stat.value}
                  </div>
                  <div className="font-mono text-[0.6rem] text-text-dim tracking-[0.1em] uppercase mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ── Before & After Section ── */}
      <section className="px-8 mb-[50px]">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection delay={0.1}>
            <SectionLabel>The Impact</SectionLabel>
            <SectionTitle>See the Difference</SectionTitle>
            <SectionDesc>
              Watch a manual infeed struggle with jams and line stops &mdash;
              then compare it to IntelliPak running hands-off at sustained
              throughput.
            </SectionDesc>
          </AnimatedSection>
          <AnimatedSection delay={0.12}>
            <BeforeAfterAnimation />
          </AnimatedSection>
        </div>
      </section>

      {/* ── Capabilities Grid ── */}
      <section className="px-8 mb-[50px]">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection delay={0.14}>
            <SectionLabel>Capabilities</SectionLabel>
            <SectionTitle>What IntelliPak Does</SectionTitle>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {intellipakCapabilities.map((cap, i) => (
              <StaggerItem key={i}>
                <CapabilityCard
                  icon={cap.icon}
                  title={cap.title}
                  accent={cap.accent}
                  items={cap.items}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── The IntelliPak Difference (Copy Section) ── */}
      <section className="px-8 mb-[50px]">
        <div className="max-w-[960px] mx-auto">
          <AnimatedSection delay={0.16}>
            <div
              className="rounded-2xl p-10"
              style={{
                background:
                  "linear-gradient(135deg, rgba(245,166,35,0.06), rgba(245,166,35,0.02))",
                border: "1px solid rgba(245,166,35,0.1)",
              }}
            >
              <div className="font-mono text-[0.62rem] text-[#f5a623] tracking-[0.12em] uppercase mb-3">
                The IntelliPak Difference
              </div>
              <h3 className="font-sans text-[1.4rem] font-bold text-white leading-[1.25] mb-6">
                Stop Feeding Problems.
                <br />
                <span className="text-[#f5a623]">
                  Start Feeding Precision.
                </span>
              </h3>
              <div className="flex flex-col gap-4">
                <p className="font-sans text-[0.9rem] text-text-body leading-[1.7]">
                  Misfeeds, jams, and inconsistent spacing are the silent killers
                  of packaging line efficiency. Every time a product arrives out
                  of position, your downstream equipment &mdash; wrappers,
                  sealers, cartoners &mdash; has to compensate. That means
                  slowdowns, rejects, and unplanned stops.
                </p>
                <p className="font-sans text-[0.9rem] text-text-body leading-[1.7]">
                  IntelliPak eliminates the guesswork. Mag-Drive motors deliver
                  servo-like positional accuracy without the mechanical
                  complexity of gearboxes, belts, or oil-filled drives. Every
                  product is sensed, timed, and placed exactly where it needs to
                  be &mdash; at rates up to 500 products per minute.
                </p>
                <p className="font-sans text-[0.9rem] text-text-body leading-[1.7]">
                  Allen-Bradley CompactLogix controllers with Keyence sensor
                  arrays form a closed-loop feedback system that adjusts in real
                  time. No manual tuning between SKU changes. No trial-and-error
                  speed ramps. Just consistent, repeatable product flow.
                </p>
                <p className="font-sans text-[0.9rem] text-text-body leading-[1.7]">
                  Whether you need single-lane gapping for a flow wrapper or
                  multi-lane collation for a case packer, IntelliPak is
                  configured to your exact application &mdash; not adapted from
                  someone else&apos;s. Every system is purpose-built, fully
                  sanitary, and backed by AQS engineering from concept through
                  commissioning.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Mag-Drive Technology Section ── */}
      <section className="px-8 mb-[50px] border-t border-b border-border-default py-[60px]">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection delay={0.18}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text column */}
              <div>
                <div className="font-mono text-[0.62rem] text-accent-primary tracking-[0.12em] uppercase mb-2.5">
                  Drive Technology
                </div>
                <h3 className="font-sans text-[1.4rem] font-bold text-white leading-[1.25] mb-1.5">
                  Magnetic Direct Drive
                </h3>
                <h4 className="font-sans text-[1.1rem] font-semibold text-[#00C6D7] mb-4">
                  Inside Every IntelliPak
                </h4>
                <p className="font-sans text-[0.9rem] text-text-body leading-[1.7] mb-6">
                  Traditional conveyor drives rely on gearboxes, chains, and
                  oil-filled reducers &mdash; components that wear, leak, and
                  contaminate. Mag-Drive replaces all of it with a sealed
                  magnetic coupling that transmits torque without contact. No
                  gears. No oil. No maintenance-induced contamination risk.
                </p>
                <div className="flex flex-col gap-3">
                  {magDriveSpecs.map(([label, desc], i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00C6D7] mt-2 shrink-0 shadow-[0_0_6px_rgba(0,198,215,0.4)]" />
                      <div>
                        <span className="font-sans text-[0.88rem] font-semibold text-white">
                          {label}
                        </span>
                        <span className="font-sans text-[0.84rem] text-text-body">
                          {" "}&mdash; {desc}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Animation column */}
              <div
                className="rounded-2xl p-8 flex items-center justify-center min-h-[360px]"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(0,198,215,0.06) 0%, transparent 70%)",
                }}
              >
                <MagDriveAnimation />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Applications Grid ── */}
      <section className="px-8 mb-[50px]">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection delay={0.2}>
            <SectionLabel>Applications</SectionLabel>
            <SectionTitle>Feeds Any Packaging Format</SectionTitle>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {intellipakApplications.map((app, i) => (
              <StaggerItem key={i}>
                <ApplicationCard machine={app.machine} desc={app.desc} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </>
  );
}
