"use client";

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
import { VeriPakBreadcrumb } from "@/components/ui/veripak-breadcrumb";
import { LeakDetectionAnimation } from "@/components/ui/veripak-animations";
import {
  VERIPAK_ACCENT,
  leakDetectionSteps,
  physicsAdvantages,
} from "@/data/veripak";

const accent = VERIPAK_ACCENT;

export function VeriPakLeakDetectionContent() {
  return (
    <section className="pt-[140px] pb-[100px] px-8 relative">
      <GlowOrb top="-100px" left="-5%" size={500} />
      <GlowOrb top="400px" left="80%" size={400} color="0,194,255" />

      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* Breadcrumb + Hero */}
        <AnimatedSection>
          <VeriPakBreadcrumb current="Leak Detection Module" />
          <SectionLabel>VeriPak Add-On Module</SectionLabel>
          <SectionTitle>
            See What Vision Can&apos;t.
            <br />
            Detect What Touch Can&apos;t.
          </SectionTitle>
          <SectionDesc>
            For vacuum-sealed and MAP packaging, visual inspection isn&apos;t
            enough. AQS&apos;s dual-pull leak detection uses controlled
            aspiration and differential pressure analysis to mechanically test
            every package &mdash; inline, at full speed. Binary pass/fail. No ML
            drift. No false-positive fatigue.
          </SectionDesc>
        </AnimatedSection>

        {/* Leak Detection Animation */}
        <AnimatedSection delay={0.1}>
          <div className="my-[50px]">
            <LeakDetectionAnimation />
          </div>
        </AnimatedSection>

        {/* Three-Step Process */}
        <AnimatedSection delay={0.15}>
          <div className="mb-[60px]">
            <div
              className="font-mono text-[0.65rem] tracking-[0.12em] uppercase mb-2.5"
              style={{ color: accent }}
            >
              Dual-Pull Differential Suction
            </div>
            <h3 className="font-sans text-[1.3rem] font-bold text-white mb-5">
              How It Works
            </h3>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {leakDetectionSteps.map((s, i) => (
                <StaggerItem key={i}>
                  <div className="bg-bg-card border border-border-default rounded-xl p-7 h-full">
                    <div
                      className="font-mono text-[2rem] font-extrabold opacity-25 mb-1.5"
                      style={{ color: s.color }}
                    >
                      {s.step}
                    </div>
                    <div className="font-sans text-[1.05rem] font-bold text-white mb-2">
                      {s.title}
                    </div>
                    <div className="font-sans text-[0.85rem] text-text-body leading-[1.6]">
                      {s.desc}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </AnimatedSection>

        {/* Why Physics > Vision */}
        <AnimatedSection delay={0.2}>
          <div className="mb-[60px]">
            <div
              className="rounded-2xl p-9"
              style={{
                background: `linear-gradient(135deg, ${accent}08, ${accent}03)`,
                border: `1px solid ${accent}15`,
              }}
            >
              <div
                className="font-mono text-[0.62rem] tracking-[0.1em] uppercase mb-3"
                style={{ color: accent }}
              >
                Why Differential Measurement Works
              </div>
              <div className="flex flex-col gap-3.5">
                {physicsAdvantages.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div
                      className="w-[7px] h-[7px] rounded-full mt-[7px] shrink-0"
                      style={{
                        backgroundColor: accent,
                        boxShadow: `0 0 8px ${accent}66`,
                      }}
                    />
                    <div>
                      <div className="font-sans text-[0.9rem] font-semibold text-white">
                        {item.title}
                      </div>
                      <div className="font-sans text-[0.82rem] text-text-body leading-[1.5]">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* VeriPak Integration Callout */}
        <AnimatedSection delay={0.25}>
          <div
            className="rounded-2xl p-8 flex gap-4 items-start"
            style={{
              background: `${accent}08`,
              border: `1px solid ${accent}22`,
            }}
          >
            <span className="text-2xl leading-none mt-0.5">&#x1F517;</span>
            <div>
              <div className="font-sans font-bold text-[1.05rem] text-white mb-1.5">
                Integrated with VeriPak SCADA
              </div>
              <div className="font-sans text-[14px] text-text-body leading-[1.65]">
                Every leak detection event feeds directly into the VeriPak
                platform in real time &mdash; logged by timestamp, SKU,
                operator, and defect classification. Force curves and deflection
                data stream into live dashboards for immediate operator
                feedback, shift-level trending, and audit-ready compliance.
                VeriPak fuses leak integrity data with vision inspection data
                into a single reject decision.
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
