"use client";

import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { SectionLabel, SectionTitle, SectionDesc } from "@/components/ui/section-header";
import { GlowOrb } from "@/components/ui/glow-orb";
import { LeakDetectionAnimation } from "@/components/ui/veripak-animations";
import { leakTypes, visionMisses } from "@/data/leak-types";

const visionStats = [
  { v: "< 1px", l: "Typical pinhole size vs camera resolution", bad: true },
  { v: "0%", l: "Vision detection rate for grease-in-seal", bad: true },
  { v: "300+", l: "Packages/min at production speed", bad: false },
  { v: "8+", l: "Distinct leak failure modes", bad: false },
];

const dualPullSteps = [
  {
    step: "01",
    title: "First Pull",
    desc: "Calibrated suction cup engages the package surface. System measures the force required to achieve target deflection and records the package's resistance profile.",
    color: "#00c2ff",
  },
  {
    step: "02",
    title: "Second Pull",
    desc: "Identical suction applied immediately after. A sealed package reproduces the same force/deflection curve. A leaking package — even with a pinhole — shows measurable atmosphere ingress.",
    color: "#00c2ff",
  },
  {
    step: "03",
    title: "Delta Analysis",
    desc: "The force differential and deflection delta between pulls are compared against known-good baselines. Any deviation beyond threshold triggers reject. Binary pass/fail — no interpretation needed.",
    color: "#00d4aa",
  },
];

const whyItWorks = [
  {
    t: "Physics, Not Pixels",
    d: "Detects actual atmosphere ingress through any breach — pinholes, grease in seal, board cuts, micro-tears — regardless of visual appearance.",
  },
  {
    t: "Self-Referencing",
    d: "Each package is its own baseline. The first pull establishes the reference. No calibration drift, no ambient light issues, no camera focus problems.",
  },
  {
    t: "Binary Output",
    d: "Force delta exceeds threshold → reject. No ML model interpretation, no confidence scores, no false-positive tuning nightmares.",
  },
  {
    t: "Line-Speed Compatible",
    d: "Mechanical actuation at production speed. No image processing latency or frame-rate limitations.",
  },
];

export function LeakDetectionContent() {
  return (
    <section className="pt-[140px] pb-[100px] px-8 relative">
      <GlowOrb top="-100px" left="60%" size={500} color="255,60,60" />
      <GlowOrb top="400px" left="-10%" size={400} color="0,194,255" />

      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* Hero */}
        <AnimatedSection>
          <div
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-[18px]"
            style={{ background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.18)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#ff5050]" style={{ boxShadow: "0 0 8px #ff5050", animation: "pulse 2s infinite" }} />
            <span className="font-mono text-[0.62rem] text-[#ff8080] tracking-[0.1em] uppercase">
              R&D — Patent Pending Technology
            </span>
          </div>
          <SectionLabel>Leak Detection Systems</SectionLabel>
          <SectionTitle>
            Vision Can&apos;t Detect What
            <br />
            Physics Can Measure
          </SectionTitle>
          <SectionDesc>
            After years of implementing and evaluating every major vision-based
            leak detection approach on the market, we&apos;ve concluded none of
            them reliably detect the defects that cause real recalls. So
            we&apos;re building something that actually works — a physical,
            mechanical detection system grounded in measurable force and
            deflection.
          </SectionDesc>
        </AnimatedSection>

        {/* The Problem with Vision */}
        <AnimatedSection delay={0.1}>
          <div
            className="rounded-2xl p-10 mb-[60px]"
            style={{
              background: "linear-gradient(135deg, rgba(255,60,60,0.06), rgba(255,60,60,0.02))",
              border: "1px solid rgba(255,80,80,0.12)",
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div>
                <div className="font-mono text-[0.65rem] text-[#ff8080] tracking-[0.12em] uppercase mb-2.5">
                  The Industry Problem
                </div>
                <h3 className="font-sans text-[1.5rem] font-bold text-white mb-3.5 leading-[1.2]">
                  Why Vision-Based Leak Detection Fails
                </h3>
                <p className="font-sans text-[0.9rem] text-text-body leading-[1.7] mb-4">
                  Camera systems inspect what a package{" "}
                  <em className="text-white/70">looks like</em> — not whether
                  it&apos;s actually sealed. A pinhole smaller than a pixel,
                  grease trapped inside a seal zone, or a micro-puncture from an
                  L-board edge are physically invisible to optical inspection at
                  production line speeds.
                </p>
                <p className="font-sans text-[0.9rem] text-text-body leading-[1.7]">
                  Vision can verify labels, code dates, and surface cosmetics.
                  But when a package leaves the sealer looking perfect and
                  arrives at distribution leaking — that&apos;s a physics
                  problem, not an optics problem.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {visionStats.map((s, i) => (
                  <div key={i} className="bg-black/30 rounded-xl p-4 text-center">
                    <div className="font-mono text-[1.2rem] font-bold" style={{ color: s.bad ? "#ff6666" : "#00c2ff" }}>
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

        {/* Our Approach */}
        <AnimatedSection delay={0.15}>
          <div className="mb-[60px]">
            <div className="font-mono text-[0.65rem] text-accent-primary tracking-[0.12em] uppercase mb-2.5">
              Our Approach
            </div>
            <h3 className="font-sans text-[1.5rem] font-bold text-white mb-3.5">
              Dual-Pull Differential Suction Detection
            </h3>
            <p className="font-sans text-[0.92rem] text-text-body leading-[1.7] max-w-[700px] mb-8">
              Instead of looking at a package, we test it. Our system applies
              calibrated suction to the package surface in two consecutive pulls
              and measures the force response and surface deflection on each
              pull. A sealed package produces consistent, repeatable readings. A
              leaking package shows measurable delta between pulls as atmosphere
              enters the compromised seal.
            </p>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dualPullSteps.map((s, i) => (
                <StaggerItem key={i}>
                  <div className="bg-bg-card border border-border-default rounded-xl p-7">
                    <div className="font-mono text-[2rem] font-extrabold opacity-25 mb-1.5" style={{ color: s.color }}>
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

        {/* Why This Works + Vision Misses */}
        <AnimatedSection delay={0.2}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-[70px]">
            <div
              className="rounded-2xl p-9"
              style={{
                background: "linear-gradient(135deg, rgba(0,194,255,0.05), rgba(0,102,255,0.03))",
                border: "1px solid rgba(0,194,255,0.1)",
              }}
            >
              <div className="font-mono text-[0.62rem] text-accent-primary tracking-[0.1em] uppercase mb-3">
                Why Differential Measurement Works
              </div>
              <div className="flex flex-col gap-3.5">
                {whyItWorks.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-[7px] h-[7px] rounded-full bg-accent-primary mt-[7px] shrink-0 shadow-[0_0_8px_rgba(0,194,255,0.4)]" />
                    <div>
                      <div className="font-sans text-[0.9rem] font-semibold text-white">
                        {item.t}
                      </div>
                      <div className="font-sans text-[0.82rem] text-text-body leading-[1.5]">
                        {item.d}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="font-mono text-[0.62rem] text-[#ff8080] tracking-[0.1em] uppercase mb-3">
                What Vision Systems Miss
              </div>
              <div className="flex flex-col gap-2.5">
                {visionMisses.map((item, i) => (
                  <div key={i} className="flex gap-2.5 items-center">
                    <span className="font-mono text-[0.8rem] text-[#ff6666] shrink-0">
                      &#x2715;
                    </span>
                    <span className="font-sans text-[0.84rem] text-text-body">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Leak Types Grid */}
        <AnimatedSection delay={0.25}>
          <div className="mb-[60px]">
            <div className="text-center mb-8">
              <SectionLabel>Deep Domain Expertise</SectionLabel>
              <h3 className="font-sans text-[1.4rem] font-bold text-white mb-2">
                We Know Every Way a Package Fails
              </h3>
              <p className="font-sans text-[0.9rem] text-text-body max-w-[600px] mx-auto leading-[1.6]">
                Our system is designed around exhaustive knowledge of real-world
                packaging failure modes — not theoretical defect models.
              </p>
            </div>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {leakTypes.map((lt, i) => (
                <StaggerItem key={i}>
                  <div className="bg-bg-card border border-border-default rounded-xl p-[22px]">
                    <div className="font-sans text-[0.95rem] font-semibold text-white mb-1.5">
                      {lt.name}
                    </div>
                    <div className="font-sans text-[0.8rem] text-text-body leading-[1.55]">
                      {lt.description}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </AnimatedSection>

        {/* Inline Detection Animation */}
        <AnimatedSection delay={0.28}>
          <div className="mb-[60px]">
            <div className="font-mono text-[0.65rem] text-accent-primary tracking-[0.12em] uppercase mb-2.5">
              Inline Detection
            </div>
            <h3 className="font-sans text-[1.5rem] font-bold text-white mb-3.5">
              See What Vision Can&apos;t. <span className="text-accent-primary">Detect What Touch Can&apos;t.</span>
            </h3>
            <p className="font-sans text-[0.92rem] text-text-body leading-[1.7] max-w-[700px] mb-8">
              For vacuum-sealed and MAP packaging, visual inspection isn&apos;t enough.
              AQS&apos;s dual-pull leak detection uses controlled aspiration and differential
              pressure analysis to mechanically test every package — inline, at full speed.
              Binary pass/fail. No ML drift. No false-positive fatigue.
            </p>
            <LeakDetectionAnimation />
          </div>
        </AnimatedSection>

        {/* VeriPak Integration */}
        <AnimatedSection delay={0.3}>
          <div className="bg-bg-card border border-border-default rounded-2xl p-9 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center mb-[60px]">
            <div>
              <div className="font-mono text-[0.62rem] text-accent-primary tracking-[0.1em] uppercase mb-2">
                Platform Integration
              </div>
              <h3 className="font-sans text-[1.3rem] font-bold text-white mb-2.5">
                Connected to VeriPak SCADA
              </h3>
              <p className="font-sans text-[0.88rem] text-text-body leading-[1.65]">
                Every leak detection event feeds directly into the VeriPak SCADA
                platform in real time — logged by timestamp, SKU, operator, and
                defect classification. Force curves and deflection data stream
                into live dashboards for immediate operator feedback,
                shift-level trending, and audit-ready compliance. No standalone
                system, no data silos — one unified command center.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { v: "◈", l: "VeriPak Logged" },
                { v: "⚡", l: "Real-Time Reject" },
                { v: "📊", l: "Trend Analysis" },
                { v: "🔔", l: "Alert System" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-xl p-4 text-center"
                  style={{
                    background: "rgba(0,194,255,0.06)",
                    border: "1px solid rgba(0,194,255,0.1)",
                  }}
                >
                  <div className="text-[1.4rem] mb-1">{s.v}</div>
                  <div className="font-sans text-[0.65rem] text-accent-primary uppercase tracking-[0.06em]">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Early Access CTA */}
        <AnimatedSection delay={0.35}>
          <div
            className="text-center p-12 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(0,194,255,0.04), rgba(255,60,60,0.03))",
              border: "1px solid rgba(0,194,255,0.08)",
            }}
          >
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-4" style={{ background: "rgba(0,194,255,0.08)", border: "1px solid rgba(0,194,255,0.15)" }}>
              <span className="font-mono text-[0.62rem] text-accent-primary tracking-[0.1em] uppercase">
                Early Access Program
              </span>
            </div>
            <h3 className="font-sans text-[1.5rem] font-bold text-white mb-2.5">
              Interested in Real Leak Detection?
            </h3>
            <p className="font-sans text-[0.92rem] text-text-body max-w-[520px] mx-auto mb-6 leading-[1.6]">
              We&apos;re partnering with select facilities to validate and
              refine our dual-pull system in production environments. If
              you&apos;re tired of vision systems missing leakers, let&apos;s
              talk.
            </p>
            <a
              href="/contact"
              className="font-sans text-[0.9rem] font-bold text-bg-primary bg-gradient-to-br from-accent-primary to-[#0088ff] px-8 py-3.5 rounded-lg no-underline shadow-[0_0_30px_rgba(0,194,255,0.25)] inline-block"
            >
              Join the Early Access Program →
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
