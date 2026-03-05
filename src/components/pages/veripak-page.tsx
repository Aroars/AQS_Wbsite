"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { SectionLabel, SectionTitle, SectionDesc } from "@/components/ui/section-header";
import { GlowOrb } from "@/components/ui/glow-orb";
import { ComparisonTable } from "@/components/ui/comparison-table";
import {
  DeviceIcon,
  ProductJourneyAnimation,
} from "@/components/ui/veripak-animations";
import { veripakSpecs, feedbackLoop } from "@/data/veripak-specs";

// ─── Color tokens ───
const accent = "#00c2ff";

const compatibleDevices = [
  "OneMotion\u00AE PM Motors",
  "Checkweighers",
  "Code Date Printers",
  "Metal Detectors",
  "X-Ray Systems",
  "Ethernet/IP Devices",
  "I/O Link Devices",
];

const feedbackColors = [accent, accent, "#f5a623", "#00d4aa"];

// ─── Standalone SCADA features ───
const scadaFeatures = [
  { icon: "\uD83D\uDCCA", title: "Real-Time Trending", desc: "Monitor all connected devices from one dashboard" },
  { icon: "\uD83D\uDEA8", title: "Alarm Escalation", desc: "Stack light \u2192 email \u2192 text \u2192 RACI routing" },
  { icon: "\uD83D\uDC64", title: "Operator Tracking", desc: "Multi-level permissions with activity logging" },
  { icon: "\uD83D\uDCCB", title: "Audit-Ready Reports", desc: "Shift, SKU, and QC event reports on demand" },
  { icon: "\uD83D\uDD10", title: "Dual-Network Security", desc: "No firewall bridging \u2014 IT approves this" },
  { icon: "\uD83C\uDF10", title: "VPN Remote Support", desc: "AQS engineers access securely, anytime" },
];

// ─── Stats ───
const stats = [
  { value: "60+", label: "Ethernet Devices Supported" },
  { value: "100%", label: "Package-Level Traceability" },
  { value: "3 Tiers", label: "Scalable Pricing" },
  { value: "24/7", label: "VPN Remote Support" },
];

// ─── Network architecture data ───
const machineDevices = ["CompactLogix PLC", "Metal Detectors", "Checkweighers", "VFDs & Sensors", "Keyence Vision"];
const userServices = ["Operator Dashboards", "Shift & SKU Reports", "ERP / SAP / Maximo", "Email / Text Alerts", "Remote VPN Access"];

export function VeriPakContent() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <>
      {/* ══════════════════════════════════════════
          HERO
          ══════════════════════════════════════════ */}
      <section className="pt-[140px] pb-[100px] px-8 relative overflow-hidden">
        <GlowOrb top="-100px" left="-5%" size={500} />

        {/* Subtle grid background */}
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
              style={{ background: `${accent}0D`, border: `1px solid ${accent}22` }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-accent-primary" style={{ boxShadow: "0 0 8px #00c2ff" }} />
              <span className="font-mono text-[0.62rem] text-accent-primary tracking-[0.1em] uppercase">
                Standalone SCADA Platform
              </span>
            </div>
            <SectionLabel>VeriPak Inspection Systems</SectionLabel>
            <SectionTitle>
              VeriPak<span className="text-accent-primary">&reg;</span> Packaging SCADA
            </SectionTitle>
            <SectionDesc>
              Connect every QC device on your line. Record every product. Report everything.
              VeriPak is a standalone SCADA system purpose-built for packaging quality control &mdash;
              delivering real-time visibility, immediate operator feedback, and automated intervention
              the moment something goes wrong.
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
      <section id="problem" className="py-[100px] px-6 border-t border-border-default" style={{ background: "rgba(17,34,64,0.35)" }}>
        <div className="max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="font-mono text-[0.68rem] text-accent-primary tracking-[0.2em] uppercase mb-4">
              The Problem
            </div>
            <h2 className="font-sans font-extrabold text-[clamp(26px,4vw,44px)] leading-[1.15] text-white max-w-[700px] mb-7">
              Your QC Devices Already Work.
              <br />
              <span className="text-accent-red">They Just Don&apos;t Talk.</span>
            </h2>
            <p className="font-sans text-[17px] leading-[1.75] text-text-body max-w-[660px] mb-10">
              Your metal detector logs to its own screen. Your checkweigher prints its own reports.
              Your code date printer runs independently. When an auditor walks in and asks for proof
              that every package was inspected on Tuesday&apos;s second shift &mdash; you scramble.
            </p>
          </AnimatedSection>

          {/* Before / After */}
          <AnimatedSection delay={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Status Quo */}
              <div
                className="rounded-xl p-7 relative overflow-hidden"
                style={{ background: "#0B1A2E", border: "1px solid rgba(255,102,102,0.2)" }}
              >
                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, #ff6666, #ff666644)` }} />
                <div className="font-mono text-[0.62rem] tracking-[0.15em] uppercase text-accent-red mb-4">
                  Status Quo
                </div>
                <div className="flex gap-2.5 mb-4 flex-wrap">
                  {(["md", "cw", "printer", "xray"] as const).map((t) => (
                    <div
                      key={t}
                      className="w-11 h-11 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(17,34,64,0.5)", border: "1px solid rgba(136,146,176,0.2)" }}
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
                  <div key={i} className="font-sans text-[13px] text-text-dim py-1 flex items-center gap-2">
                    <span className="text-accent-red text-sm">&times;</span> {t}
                  </div>
                ))}
              </div>

              {/* With VeriPak */}
              <div
                className="rounded-xl p-7 relative overflow-hidden"
                style={{ background: "#0B1A2E", border: `1px solid ${accent}33` }}
              >
                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}44)` }} />
                <div className="font-mono text-[0.62rem] tracking-[0.15em] uppercase text-accent-primary mb-4">
                  With VeriPak
                </div>
                <div className="flex gap-2.5 mb-4 flex-wrap items-center">
                  {(["md", "cw", "printer", "xray"] as const).map((t) => (
                    <div
                      key={t}
                      className="w-11 h-11 rounded-lg flex items-center justify-center"
                      style={{ background: `${accent}11`, border: `1px solid ${accent}44` }}
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
                  <div key={i} className="font-sans text-[13px] text-text-body py-1 flex items-center gap-2">
                    <span className="text-accent-green text-sm">&#x2713;</span> {t}
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CONFIG A — STANDALONE SCADA
          ══════════════════════════════════════════ */}
      <section className="py-[100px] px-6 border-t border-border-default">
        <div className="max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="font-mono text-[0.68rem] text-accent-primary tracking-[0.2em] uppercase mb-4">
              Config A &mdash; Standalone SCADA
            </div>
            <h2 className="font-sans font-extrabold text-[clamp(26px,3.5vw,40px)] leading-[1.15] text-white mb-4">
              VeriPak Doesn&apos;t Replace Your Equipment. It Connects It.
            </h2>
            <p className="font-sans text-[17px] leading-[1.75] text-text-body max-w-[640px] mb-12">
              Trend and alarm any Ethernet-connected equipment: metal detectors, checkweighers,
              drives, sensors, fillers, PLCs. Log every product-level data point. Track operators
              by role. No new inspection hardware required &mdash; just visibility, accountability, and proof.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scadaFeatures.map((f, i) => (
              <StaggerItem key={i}>
                <div
                  className="rounded-xl p-6 h-full transition-all duration-300"
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  style={{
                    background: hoveredFeature === i ? `${accent}0C` : "rgba(17,34,64,0.5)",
                    border: `1px solid ${hoveredFeature === i ? accent : "rgba(255,255,255,0.06)"}`,
                    transform: hoveredFeature === i ? "translateY(-4px)" : "translateY(0)",
                  }}
                >
                  <div
                    className="text-[22px] mb-2.5 transition-transform duration-300"
                    style={{ transform: hoveredFeature === i ? "scale(1.1)" : "scale(1)" }}
                  >
                    {f.icon}
                  </div>
                  <div className="font-sans text-[14px] font-bold text-white mb-1.5">{f.title}</div>
                  <div className="font-sans text-[13px] text-text-body leading-[1.5]">{f.desc}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Scale Smart callout */}
          <AnimatedSection delay={0.15}>
            <div
              className="mt-10 rounded-xl p-7 flex gap-4 items-start"
              style={{ background: `${accent}08`, border: `1px solid ${accent}22` }}
            >
              <span className="text-2xl leading-none mt-0.5">&#x1F680;</span>
              <div>
                <div className="font-sans font-bold text-[1.05rem] text-white mb-1.5">
                  Start Simple. <span className="text-accent-primary">Scale Smart.</span>
                </div>
                <div className="font-sans text-[14px] text-text-body leading-[1.65]">
                  Deploy VeriPak today as standalone SCADA monitoring. Add QC integration,
                  vision inspection, leak detection, and reject modules as your quality program
                  grows. Same HMI. Same data engine. Same reports. No rip-and-replace.
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
          CONFIG B — QC INTEGRATION / PRODUCT JOURNEY
          ══════════════════════════════════════════ */}
      <section className="py-[100px] px-6 border-t border-border-default" style={{ background: "rgba(17,34,64,0.35)" }}>
        <div className="max-w-[960px] mx-auto">
          <AnimatedSection>
            <div className="font-mono text-[0.68rem] text-accent-primary tracking-[0.2em] uppercase mb-4">
              Config B &mdash; QC Integration
            </div>
            <h2 className="font-sans font-extrabold text-[clamp(26px,3.5vw,40px)] leading-[1.15] text-white mb-4">
              Every Product Tagged. Every Record Unique.{" "}
              <span className="text-accent-primary">Nothing Assumed.</span>
            </h2>
            <p className="font-sans text-[17px] leading-[1.75] text-text-body max-w-[680px] mb-3">
              Most systems rely on the reject mechanism to catch problems. VeriPak is different &mdash; it tags
              pass/fail data directly to each physical product as it moves through every station. If a reject
              gate ever fails, you still know exactly which product carried which result. The record is the product.
            </p>
            <p className="font-sans text-[14px] leading-[1.6] text-text-dim max-w-[680px] mb-11 italic">
              Watch each product accumulate its own unique quality record as it passes through the line.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <ProductJourneyAnimation />
          </AnimatedSection>

          {/* Why this matters callout */}
          <AnimatedSection delay={0.25}>
            <div
              className="mt-5 rounded-xl p-4 px-5 flex gap-3.5 items-start"
              style={{ background: `${accent}08`, border: `1px solid ${accent}22` }}
            >
              <span className="text-xl leading-none mt-0.5">&#x1F4A1;</span>
              <div>
                <div className="font-sans font-bold text-[14px] text-white mb-1">Why this matters</div>
                <div className="font-sans text-[13px] text-text-body leading-[1.6]">
                  Most QC systems assume the reject gate caught the bad product. But gates can misfire, air can
                  lag, and conveyors slip. VeriPak&apos;s product-level tagging means every package carries its own
                  record &mdash; even if a reject mechanism fails, you know exactly which product had which result,
                  where it went, and who was operating the line.
                </div>
              </div>
            </div>
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
              Data Flows Out. <span className="text-accent-primary">Threats Don&apos;t Flow In.</span>
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr]">
              {/* Machine Network */}
              <div
                className="rounded-xl md:rounded-r-none p-7"
                style={{ background: "rgba(17,34,64,0.5)", border: "1px solid rgba(26,48,85,1)", borderRight: "1px solid rgba(26,48,85,1)" }}
              >
                <div className="font-mono text-[0.62rem] tracking-[0.12em] uppercase text-accent-red mb-4 flex items-center gap-1.5">
                  <span>&#x1F512;</span> Machine Network (Isolated)
                </div>
                {machineDevices.map((d, i) => (
                  <div key={i} className="font-sans text-[13px] text-text-body py-1 flex items-center gap-2">
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
                  Reads data<br />from machine side<br />Serves reports<br />to user side
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
                style={{ background: "rgba(17,34,64,0.5)", border: "1px solid rgba(26,48,85,1)", borderLeft: "1px solid rgba(26,48,85,1)" }}
              >
                <div className="font-mono text-[0.62rem] tracking-[0.12em] uppercase text-accent-green mb-4 flex items-center gap-1.5">
                  <span>&#x1F310;</span> User Network (Reporting)
                </div>
                {userServices.map((d, i) => (
                  <div key={i} className="font-sans text-[13px] text-text-body py-1 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                    {d}
                  </div>
                ))}
              </div>
            </div>

            {/* IT callout */}
            <div
              className="mt-5 rounded-xl px-5 py-3.5 flex items-center gap-3"
              style={{ background: "rgba(0,212,170,0.05)", border: "1px solid rgba(0,212,170,0.15)" }}
            >
              <span className="text-accent-green text-lg">&#x2713;</span>
              <span className="font-sans text-[14px] text-text-body">
                IT departments approve VeriPak because it provides visibility without creating attack surface.
              </span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS
          ══════════════════════════════════════════ */}
      <section className="py-20 px-6 border-t border-border-default" style={{ background: "rgba(17,34,64,0.35)" }}>
        <StaggerContainer className="max-w-[900px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <StaggerItem key={i}>
              <div className="text-center">
                <div className="font-mono font-bold text-[clamp(28px,4vw,42px)] text-accent-primary">
                  {s.value}
                </div>
                <div className="font-sans text-[13px] text-text-dim mt-1.5">{s.label}</div>
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
                  <div className="font-sans text-[0.95rem] font-bold text-white mb-1.5">{s.title}</div>
                  <div className="font-sans text-[0.82rem] text-text-body leading-[1.55]">{s.description}</div>
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

      {/* ══════════════════════════════════════════
          PLATFORM SPECS
          ══════════════════════════════════════════ */}
      <section className="py-[50px] px-6 border-t border-border-default" style={{ background: "rgba(17,34,64,0.35)" }}>
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection>
            <div className="font-mono text-[0.68rem] text-accent-primary tracking-[0.12em] uppercase mb-2.5">
              Platform Specifications
            </div>
            <h3 className="font-sans text-[1.3rem] font-bold text-white mb-5">
              What&apos;s Inside the VeriPak SCADA
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0.5 rounded-xl overflow-hidden border border-border-default">
              {veripakSpecs.map((item, i) => (
                <div key={i} className="bg-bg-card p-5">
                  <div className="font-mono text-[0.62rem] text-accent-primary tracking-[0.08em] uppercase mb-[7px]">
                    {item.label}
                  </div>
                  <div className="font-sans text-[0.84rem] text-text-body leading-[1.6]">{item.description}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          COMPARISON TABLE
          ══════════════════════════════════════════ */}
      <section className="py-[50px] px-6">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection>
            <h3 className="font-sans text-[1.4rem] font-bold text-white mb-6 text-center">
              Feature Comparison
            </h3>
            <div className="bg-bg-card border border-border-default rounded-xl overflow-hidden">
              <ComparisonTable />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          COMPATIBLE DEVICES
          ══════════════════════════════════════════ */}
      <section className="pb-[60px] px-6">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="font-mono text-[0.58rem] text-text-dim tracking-[0.1em] uppercase flex items-center mr-1.5">
                Compatible:
              </span>
              {compatibleDevices.map((d) => (
                <span
                  key={d}
                  className="font-sans text-[0.72rem] text-text-body border border-border-default px-2.5 py-1 rounded-full"
                >
                  {d}
                </span>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
