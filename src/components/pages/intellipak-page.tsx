"use client";

import Link from "next/link";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { GlowOrb } from "@/components/ui/glow-orb";
import { ConveyorAnimation, MagDriveAnimation } from "@/components/ui/intellipak-animations";
import { intellipakStats } from "@/data/intellipak";

const accent = "#f5a623";

export function IntelliPakContent() {
  return (
    <>
      {/* ══════════════════════════════════════════
          SECTION 1: HERO
          ══════════════════════════════════════════ */}
      <section className="pt-[140px] pb-[100px] px-8 relative">
        <GlowOrb top="-100px" left="-5%" size={500} color="245,166,35" />
        <div className="max-w-[1280px] mx-auto relative z-10">
          <AnimatedSection>
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
              <span className="font-mono text-[0.62rem] tracking-[0.1em] uppercase" style={{ color: accent }}>
                IntelliPak Feed Systems
              </span>
            </div>

            <h1 className="font-sans font-extrabold text-[clamp(32px,5vw,56px)] leading-[1.1] text-white max-w-[720px] mb-6">
              Your Infeed Is the Most Expensive Problem{" "}
              <span style={{ color: accent }}>You&apos;re Not Measuring</span>
            </h1>

            <p className="font-sans text-[clamp(16px,2vw,20px)] text-text-body leading-[1.65] mb-8 max-w-[620px]">
              Misfeeds, oil leaks, encoder failures, unplanned sanitation &mdash;
              conventional gearbox conveyors create costs that never show up on a
              line item. IntelliPak eliminates the gearbox entirely.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#hidden-cost"
                className="inline-flex items-center gap-1.5 font-sans text-[15px] font-bold text-white px-8 py-3.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, ${accent}, #e09000)`, boxShadow: `0 4px 20px ${accent}44` }}
              >
                See What Changes &rarr;
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 font-sans text-[15px] font-semibold text-text-body px-8 py-3.5 rounded-lg border border-white/20 hover:border-[#f5a623] hover:text-white transition-all duration-200"
              >
                Request a Quote
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Conveyor Animation ── */}
      <section className="px-8 mb-[50px]">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection delay={0.05}>
            <div className="font-mono text-[0.58rem] tracking-[0.12em] uppercase mb-4" style={{ color: accent }}>
              Live Product Flow &mdash; Random &rarr; Batched Precision
            </div>
            <ConveyorAnimation />
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="font-mono text-[0.6rem] text-text-dim tracking-[0.08em] uppercase">Infeed</div>
                <div className="font-sans text-[0.78rem] text-text-body mt-0.5">Random product arrival</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-[0.6rem] tracking-[0.08em] uppercase" style={{ color: accent }}>IntelliPak</div>
                <div className="font-sans text-[0.78rem] text-text-body mt-0.5">Gapping, merging &amp; timing</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-[0.6rem] text-text-dim tracking-[0.08em] uppercase">Output</div>
                <div className="font-sans text-[0.78rem] text-text-body mt-0.5">Uniform batches at speed</div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2: THE HIDDEN COST
          ══════════════════════════════════════════ */}
      <section
        id="hidden-cost"
        className="py-[100px] px-6 border-t border-border-default"
        style={{ background: "rgba(17,34,64,0.35)" }}
      >
        <div className="max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="font-mono text-[0.68rem] tracking-[0.2em] uppercase mb-4" style={{ color: accent }}>
              The Real Problem
            </div>
            <h2 className="font-sans font-extrabold text-[clamp(26px,4vw,44px)] leading-[1.15] text-white max-w-[700px] mb-7">
              It&apos;s Not Just Downtime.{" "}
              <span style={{ color: accent }}>It&apos;s Everything Around It.</span>
            </h2>
            <p className="font-sans text-[16px] leading-[1.75] text-text-body max-w-[700px] mb-10">
              Everyone knows a jammed infeed kills throughput. What nobody tracks
              is the cascade of costs that comes with conventional gearbox-driven
              feed systems:
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  title: "Oil Leaks",
                  body: "Trigger unplanned sanitation stops, product holds, and FSMA documentation. One contamination event on a dairy line can cost more than the conveyor itself.",
                  color: "#ff6666",
                },
                {
                  title: "Backlash & Slop",
                  body: "Increases over time, degrading product spacing until misfeeds become a daily event. Your operators compensate by running slower \u2014 throughput drops and nobody flags it.",
                  color: accent,
                },
                {
                  title: "Encoder Cable Failures",
                  body: "The cable breaks, the motor loses position, the line stops. Your maintenance team patches it. It breaks again in three weeks.",
                  color: accent,
                },
                {
                  title: "Sanitation Time",
                  body: "Gearbox housings trap contamination. Full teardown cleaning adds hours per sanitation cycle, every cycle, every week.",
                  color: "#ff6666",
                },
              ].map((item) => (
                <StaggerItem key={item.title}>
                  <div
                    className="bg-bg-card border border-border-default rounded-xl p-7 h-full"
                    style={{ borderLeftWidth: 3, borderLeftColor: item.color }}
                  >
                    <div className="font-sans text-[1.05rem] font-bold text-white mb-2">
                      {item.title}
                    </div>
                    <div className="font-sans text-[0.88rem] text-text-body leading-[1.65]">
                      {item.body}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <p className="font-sans text-[15px] text-text-dim leading-[1.7] mt-8 max-w-[700px]">
              None of these show up as a single line item. They&apos;re buried in
              maintenance logs, sanitation records, and throughput reports that
              nobody correlates. But they&apos;re real, and they add up.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section>
        <AnimatedSection delay={0.08}>
          <div className="bg-gradient-to-r from-[#112240] to-[#1A3055]/50 py-10 px-8">
            <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
              {intellipakStats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="font-mono text-[2rem] font-bold" style={{ color: accent }}>
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

      {/* ══════════════════════════════════════════
          SECTION 3: HOW MAG-DRIVE CHANGES THE EQUATION
          ══════════════════════════════════════════ */}
      <section className="py-[100px] px-6 border-t border-border-default">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection>
            <div className="font-mono text-[0.68rem] tracking-[0.2em] uppercase mb-4" style={{ color: accent }}>
              The IntelliPak Difference
            </div>
            <h2 className="font-sans font-extrabold text-[clamp(26px,4vw,44px)] leading-[1.15] text-white mb-5">
              No Gears. No Oil.{" "}
              <span style={{ color: accent }}>No Excuses.</span>
            </h2>
            <p className="font-sans text-[16px] text-text-body leading-[1.75] max-w-[720px] mb-10">
              IntelliPak uses One Motion Mag-Drive hub motors &mdash; a direct-drive,
              gearless, oil-free motor mounted inside the drive roller itself. No
              gearbox. No oil. No encoder cables. No backlash.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-14">
            {/* Text column */}
            <AnimatedSection delay={0.1}>
              <h3 className="font-sans text-[1.2rem] font-bold text-white mb-5">How It Works</h3>
              <p className="font-sans text-[0.9rem] text-text-body leading-[1.7] mb-6">
                The motor is a permanent-magnet synchronous design built into the
                conveyor roller. There&apos;s no mechanical coupling between the motor
                and the belt &mdash; the magnetic field drives the roller directly.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  ["Zero oil contamination risk", "no lubricant exists in the system to leak"],
                  ["Zero backlash", "magnetic coupling maintains exact position without mechanical slop"],
                  ["Zero encoder cables", "open-loop synchronous operation eliminates the most common failure point"],
                  ["Hub-mounted design", "the motor sits inside the roller, reducing footprint and simplifying maintenance"],
                ].map(([label, desc], i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accent}66` }} />
                    <div>
                      <span className="font-sans text-[0.88rem] font-semibold text-white">{label}</span>
                      <span className="font-sans text-[0.84rem] text-text-body"> &mdash; {desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Animation column */}
            <AnimatedSection delay={0.15}>
              <div
                className="rounded-2xl p-8 flex items-center justify-center min-h-[360px]"
                style={{ background: "radial-gradient(ellipse at center, rgba(245,166,35,0.06) 0%, transparent 70%)" }}
              >
                <MagDriveAnimation />
              </div>
            </AnimatedSection>
          </div>

          {/* Comparison table */}
          <AnimatedSection delay={0.2}>
            <h3 className="font-sans text-[1.1rem] font-bold text-white mb-6">What That Means on the Line</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="font-mono text-[0.62rem] tracking-[0.1em] uppercase text-text-dim text-left p-4 border-b border-border-default">Metric</th>
                    <th className="font-mono text-[0.62rem] tracking-[0.1em] uppercase text-accent-red text-left p-4 border-b border-border-default">Conventional Gearbox</th>
                    <th className="font-mono text-[0.62rem] tracking-[0.1em] uppercase text-left p-4 border-b border-border-default" style={{ color: accent }}>IntelliPak Mag-Drive</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Speed", "200\u2013350 PPM typical", "Up to 500 PPM"],
                    ["Energy consumption", "Baseline", "55% reduction"],
                    ["Sanitation time", "Full teardown required", "50% faster \u2014 no housings to clean"],
                    ["Oil contamination risk", "Ongoing", "Eliminated"],
                    ["Encoder cable failure", "Common failure mode", "No encoder cables"],
                    ["Backlash / drift", "Increases over time", "Zero \u2014 permanent magnet sync"],
                    ["Warranty", "Typically 1 year", "3-year AQS warranty"],
                  ].map(([metric, old, newVal], i) => (
                    <tr key={i} className="border-b border-border-default">
                      <td className="font-sans text-[0.88rem] font-medium text-white p-4">{metric}</td>
                      <td className="font-sans text-[0.85rem] text-text-dim p-4">{old}</td>
                      <td className="font-sans text-[0.85rem] text-text-body p-4 font-medium">{newVal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4: THE DOLLAR CONVERSATION
          ══════════════════════════════════════════ */}
      <section
        className="py-[100px] px-6 border-t border-border-default"
        style={{ background: "rgba(17,34,64,0.35)" }}
      >
        <div className="max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="font-mono text-[0.68rem] tracking-[0.2em] uppercase mb-4" style={{ color: accent }}>
              What This Costs You Today
            </div>
            <h2 className="font-sans font-extrabold text-[clamp(26px,4vw,44px)] leading-[1.15] text-white mb-7">
              Put a Number on It
            </h2>
            <p className="font-sans text-[16px] text-text-body leading-[1.75] max-w-[700px] mb-10">
              You already have the data to calculate what your current infeed is
              costing you. Here&apos;s what to look at:
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="flex flex-col gap-6 mb-10">
              {[
                {
                  title: "Unplanned sanitation stops",
                  body: "How many per quarter? What\u2019s the hourly cost of a stopped line? If a single oil contamination event triggers a 4-hour stop on a line running $X/hour in product value, that\u2019s your first number.",
                },
                {
                  title: "Throughput gap",
                  body: "If your infeed runs at 280 PPM but the downstream equipment can handle 400, that gap is unrealized capacity. Multiply the delta by your average package value and run hours per shift.",
                },
                {
                  title: "Maintenance hours",
                  body: "How many work orders per quarter are gearbox, encoder, or belt-tracking related? What\u2019s your fully-loaded maintenance labor rate?",
                },
                {
                  title: "OEE impact",
                  body: "A line running at 62% OEE versus 91% OEE on the same equipment is a 29-point spread. For a mid-size packaging line running two shifts, that spread often translates to hundreds of thousands in recovered annual throughput.",
                },
              ].map((item) => (
                <div key={item.title}>
                  <div className="font-sans text-[1rem] font-bold text-white mb-1.5">{item.title}</div>
                  <div className="font-sans text-[0.9rem] text-text-body leading-[1.7]">{item.body}</div>
                </div>
              ))}
            </div>

            {/* ROI Tool CTA */}
            <div
              className="rounded-xl px-7 py-6"
              style={{
                background: `${accent}08`,
                border: `1px solid ${accent}22`,
              }}
            >
              <div className="font-sans text-[15px] text-text-body leading-[1.75] mb-4">
                <span className="font-bold text-white">Want to see your specific numbers?</span>{" "}
                Our ROI Projection Tool calculates break-even timeline, 60-month cash
                flow impact, and labor savings based on your line&apos;s actual data.
              </div>
              <Link
                href="/apps"
                className="inline-flex items-center gap-1.5 font-sans text-[0.88rem] font-semibold px-6 py-3 rounded-lg transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: accent, color: "#0B1A2E", boxShadow: `0 4px 16px ${accent}44` }}
              >
                Run Your ROI Projection &rarr;
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 5: CONFIGURATIONS
          ══════════════════════════════════════════ */}
      <section className="py-[100px] px-6 border-t border-border-default">
        <div className="max-w-[1100px] mx-auto">
          <AnimatedSection>
            <div className="font-mono text-[0.68rem] tracking-[0.2em] uppercase mb-4" style={{ color: accent }}>
              System Options
            </div>
            <h2 className="font-sans font-extrabold text-[clamp(26px,4vw,44px)] leading-[1.15] text-white mb-5">
              Designed for Your Line,{" "}
              <span style={{ color: accent }}>Not a Catalog</span>
            </h2>
            <p className="font-sans text-[16px] text-text-body leading-[1.75] max-w-[720px] mb-12">
              Every IntelliPak system is engineered for the specific product, speed,
              and environment of your packaging line. Common configurations include:
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Smart Infeed Conveyor",
                desc: "Precision product gapping and metering for downstream packaging equipment. Synchronous Mag-Drive feeding at up to 500 PPM with exact product spacing.",
              },
              {
                title: "Accumulation System",
                desc: "Buffer zones that absorb upstream/downstream speed differentials without stopping the line. Zero-pressure accumulation prevents product damage.",
              },
              {
                title: "Merge & Divert",
                desc: "Multi-lane to single-lane merging or single-lane to multi-lane diversion. Mag-Drive precision ensures consistent product spacing through transitions.",
              },
              {
                title: "Complete Conveyor Architecture",
                desc: "Full line design from depalletizer to palletizer. IntelliPak feed systems integrated with AQS Custom Conveyors and VeriPak SCADA for end-to-end control and traceability.",
              },
            ].map((config) => (
              <StaggerItem key={config.title}>
                <div
                  className="bg-bg-card border border-border-default rounded-xl p-7 h-full group hover:bg-bg-card-hover hover:-translate-y-1 transition-all duration-300"
                  style={{ borderLeftWidth: 3, borderLeftColor: accent }}
                >
                  <h3 className="font-sans text-[1.05rem] font-bold text-white mb-2 group-hover:text-[#f5a623] transition-colors">
                    {config.title}
                  </h3>
                  <p className="font-sans text-[0.88rem] text-text-body leading-[1.65]">
                    {config.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 6: TECHNICAL SPECS
          ══════════════════════════════════════════ */}
      <section
        className="py-[100px] px-6 border-t border-border-default"
        style={{ background: "rgba(17,34,64,0.35)" }}
      >
        <div className="max-w-[1100px] mx-auto">
          <AnimatedSection>
            <div className="font-mono text-[0.68rem] tracking-[0.2em] uppercase mb-4" style={{ color: accent }}>
              Specifications
            </div>
            <h2 className="font-sans font-extrabold text-[clamp(26px,3.5vw,40px)] leading-[1.15] text-white mb-10">
              Technical Specifications
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-border-default rounded-xl overflow-hidden">
              {[
                { label: "Drive Technology", value: "One Motion Mag-Drive hub motors" },
                { label: "Motor Type", value: "Permanent-magnet synchronous, direct-drive" },
                { label: "Max Speed", value: "500+ PPM (application dependent)" },
                { label: "Control Platform", value: "Allen-Bradley CompactLogix + Optix HMI" },
                { label: "Construction", value: "TIG-welded 304/316 stainless steel" },
                { label: "Washdown Rating", value: "IP69K, NEMA 4X" },
                { label: "Energy Savings", value: "Up to 55% vs conventional gearbox" },
                { label: "Sanitation", value: "Up to 50% reduction in cleaning time" },
                { label: "Warranty", value: "3 years (standard)" },
                { label: "Integration", value: "VeriPak SCADA compatible for full-line traceability" },
              ].map((spec, i) => (
                <div
                  key={i}
                  className="p-4 border-b border-r border-border-default"
                  style={{ background: "rgba(17,34,64,0.3)" }}
                >
                  <div className="font-mono text-[0.62rem] tracking-[0.1em] uppercase mb-1" style={{ color: accent }}>
                    {spec.label}
                  </div>
                  <div className="font-sans text-[0.85rem] text-text-body leading-[1.5]">
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA — Page-specific
          ══════════════════════════════════════════ */}
      <section className="py-[100px] px-6 border-t border-border-default">
        <div className="max-w-[700px] mx-auto text-center">
          <AnimatedSection>
            <h2 className="font-sans font-extrabold text-[clamp(26px,4vw,40px)] leading-[1.15] text-white mb-5">
              Find Out What Your Infeed Is Actually Costing You
            </h2>
            <p className="font-sans text-[16px] text-text-body leading-[1.7] mb-8">
              Start with a project review. We&apos;ll evaluate your current line,
              identify where you&apos;re losing throughput and margin, and spec an
              IntelliPak system for your specific application.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/contact"
                className="font-sans font-bold text-[15px] px-8 py-3.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, ${accent}, #e09000)`, color: "#0B1A2E", boxShadow: `0 4px 20px ${accent}44` }}
              >
                Start a Project Review &rarr;
              </Link>
              <Link
                href="/apps"
                className="font-sans font-semibold text-[15px] px-8 py-3.5 rounded-lg border border-white/20 text-text-body hover:text-white transition-all duration-200"
                style={{ borderColor: `${accent}33` }}
              >
                Run the ROI Calculator &rarr;
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
