"use client";

import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { SectionLabel, SectionTitle, SectionDesc } from "@/components/ui/section-header";
import { LeakDetectionAnimation } from "@/components/ui/veripak-animations";
import { leakTypes, visionMisses } from "@/data/leak-types";
import Link from "next/link";

/* Product colours for this page are fills and edges only (plan section 3):
   cyan for the VeriPak platform, red for the failure/R&D state. All text
   sits on the semantic tokens. */
const cyan = "#00c2ff";
const red = "#ff6666";

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
    desc: "Calibrated suction cup engages the package surface. System measures the force required to achieve target deflection and records the package’s resistance profile.",
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

/* The "vision misses" marker: an icon stroke in the failure red, not text */
function MissIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      aria-hidden="true"
      className="shrink-0"
      style={{ color: red }}
    >
      <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function LeakDetectionContent() {
  return (
    <section className="pt-[140px] pb-[100px] px-8 relative">
      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* Hero \u2014 2A */}
        <AnimatedSection>
          <div className="flex flex-wrap gap-2 mb-[18px]">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
              style={{ background: `${cyan}14`, border: `1px solid ${cyan}2E` }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan" style={{ boxShadow: `0 0 8px ${cyan}` }} />
              <span className="font-mono text-[0.62rem] text-accent-text tracking-[0.1em] uppercase">
                VeriPak Module &mdash; Patent Pending
              </span>
            </div>
            <div
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
              style={{ background: `${red}14`, border: `1px solid ${red}2E` }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: red, boxShadow: `0 0 8px ${red}`, animation: "pulse 2s infinite" }} />
              <span className="font-mono text-[0.62rem] text-text-strong tracking-[0.1em] uppercase">
                R&amp;D
              </span>
            </div>
          </div>
          <SectionLabel>Leak Detection Systems</SectionLabel>
          <SectionTitle>
            Zero Leakers. Zero Guesswork.
          </SectionTitle>
          <SectionDesc>
            Vision systems inspect what a package looks like. Our dual-pull suction
            system tests whether it&apos;s actually sealed &mdash; detecting pinholes,
            grease-in-seal, and board cuts that cameras physically cannot see.
          </SectionDesc>
          <div className="flex flex-wrap gap-3 mt-6">
            <a
              href="#approach"
              className="font-sans text-[0.88rem] font-bold text-brand-navy-deep bg-brand-cyan px-7 py-3 rounded-lg no-underline shadow-[0_0_30px_rgba(0,194,255,0.25)] inline-block"
            >
              See How It Works &rarr;
            </a>
            <a
              href="#founding-partner"
              className="font-sans text-[0.88rem] font-semibold text-accent-text bg-transparent px-7 py-3 rounded-lg no-underline inline-block border border-border hover:border-accent-text transition-colors"
            >
              Join the Founding Partner Program &rarr;
            </a>
          </div>
        </AnimatedSection>

        {/* Ecosystem Context Banner \u2014 2B */}
        <AnimatedSection delay={0.08}>
          <div
            className="rounded-xl p-7 mt-[50px] mb-[60px] bg-surface-card border border-border"
            style={{ borderLeftColor: cyan, borderLeftWidth: "4px", boxShadow: "0 4px 12px rgba(10,22,40,0.06)" }}
          >
            <div className="font-mono text-[0.62rem] text-accent-text tracking-[0.12em] uppercase mb-2">
              Part of the VeriPak Ecosystem
            </div>
            <p className="font-sans text-[0.9rem] text-text-body leading-[1.7] mb-3">
              Leak detection runs on VeriPak&apos;s Allen-Bradley controls platform.
              Every test result feeds directly into VeriPak SCADA &mdash; logged, trended,
              and fused with vision inspection data into a single reject decision. The
              leak test becomes part of each package&apos;s verifiable identity.
            </p>
            <Link href="/solutions/veripak" className="font-sans text-[0.85rem] font-semibold text-accent-text no-underline hover:underline">
              Learn about VeriPak &rarr;
            </Link>
          </div>
        </AnimatedSection>

        {/* Business Pain Section \u2014 2C */}
        <AnimatedSection delay={0.1}>
          <div className="mb-[60px]">
            <div className="font-mono text-[0.65rem] text-accent-text tracking-[0.12em] uppercase mb-2.5">
              The Real Cost
            </div>
            <h3 className="font-sans text-[1.5rem] font-bold text-text-strong mb-4 leading-[1.2]">
              A Leaker That Reaches Retail Costs More Than the Package
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div>
                <p className="font-sans text-[0.9rem] text-text-body leading-[1.7] mb-4">
                  When a leaking package makes it past your line and onto a retailer&apos;s shelf,
                  the cost isn&apos;t just the product. It&apos;s the chargeback. It&apos;s the consumer
                  complaint that shows up on social media. It&apos;s the product hold triggered by
                  a failed shelf-life test. It&apos;s the recall exposure from a seal integrity
                  failure that nobody caught.
                </p>
                <p className="font-sans text-[0.9rem] text-text-body leading-[1.7] mb-4">
                  Most plants run vision-based leak detection or no inline leak detection at all.
                  Vision can verify labels, code dates, and surface cosmetics. But a pinhole smaller
                  than a camera pixel, grease trapped inside a seal zone, or a micro-puncture from
                  an L-board edge are physically invisible to optical inspection at production line speeds.
                </p>
                <p className="font-sans text-[0.9rem] leading-[1.7] font-medium text-text-strong">
                  These are the leakers that reach retail. And every one of them is a physics
                  problem &mdash; not an optics problem.
                </p>
              </div>
              {/* Stat tiles: the good/bad state is the top edge, the number is accent text */}
              <div className="grid grid-cols-2 gap-2.5">
                {visionStats.map((s, i) => (
                  <div
                    key={i}
                    className="bg-surface-card border border-border rounded-xl p-4 text-center"
                    style={{ borderTopWidth: 3, borderTopColor: s.bad ? red : cyan }}
                  >
                    <div className="font-mono text-[1.2rem] font-bold text-accent-text">
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

        {/* Our Approach \u2014 2D */}
        <AnimatedSection delay={0.15}>
          <div id="approach" className="mb-[60px]">
            <div className="font-mono text-[0.65rem] text-accent-text tracking-[0.12em] uppercase mb-2.5">
              Our Approach
            </div>
            <h3 className="font-sans text-[1.5rem] font-bold text-text-strong mb-1.5">
              We Don&apos;t Look at the Package. We Test It.
            </h3>
            <div className="font-mono text-[0.62rem] text-text-dim tracking-[0.1em] uppercase mb-6">
              Dual-Pull Differential Suction Detection
            </div>
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
                  <div className="bg-surface-card border border-border rounded-xl p-7 h-full">
                    {/* Decorative step numeral: a brand fill, not text */}
                    <div className="font-mono text-[2rem] font-extrabold opacity-40 mb-1.5" style={{ color: s.color }} aria-hidden>
                      {s.step}
                    </div>
                    <div className="font-sans text-[1.05rem] font-bold text-text-strong mb-2">
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
                background: `linear-gradient(135deg, ${cyan}0F, transparent 60%), var(--surface-card)`,
                border: "1px solid var(--border)",
                boxShadow: "0 4px 12px rgba(10,22,40,0.06)",
              }}
            >
              <div className="font-mono text-[0.62rem] text-accent-text tracking-[0.1em] uppercase mb-3">
                Why Differential Measurement Works
              </div>
              <div className="flex flex-col gap-3.5">
                {whyItWorks.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-[7px] h-[7px] rounded-full bg-brand-cyan mt-[7px] shrink-0 shadow-[0_0_8px_rgba(0,194,255,0.4)]" />
                    <div>
                      <div className="font-sans text-[0.9rem] font-semibold text-text-strong">
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
              <div className="font-mono text-[0.62rem] text-accent-text tracking-[0.1em] uppercase mb-3">
                What Vision Systems Miss
              </div>
              <div className="flex flex-col gap-2.5">
                {visionMisses.map((item, i) => (
                  <div key={i} className="flex gap-2.5 items-center">
                    <MissIcon />
                    <span className="font-sans text-[0.84rem] text-text-body">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Leak Types Grid \u2014 8 failure modes (unchanged) */}
        <AnimatedSection delay={0.25}>
          <div className="mb-[60px]">
            <div className="text-center mb-8">
              <SectionLabel>Deep Domain Expertise</SectionLabel>
              <h3 className="font-sans text-[1.4rem] font-bold text-text-strong mb-2">
                We Know Every Way a Package Fails
              </h3>
              <p className="font-sans text-[0.9rem] text-text-body max-w-[600px] mx-auto leading-[1.6]">
                Our system is designed around exhaustive knowledge of real-world
                packaging failure modes &mdash; not theoretical defect models.
              </p>
            </div>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {leakTypes.map((lt, i) => (
                <StaggerItem key={i}>
                  <div className="bg-surface-card border border-border rounded-xl p-[22px] h-full">
                    <div className="font-sans text-[0.95rem] font-semibold text-text-strong mb-1.5">
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

        {/* VeriPak Integration \u2014 2E (moved up before inline animation) */}
        <AnimatedSection delay={0.27}>
          <div className="mb-[60px]">
            <div className="font-mono text-[0.65rem] text-accent-text tracking-[0.12em] uppercase mb-2.5">
              Platform Integration
            </div>
            <h3 className="font-sans text-[1.5rem] font-bold text-text-strong mb-3.5">
              Not Just Detection &mdash; <span className="text-accent-text">Proof.</span>
            </h3>
            <p className="font-sans text-[0.92rem] text-text-body leading-[1.7] max-w-[750px] mb-4">
              This is what makes AQS leak detection fundamentally different from any standalone
              system: the leak test result becomes part of the package&apos;s verifiable identity.
            </p>
            <p className="font-sans text-[0.92rem] text-text-body leading-[1.7] max-w-[750px] mb-4">
              Every test feeds directly into VeriPak SCADA &mdash; logged by timestamp, SKU, operator,
              and defect classification. Force curves and deflection data stream into live dashboards
              for immediate operator feedback, shift-level trending, and audit-ready compliance reporting.
            </p>
            <p className="font-sans text-[0.92rem] text-text-body leading-[1.7] max-w-[750px] mb-8">
              When a customer disputes a shipment or an auditor questions seal integrity, you don&apos;t
              defend with &ldquo;our equipment was running.&rdquo; You pull up the specific package
              record &mdash; the force curve, the deflection data, the timestamp, the operator &mdash; all tied
              to that individual package.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
              {[
                { v: "\u25C8", l: "VeriPak Logged" },
                { v: "\u26A1", l: "Real-Time Reject" },
                { v: "\uD83D\uDCCA", l: "Trend Analysis" },
                { v: "\uD83D\uDD14", l: "Alert System" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-xl p-4 text-center"
                  style={{
                    background: `${cyan}0C`,
                    border: `1px solid ${cyan}26`,
                  }}
                >
                  <div className="text-[1.4rem] mb-1">{s.v}</div>
                  <div className="font-sans text-[0.65rem] text-accent-text uppercase tracking-[0.06em]">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>

            {/* Runs on VeriPak Controls callout */}
            <div
              className="rounded-xl p-7 bg-surface-card border border-border"
              style={{ borderLeftColor: cyan, borderLeftWidth: "4px", boxShadow: "0 4px 12px rgba(10,22,40,0.06)" }}
            >
              <div className="font-sans text-[1rem] font-bold text-text-strong mb-2">
                Runs on VeriPak Controls
              </div>
              <p className="font-sans text-[0.88rem] text-text-body leading-[1.65]">
                Leak detection shares VeriPak&apos;s Allen-Bradley CompactLogix PLC and Optix HMI.
                No separate controller. No data bridge. No additional enclosure. It&apos;s one
                platform, one data engine, one report &mdash; with leak integrity data fused alongside
                vision inspection, checkweigh, and metal detection.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Inline Detection Animation (unchanged) */}
        <AnimatedSection delay={0.3}>
          <div className="mb-[60px]">
            <div className="font-mono text-[0.65rem] text-accent-text tracking-[0.12em] uppercase mb-2.5">
              Inline Detection
            </div>
            <h3 className="font-sans text-[1.5rem] font-bold text-text-strong mb-3.5">
              See What Vision Can&apos;t. <span className="text-accent-text">Detect What Touch Can&apos;t.</span>
            </h3>
            <p className="font-sans text-[0.92rem] text-text-body leading-[1.7] max-w-[700px] mb-8">
              For vacuum-sealed and MAP packaging, visual inspection isn&apos;t enough.
              AQS&apos;s dual-pull leak detection uses controlled aspiration and differential
              pressure analysis to mechanically test every package &mdash; inline, at full speed.
              Binary pass/fail. No ML drift. No false-positive fatigue.
            </p>
            <LeakDetectionAnimation />
          </div>
        </AnimatedSection>

        {/* Founding Partner Program \u2014 2F */}
        <AnimatedSection delay={0.35}>
          <div
            id="founding-partner"
            className="text-center p-12 rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${cyan}0A, ${red}08), var(--surface-card)`,
              border: "1px solid var(--border)",
              boxShadow: "0 4px 12px rgba(10,22,40,0.06)",
            }}
          >
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-4" style={{ background: `${cyan}14`, border: `1px solid ${cyan}26` }}>
              <span className="font-mono text-[0.62rem] text-accent-text tracking-[0.1em] uppercase">
                Founding Partner Program
              </span>
            </div>
            <h3 className="font-sans text-[1.5rem] font-bold text-text-strong mb-2.5">
              Be Among the First to Solve Leak Detection Right
            </h3>
            <p className="font-sans text-[0.92rem] text-text-body max-w-[600px] mx-auto mb-6 leading-[1.6] text-left">
              We&apos;re selecting a limited number of production facilities to be among the first
              to run our dual-pull leak detection system inline. Founding partners receive:
            </p>
            <ul className="font-sans text-[0.9rem] text-text-body max-w-[600px] mx-auto mb-6 leading-[1.8] text-left list-none space-y-1">
              <li className="flex gap-2.5"><span className="text-accent-text shrink-0">&mdash;</span> Priority pricing on the leak detection module</li>
              <li className="flex gap-2.5"><span className="text-accent-text shrink-0">&mdash;</span> Direct engineering support during installation and validation</li>
              <li className="flex gap-2.5"><span className="text-accent-text shrink-0">&mdash;</span> Input into the final production design &mdash; your line, your feedback, your influence on the product</li>
              <li className="flex gap-2.5"><span className="text-accent-text shrink-0">&mdash;</span> Early access to the technology before general availability</li>
            </ul>
            <p className="font-sans text-[0.88rem] text-text-strong max-w-[520px] mx-auto mb-6 leading-[1.6]">
              If you&apos;re running vacuum-sealed or MAP packaging and you&apos;re tired of
              vision systems missing leakers &mdash; this is your chance to solve it first.
            </p>
            <a
              href="/contact"
              className="font-sans text-[0.9rem] font-bold text-brand-navy-deep bg-brand-cyan px-8 py-3.5 rounded-lg no-underline shadow-[0_0_30px_rgba(0,194,255,0.25)] inline-block"
            >
              Apply for the Founding Partner Program &rarr;
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
