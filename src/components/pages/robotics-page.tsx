"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { GlowOrb } from "@/components/ui/glow-orb";
import { roboticsApplications } from "@/data/case-studies";

const capabilities = [
  { t: "Robotic Palletizing", d: "High-speed, full-layer palletizing in USDA/FDA washdown zones with KUKA and Fanuc platforms." },
  { t: "Case Packing & Pick-and-Place", d: "Precision robotic handling for RSC, display-ready, and specialty packaging formats at production speed." },
  { t: "End-of-Line Integration", d: "Complete line ownership from infeed conveyance through robotic cell to stretch wrapper and outfeed." },
  { t: "Sanitary Cell Design", d: "Full 316L stainless steel frames, IP69K-rated enclosures, sanitary guarding, and washdown-ready cable management." },
  { t: "Rockwell-Native Controls", d: "Allen-Bradley programming standards common to food and protein facilities — no proprietary black boxes." },
];

const specCards = [
  { v: "316L", l: "Stainless Steel" },
  { v: "IP69K", l: "Protection" },
  { v: "USDA", l: "Compliant" },
  { v: "24/7", l: "Remote Support" },
];

function AppCard({ title, description }: { title: string; description: string }) {
  const [hovered, setHovered] = useState(false);
  const accent = "#4d9fff";
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-xl p-[22px] h-full transition-all duration-300"
      style={{
        background: hovered ? `${accent}0C` : "rgba(17,34,64,0.5)",
        border: `1px solid ${hovered ? accent : "rgba(255,255,255,0.06)"}`,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      <div className="font-sans text-[0.95rem] font-semibold text-white mb-1">
        {title}
      </div>
      <div className="font-sans text-[0.8rem] text-text-body leading-[1.5]">
        {description}
      </div>
    </div>
  );
}

export function RoboticsContent() {
  const accent = "#4d9fff";
  return (
    <section className="pt-[140px] pb-[100px] px-8 relative">
      <GlowOrb top="-100px" left="-5%" size={500} color="77,159,255" />
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
              Sanitary Robotics
            </span>
          </div>

          <h1 className="font-sans font-extrabold text-[clamp(32px,5vw,56px)] leading-[1.1] text-white max-w-[720px] mb-6">
            Washdown Robotic Systems{" "}
            <span style={{ color: accent }}>Built for Food Production</span>
          </h1>

          <p className="font-sans text-[clamp(16px,2vw,20px)] text-text-body leading-[1.65] mb-8 max-w-[620px]">
            AQS designs, integrates, and supports fully sanitary robotic systems
            for palletizing, case packing, pick-and-place, and end-of-line
            automation &mdash; engineered from the ground up for USDA and FDA washdown
            environments with single-point accountability from concept through
            commissioning.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="#showcases"
              className="inline-flex items-center gap-1.5 font-sans text-[15px] font-bold text-white px-8 py-3.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: `linear-gradient(135deg, ${accent}, #2266cc)`, boxShadow: `0 4px 20px ${accent}44` }}
            >
              See It In Action &rarr;
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-1.5 font-sans text-[15px] font-semibold text-text-body px-8 py-3.5 rounded-lg border border-white/20 hover:border-[#4d9fff] hover:text-white transition-all duration-200"
            >
              Request a Quote
            </a>
          </div>
        </AnimatedSection>

        {/* Video showcases */}
        <AnimatedSection delay={0.08}>
          <div id="showcases" className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-[50px]">
            <div>
              <div className="font-mono text-[0.58rem] text-[#4d9fff] tracking-[0.1em] uppercase mb-2">
                Palletizing Showcase
              </div>
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-border-default">
                <video
                  controls
                  preload="metadata"
                  poster="/images/robotics/palletizing-poster.jpg"
                  className="w-full h-full object-cover"
                >
                  <source src="/video/palletizing-showcase.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
            <div>
              <div className="font-mono text-[0.58rem] text-[#4d9fff] tracking-[0.1em] uppercase mb-2">
                Robotic Picking Showcase
              </div>
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-border-default">
                <video
                  controls
                  preload="metadata"
                  poster="/images/robotics/picking-poster.jpg"
                  className="w-full h-full object-cover"
                >
                  <source src="/video/robotic-picking-showcase.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-11">
          {/* Capabilities list */}
          <AnimatedSection delay={0.1}>
            <div className="flex flex-col gap-[18px]">
              {capabilities.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-[7px] h-[7px] rounded-full bg-[#4d9fff] mt-2 shrink-0 shadow-[0_0_8px_rgba(77,159,255,0.4)]" />
                  <div>
                    <div className="font-sans text-[0.92rem] font-semibold text-white">
                      {item.t}
                    </div>
                    <div className="font-sans text-[0.84rem] text-text-body leading-[1.5]">
                      {item.d}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Spec card */}
          <AnimatedSection delay={0.2}>
            <div
              className="rounded-2xl p-9 text-center relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(0,194,255,0.05), rgba(0,102,255,0.03))",
                border: "1px solid rgba(0,194,255,0.1)",
              }}
            >
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 -mx-2">
                <Image
                  src="/images/robotics/palletizing-overhead.jpg"
                  alt="Overhead view of robotic palletizer stacking product onto pallet with roller conveyor infeed"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="font-sans text-[1.1rem] font-bold text-white mb-2">
                Full Washdown. Full Ownership.
              </div>
              <div className="font-sans text-[0.85rem] text-text-body leading-[1.7] max-w-[320px] mx-auto mb-[18px]">
                We architect, integrate, test, install, and support complete
                sanitary robotic systems.
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {specCards.map((s) => (
                  <div key={s.l} className="bg-black/30 rounded-lg py-3 px-2">
                    <div className="font-mono text-[1.1rem] font-bold text-accent-primary">
                      {s.v}
                    </div>
                    <div className="font-sans text-[0.6rem] text-text-dim mt-0.5 uppercase tracking-[0.08em]">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Photo gallery */}
        <AnimatedSection delay={0.22}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-[40px] mb-[30px]">
            {[
              { src: "/images/robotics/kuka-robot-cell.jpg", alt: "KUKA industrial robot with custom stainless steel end effector in safety cage" },
              { src: "/images/robotics/end-effector-closeup.jpg", alt: "Close-up of KUKA robot arm with custom-machined stainless steel end effector" },
              { src: "/images/robotics/end-effectors-assembly.jpg", alt: "Custom robotic end effectors on assembly table showing precision stainless steel components" },
              { src: "/images/robotics/case-packing-pies.jpg", alt: "Robotic case packing system handling pies with roller conveyor infeed" },
            ].map((img) => (
              <div key={img.src} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border-default group">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Applications Grid */}
        <AnimatedSection delay={0.25}>
          <div className="mt-[60px]">
            <div className="font-mono text-[0.62rem] text-[#4d9fff] tracking-[0.12em] uppercase mb-2.5">
              Applications
            </div>
            <h3 className="font-sans text-[1.3rem] font-bold text-white mb-5">
              Where Sanitary Robotics Replaces Manual Labor
            </h3>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {roboticsApplications.map((app, i) => (
                <StaggerItem key={i}>
                  <AppCard title={app.title} description={app.description} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
