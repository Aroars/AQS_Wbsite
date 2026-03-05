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
import {
  VERIPAK_ACCENT,
  visionCapabilities,
  imageHistorianFeatures,
  rejectFeatures,
} from "@/data/veripak";

const accent = VERIPAK_ACCENT;

export function VeriPakFullInspectionContent() {
  return (
    <section className="pt-[140px] pb-[100px] px-8 relative">
      <GlowOrb top="-100px" left="60%" size={500} />
      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* Breadcrumb + Hero */}
        <AnimatedSection>
          <VeriPakBreadcrumb current="Full Inspection Suite" />
          <SectionLabel>VeriPak Add-On Module</SectionLabel>
          <SectionTitle>
            Full Inspection Suite
          </SectionTitle>
          <SectionDesc>
            Keyence vision inspection, Package Image Historian, and
            lane-specific pneumatic reject &mdash; all feeding into the VeriPak
            QC Decision Engine. See every defect. Save every image. Remove
            every failure.
          </SectionDesc>
        </AnimatedSection>

        {/* Vision Capabilities */}
        <AnimatedSection delay={0.1}>
          <div className="mt-[50px] mb-[60px]">
            <div
              className="font-mono text-[0.65rem] tracking-[0.12em] uppercase mb-2.5"
              style={{ color: accent }}
            >
              Keyence Vision Integration
            </div>
            <h3 className="font-sans text-[1.3rem] font-bold text-white mb-5">
              See Every Detail at Production Speed
            </h3>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {visionCapabilities.map((v, i) => (
                <StaggerItem key={i}>
                  <div className="rounded-xl p-6 bg-black/20 border border-white/[0.04] h-full">
                    <div className="font-sans text-[0.95rem] font-semibold text-white mb-1.5">
                      {v.title}
                    </div>
                    <p className="font-sans text-[0.82rem] text-text-body leading-[1.6] m-0">
                      {v.desc}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </AnimatedSection>

        {/* Package Image Historian */}
        <AnimatedSection delay={0.15}>
          <div className="mb-[60px]">
            <div
              className="rounded-2xl p-9"
              style={{
                background: `linear-gradient(135deg, ${accent}08, ${accent}03)`,
                border: `1px solid ${accent}15`,
              }}
            >
              <div
                className="font-mono text-[0.65rem] tracking-[0.12em] uppercase mb-2.5"
                style={{ color: accent }}
              >
                Package Image Historian
              </div>
              <h3 className="font-sans text-[1.3rem] font-bold text-white mb-4">
                Every Package Photographed. Every Image Saved.
              </h3>
              <p className="font-sans text-[0.9rem] text-text-body leading-[1.7] max-w-[640px] mb-5">
                When paired with vision inspection, VeriPak saves an image of
                every package &mdash; pass or fail &mdash; directly to your
                server. When an auditor asks or a recall hits, you have visual
                proof of every inspection.
              </p>
              <div className="flex flex-col gap-2">
                {imageHistorianFeatures.map((f, i) => (
                  <div
                    key={i}
                    className="font-sans text-[0.85rem] text-text-body flex items-center gap-2"
                  >
                    <span className="text-accent-green text-sm">&#x2713;</span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Reject System */}
        <AnimatedSection delay={0.2}>
          <div className="mb-[60px]">
            <div
              className="font-mono text-[0.65rem] tracking-[0.12em] uppercase mb-2.5"
              style={{ color: accent }}
            >
              Reject System
            </div>
            <h3 className="font-sans text-[1.3rem] font-bold text-white mb-5">
              Remove Every Failure. Automatically.
            </h3>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {rejectFeatures.map((r, i) => (
                <StaggerItem key={i}>
                  <div className="rounded-xl p-6 bg-black/20 border border-white/[0.04] h-full">
                    <div className="font-sans text-[0.95rem] font-semibold text-white mb-1.5">
                      {r.title}
                    </div>
                    <p className="font-sans text-[0.82rem] text-text-body leading-[1.6] m-0">
                      {r.desc}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </AnimatedSection>

        {/* Process Flow */}
        <AnimatedSection delay={0.25}>
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background: "#0B1A2E",
              border: "1px solid rgba(26,48,85,1)",
            }}
          >
            <div
              className="font-mono text-[0.62rem] tracking-[0.1em] uppercase mb-3"
              style={{ color: accent }}
            >
              Full Inspection Process Flow
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-[0.8rem]">
              {[
                "Thermoformer",
                "Gapping",
                "Leak Detection",
                "Vision Inspection",
                "Lane-Specific Reject",
                "Downstream",
              ].map((step, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span
                    className="font-mono px-3 py-1.5 rounded-lg"
                    style={{
                      background: `${accent}11`,
                      border: `1px solid ${accent}22`,
                      color: accent,
                    }}
                  >
                    {step}
                  </span>
                  {i < 5 && (
                    <span className="text-accent-primary/30">&rarr;</span>
                  )}
                </span>
              ))}
            </div>
            <div className="mt-4 font-sans text-[0.78rem] text-text-dim">
              VeriPak QC Decision Engine runs underneath all stages &mdash; data
              fusion, unified reject control, full traceability
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
