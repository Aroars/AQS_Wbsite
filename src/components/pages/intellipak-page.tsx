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
              Every Product in the Right Place.{" "}
              <span style={{ color: accent }}>Every Time.</span>
            </h1>

            <p className="font-sans text-[clamp(16px,2vw,20px)] text-text-body leading-[1.65] mb-8 max-w-[620px]">
              IntelliPak is a smart conveyor system that creates precise gaps for
              inspection and batches verified product into exact groups &mdash;
              feeding thermoformers, case packers, flow wrappers, and hand-pack
              stations at speed.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#product-flow"
                className="inline-flex items-center gap-1.5 font-sans text-[15px] font-bold text-white px-8 py-3.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, ${accent}, #e09000)`, boxShadow: `0 4px 20px ${accent}44` }}
              >
                See How It Works &rarr;
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

      {/* ══════════════════════════════════════════
          SECTION 2: PRODUCT FLOW ANIMATION
          ══════════════════════════════════════════ */}
      <section id="product-flow" className="px-8 mb-[50px]">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection delay={0.05}>
            <div className="font-mono text-[0.58rem] tracking-[0.12em] uppercase mb-4" style={{ color: accent }}>
              Live Product Flow &mdash; Random &rarr; Gapped &rarr; Batched
            </div>
            <ConveyorAnimation />
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="font-mono text-[0.6rem] text-text-dim tracking-[0.08em] uppercase">Random Infeed</div>
                <div className="font-sans text-[0.78rem] text-text-body mt-0.5">Product arrives at random intervals from upstream equipment</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-[0.6rem] tracking-[0.08em] uppercase" style={{ color: accent }}>IntelliPak Gapping &amp; Batching</div>
                <div className="font-sans text-[0.78rem] text-text-body mt-0.5">Sensors read each product&apos;s position. Belts accelerate and decelerate independently to create precise gaps and form exact groups.</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-[0.6rem] text-text-dim tracking-[0.08em] uppercase">Grouped Output</div>
                <div className="font-sans text-[0.78rem] text-text-body mt-0.5">Uniform batches delivered at the cadence your packaging equipment needs</div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3: THE INFEED BOTTLENECK
          ══════════════════════════════════════════ */}
      <section
        className="py-[100px] px-6 border-t border-border-default"
        style={{ background: "rgba(17,34,64,0.35)" }}
      >
        <div className="max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="font-mono text-[0.68rem] tracking-[0.2em] uppercase mb-4" style={{ color: accent }}>
              The Infeed Bottleneck
            </div>
            <h2 className="font-sans font-extrabold text-[clamp(26px,4vw,44px)] leading-[1.15] text-white max-w-[700px] mb-7">
              Your Packaging Equipment Is Only as Good as{" "}
              <span style={{ color: accent }}>What Feeds It</span>
            </h2>
            <p className="font-sans text-[16px] leading-[1.75] text-text-body max-w-[700px] mb-10">
              Thermoformers, case packers, and flow wrappers are precision
              machines &mdash; but they can&apos;t fix what arrives wrong. When product
              shows up at random intervals with inconsistent spacing, you get
              misfeeds, incomplete batches, line stops, and throughput you can
              never fully recover.
            </p>
            <p className="font-sans text-[15px] text-text-body leading-[1.75] max-w-[700px] mb-10">
              Most plants compensate with manual labor or oversized buffers.
              IntelliPak solves it at the source.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  title: "Inconsistent Gaps \u2192 Missed Inspections",
                  body: "Without controlled spacing, your vision system can\u2019t reliably see each product. Defects slip through, or good product gets false-rejected because two items overlap in the inspection zone.",
                  color: "#ff6666",
                },
                {
                  title: "Random Arrival \u2192 Incomplete Batches",
                  body: "If your case packer needs groups of 4 but product arrives unpredictably, you get short-packed cases, line stops for manual correction, and downstream rework that compounds all shift long.",
                  color: accent,
                },
                {
                  title: "Speed Mismatch \u2192 Wasted Capacity",
                  body: "Your downstream equipment can handle 400 PPM, but your infeed delivers 280 at best. That gap is unrealized throughput \u2014 and it costs you every hour of every shift.",
                  color: accent,
                },
                {
                  title: "Manual Intervention \u2192 Labor Cost",
                  body: "When operators are hand-sorting, re-staging, or manually timing product into equipment, you\u2019re paying skilled labor to do what a conveyor system should handle automatically.",
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
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4: WHAT INTELLIPAK DOES
          ══════════════════════════════════════════ */}
      <section className="py-[100px] px-6 border-t border-border-default">
        <div className="max-w-[1100px] mx-auto">
          <AnimatedSection>
            <div className="font-mono text-[0.68rem] tracking-[0.2em] uppercase mb-4" style={{ color: accent }}>
              What IntelliPak Does
            </div>
            <h2 className="font-sans font-extrabold text-[clamp(26px,4vw,44px)] leading-[1.15] text-white mb-5">
              Precision Gapping. Intelligent Batching.{" "}
              <span style={{ color: accent }}>Seamless Integration.</span>
            </h2>
            <p className="font-sans text-[16px] text-text-body leading-[1.75] max-w-[720px] mb-12">
              IntelliPak uses independently controlled belt zones with photo-eye
              sensors to read each product&apos;s actual position &mdash; not assumed
              timing &mdash; and dynamically adjusts belt speed per product. The
              result is exact spacing for QC and exact grouping for packaging.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Gapping for Inspection",
                body: "Creates consistent, repeatable gaps between products so your VeriPak vision system (or any QC device) gets a clean look at every single item. Typically runs 2 belts to establish the gap window.",
                icon: "\u2316",
              },
              {
                title: "Batching for Packaging",
                body: "Groups verified product into exact counts \u2014 3s, 4s, 6s, 12s, whatever your packaging format requires. Batch sizes are adjustable on the fly from the HMI. Can run up to 7 belt zones for complex batching patterns.",
                icon: "\u25A6",
              },
              {
                title: "Timing & Metering",
                body: "Synchronizes product delivery to your downstream machine\u2019s cycle \u2014 matching the thermoformer\u2019s index, the case packer\u2019s cadence, or the flow wrapper\u2019s pitch. Product arrives when the machine is ready for it.",
                icon: "\u23F1",
              },
              {
                title: "Merge & Divert",
                body: "Multi-lane to single-lane merging, or single-lane to multi-lane diversion. Mag-Drive precision ensures consistent product spacing through every transition \u2014 no contact pressure, no product damage.",
                icon: "\u21C4",
              },
            ].map((fn) => (
              <StaggerItem key={fn.title}>
                <div className="bg-bg-card border border-border-default rounded-xl p-7 h-full group hover:bg-bg-card-hover hover:-translate-y-1 transition-all duration-300">
                  <div className="text-[1.5rem] mb-3">{fn.icon}</div>
                  <h3 className="font-sans text-[1.05rem] font-bold text-white mb-2 group-hover:text-[#f5a623] transition-colors">
                    {fn.title}
                  </h3>
                  <p className="font-sans text-[0.88rem] text-text-body leading-[1.65]">
                    {fn.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
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
          SECTION 5: MAG-DRIVE TECHNOLOGY
          ══════════════════════════════════════════ */}
      <section className="py-[100px] px-6 border-t border-border-default">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection>
            <div className="font-mono text-[0.68rem] tracking-[0.2em] uppercase mb-4" style={{ color: accent }}>
              The Technology Behind It
            </div>
            <h2 className="font-sans font-extrabold text-[clamp(26px,4vw,44px)] leading-[1.15] text-white mb-5">
              Mag-Drive Precision &mdash;{" "}
              <span style={{ color: accent }}>No Gears, No Drift, No Limits</span>
            </h2>
            <p className="font-sans text-[16px] text-text-body leading-[1.75] max-w-[720px] mb-10">
              IntelliPak is powered by magnetic direct-drive hub motors &mdash; a
              permanent-magnet synchronous design built directly into each
              conveyor roller. There&apos;s no mechanical coupling between the motor
              and the belt &mdash; the magnetic field drives the roller directly.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-14">
            {/* Text column */}
            <AnimatedSection delay={0.1}>
              <h3 className="font-sans text-[1.2rem] font-bold text-white mb-5">This matters for product handling because:</h3>
              <div className="flex flex-col gap-4">
                {[
                  ["Zero backlash", "Magnetic coupling maintains exact position without the mechanical slop that degrades in gearbox-driven conveyors over time. Your gaps stay precise on day 1,000 just like day 1."],
                  ["Zero encoder cables", "Open-loop synchronous operation eliminates the most common failure point on conventional servo-driven infeed systems. No cables to break, no position loss, no unplanned stops."],
                  ["Zero oil contamination risk", "No lubricant exists in the system. Period. For food, dairy, and pharma environments, this eliminates an entire category of sanitation risk."],
                  ["Hub-mounted design", "The motor sits inside the roller, reducing the conveyor footprint and simplifying maintenance. No external drivetrain to clean around."],
                ].map(([label, desc], i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full mt-2.5 shrink-0" style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accent}66` }} />
                    <div>
                      <span className="font-sans text-[0.92rem] font-semibold text-white">{label}</span>
                      <p className="font-sans text-[0.85rem] text-text-body leading-[1.65] mt-0.5">{desc}</p>
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
                    ["Product spacing accuracy", "Degrades over time (backlash)", "Constant \u2014 permanent magnet sync"],
                    ["Batch integrity after reject", "Manual re-staging required", "Automatic \u2014 only verified product batches"],
                    ["Speed", "200\u2013350 PPM typical", "Up to 500 PPM"],
                    ["Changeover (batch size)", "Mechanical adjustment", "On-the-fly from HMI"],
                    ["Encoder cable failures", "Common failure mode", "No encoder cables"],
                    ["Oil contamination risk", "Ongoing", "Eliminated"],
                    ["Energy consumption", "Baseline", "55% reduction"],
                    ["Sanitation time", "Full teardown required", "50% faster \u2014 no housings to clean"],
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
          SECTION 6: CONFIGURATIONS
          ══════════════════════════════════════════ */}
      <section
        className="py-[100px] px-6 border-t border-border-default"
        style={{ background: "rgba(17,34,64,0.35)" }}
      >
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
                desc: "Precision product gapping and metering for downstream packaging equipment. 2-belt Mag-Drive configuration creating exact inspection windows at up to 500 PPM.",
              },
              {
                title: "Batching & Collation System",
                desc: "Multi-belt configuration (up to 7 zones) that groups verified product into exact counts for case packers, thermoformers, or hand-pack stations. Batch sizes adjustable on the fly.",
              },
              {
                title: "Accumulation System",
                desc: "Buffer zones that absorb upstream/downstream speed differentials without stopping the line. Zero-pressure accumulation prevents product damage.",
              },
              {
                title: "Complete Line Architecture",
                desc: "Full infeed design from depalletizer to palletizer. IntelliPak feed systems integrated with AQS Custom Conveyors and VeriPak SCADA for end-to-end control and traceability.",
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
          SECTION 7: TECHNICAL SPECS
          ══════════════════════════════════════════ */}
      <section className="py-[100px] px-6 border-t border-border-default">
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
      <section
        className="py-[100px] px-6 border-t border-border-default"
        style={{ background: "rgba(17,34,64,0.35)" }}
      >
        <div className="max-w-[700px] mx-auto text-center">
          <AnimatedSection>
            <h2 className="font-sans font-extrabold text-[clamp(26px,4vw,40px)] leading-[1.15] text-white mb-5">
              See What IntelliPak Can Do for Your Line
            </h2>
            <p className="font-sans text-[16px] text-text-body leading-[1.7] mb-8">
              Start with a project review. We&apos;ll evaluate your current infeed,
              identify where you&apos;re losing throughput and batch integrity, and
              spec an IntelliPak system for your specific application.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/contact"
                className="font-sans font-bold text-[15px] px-8 py-3.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, ${accent}, #e09000)`, color: "#0B1A2E", boxShadow: `0 4px 20px ${accent}44` }}
              >
                Start a Project Review &rarr;
              </Link>
              <a
                href="https://apps.automatedqs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans font-semibold text-[15px] px-8 py-3.5 rounded-lg border border-white/20 text-text-body hover:text-white transition-all duration-200"
                style={{ borderColor: `${accent}33` }}
              >
                Run the ROI Calculator &rarr;
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
