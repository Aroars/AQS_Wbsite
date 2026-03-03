"use client";

import Image from "next/image";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { SectionLabel, SectionTitle, SectionDesc } from "@/components/ui/section-header";
import { GlowOrb } from "@/components/ui/glow-orb";
import { ComparisonTable } from "@/components/ui/comparison-table";
import { veripakSpecs, feedbackLoop } from "@/data/veripak-specs";

const scadaStats = [
  { v: "< 1s", l: "Alert latency from defect to operator notification", color: "#00c2ff" },
  { v: "Live", l: "Dashboards — pass/fail, reject rates, device status", color: "#00d4aa" },
  { v: "Auto", l: "Line stop when reject accumulation exceeds threshold", color: "#f5a623" },
  { v: "0", l: "Third-party software required — fully standalone", color: "#00c2ff" },
];

const feedbackColors = ["#00c2ff", "#00c2ff", "#f5a623", "#00d4aa"];

const compatibleDevices = [
  "OneMotion® PM Motors",
  "Checkweighers",
  "Code Date Printers",
  "Metal Detectors",
  "X-Ray Systems",
  "Ethernet/IP Devices",
  "I/O Link Devices",
];

export function VeriPakContent() {
  return (
    <section className="pt-[140px] pb-[100px] px-8 relative">
      <GlowOrb top="-100px" left="-5%" size={500} />
      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* Hero */}
        <AnimatedSection>
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-[18px]" style={{ background: "rgba(0,194,255,0.08)", border: "1px solid rgba(0,194,255,0.15)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-accent-primary" style={{ boxShadow: "0 0 8px #00c2ff" }} />
            <span className="font-mono text-[0.62rem] text-accent-primary tracking-[0.1em] uppercase">
              Standalone SCADA Platform
            </span>
          </div>
          <SectionLabel>VeriPak Inspection Systems</SectionLabel>
          <SectionTitle>
            Your Packaging Line&apos;s
            <br />
            Command Center
          </SectionTitle>
          <SectionDesc>
            VeriPak is a standalone SCADA system purpose-built for packaging
            quality control. It doesn&apos;t just log data after the fact — it
            delivers real-time visibility, immediate operator feedback, and
            automated intervention the moment something goes wrong. Every device
            on your line becomes a live node in a connected, auditable control
            network.
          </SectionDesc>
        </AnimatedSection>

        {/* System imagery */}
        <AnimatedSection delay={0.05}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-[50px]">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border-default">
              <Image
                src="/images/veripak/hmi-dashboard.jpg"
                alt="VeriPak SCADA HMI dashboard displaying real-time packaging inspection data with pass/fail rates and device status"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border-default">
              <Image
                src="/images/veripak/system-enclosure.jpg"
                alt="VeriPak stainless steel enclosure with integrated HMI touchscreen mounted on a packaging line"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </AnimatedSection>

        {/* Real-Time Data Callout */}
        <AnimatedSection delay={0.08}>
          <div
            className="rounded-2xl p-9 mb-[50px]"
            style={{
              background: "linear-gradient(135deg, rgba(0,194,255,0.06), rgba(0,102,255,0.03))",
              border: "1px solid rgba(0,194,255,0.12)",
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-9">
              <div>
                <div className="font-mono text-[0.62rem] text-accent-primary tracking-[0.12em] uppercase mb-2.5">
                  Real-Time SCADA — Not a Data Logger
                </div>
                <h3 className="font-sans text-[1.4rem] font-bold text-white mb-3 leading-[1.2]">
                  See It. Know It. Fix It. Now.
                </h3>
                <p className="font-sans text-[0.9rem] text-text-body leading-[1.7] mb-3.5">
                  Most &ldquo;quality systems&rdquo; collect data you review
                  tomorrow morning. VeriPak operates as a true SCADA —
                  supervisory control and data acquisition — delivering live
                  dashboards, instant alerts, and automated responses in real
                  time. When a reject threshold is hit, the line knows
                  immediately. When an operator logs a SKU change, every
                  connected device updates simultaneously.
                </p>
                <p className="font-sans text-[0.9rem] text-text-body leading-[1.7]">
                  No middleware. No third-party software. No IT integration
                  project. VeriPak is a self-contained control platform that
                  drops onto your line and starts supervising from day one.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {scadaStats.map((s, i) => (
                  <div
                    key={i}
                    className="bg-black/30 rounded-xl p-4 text-center"
                  >
                    <div
                      className="font-mono text-[1.3rem] font-bold"
                      style={{ color: s.color }}
                    >
                      {s.v}
                    </div>
                    <div className="font-sans text-[0.62rem] text-text-dim mt-1 leading-[1.4]">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Feedback Loop */}
        <AnimatedSection delay={0.12}>
          <div className="mb-[50px]">
            <div className="font-mono text-[0.62rem] text-accent-primary tracking-[0.12em] uppercase mb-2.5">
              Immediate Feedback Loop
            </div>
            <h3 className="font-sans text-[1.3rem] font-bold text-white mb-6">
              From Detection to Decision in Real Time
            </h3>
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
                        →
                      </div>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </AnimatedSection>

        {/* Platform Specs */}
        <AnimatedSection delay={0.15}>
          <div className="mb-[50px]">
            <div className="font-mono text-[0.62rem] text-accent-primary tracking-[0.12em] uppercase mb-2.5">
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
                  <div className="font-sans text-[0.84rem] text-text-body leading-[1.6]">
                    {item.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Comparison Table */}
        <AnimatedSection delay={0.2}>
          <div className="mt-5">
            <h3 className="font-sans text-[1.4rem] font-bold text-white mb-6 text-center">
              Feature Comparison
            </h3>
            <div className="bg-bg-card border border-border-default rounded-xl overflow-hidden">
              <ComparisonTable />
            </div>
          </div>
        </AnimatedSection>

        {/* Compatible Devices */}
        <AnimatedSection delay={0.25}>
          <div className="mt-11 flex flex-wrap gap-2 justify-center">
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
  );
}
