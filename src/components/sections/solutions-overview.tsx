"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionLabel, SectionTitle, SectionDesc } from "@/components/ui/section-header";
import { solutions } from "@/content/solutions";

/* Product card top edge per product (plan section 5d). The product accent
   colours fill edges and glows only; all text uses the semantic tokens. */
const topEdge: Record<string, string> = {
  veripak: "#00C2FF",
  intellipak: "#F5A623",
  conveyors: "#94A3B8",
  robotics: "#00C2FF",
  evacupak: "#00D4AA",
};

export function SolutionsOverview() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-[110px] px-8 relative">
      <div className="max-w-[1280px] mx-auto relative z-10">
        <AnimatedSection>
          <SectionLabel>Our Platform</SectionLabel>
          <SectionTitle>
            Integrated Solutions for Every Packaging Line
          </SectionTitle>
          <SectionDesc>
            From quality control and liquid recovery to robotic palletizing and
            sanitary conveyance — AQS provides modular building blocks to
            transform your production.
          </SectionDesc>
        </AnimatedSection>

        {/* Overlapping deck — desktop only */}
        <AnimatedSection delay={0.15}>
          <div
            className="hidden lg:flex justify-center items-stretch"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {solutions.map((s, i) => {
              const isHovered = hoveredIndex === i;
              const isAnyHovered = hoveredIndex !== null;
              const edge = topEdge[s.slug] ?? s.accent;

              // Spread neighbors when one is hovered
              let spreadX = 0;
              if (isAnyHovered && hoveredIndex !== null && !isHovered) {
                const distance = i - hoveredIndex;
                if (distance < 0) spreadX = -24;
                if (distance > 0) spreadX = 24;
              }

              return (
                <motion.div
                  key={s.slug}
                  className="relative"
                  style={{
                    marginLeft: i === 0 ? 0 : -36,
                    zIndex: isHovered ? 50 : i + 1,
                    width: 220,
                    flexShrink: 0,
                  }}
                  animate={{
                    y: isHovered ? -16 : 0,
                    x: spreadX,
                    scale: isHovered ? 1.04 : isAnyHovered ? 0.98 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                >
                  <Link href={s.route} className="block h-full">
                    <div
                      className="relative overflow-hidden flex flex-col h-full transition-colors duration-300 bg-surface-card hover:bg-surface-card-hover"
                      style={{
                        border: `1px solid ${isHovered ? edge + "80" : "var(--border)"}`,
                        borderTop: `4px solid ${edge}`,
                        borderRadius: 14,
                        padding: "28px 22px",
                        minHeight: 340,
                        boxShadow: isHovered
                          ? `0 20px 40px rgba(10,22,40,0.14), 0 0 30px ${edge}15`
                          : "0 4px 12px rgba(10,22,40,0.06)",
                      }}
                    >
                      {/* Hover glow */}
                      <div
                        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                        style={{
                          opacity: isHovered ? 0.1 : 0,
                          background: `radial-gradient(circle at 50% 0%, ${edge}, transparent 70%)`,
                        }}
                      />

                      <div className="text-[1.8rem] mb-2.5 relative z-10 text-accent-text">
                        {s.icon}
                      </div>
                      <div className="font-sans text-[1.05rem] font-bold text-text-strong mb-1 relative z-10">
                        {s.title}
                      </div>
                      <div className="font-mono text-[0.55rem] tracking-[0.1em] uppercase mb-3 relative z-10 text-accent-text">
                        {s.subtitle}
                      </div>
                      <div className="flex-1 relative z-10">
                        {s.shortFeatures.slice(0, 4).map((f, fi) => (
                          <div
                            key={fi}
                            className="font-sans text-[0.78rem] text-text-body leading-[1.6] pl-3 relative mb-0.5"
                          >
                            <span className="absolute left-0 text-[0.55rem] top-[4px] text-accent-text">
                              ▸
                            </span>
                            {f}
                          </div>
                        ))}
                      </div>
                      <div className="font-sans text-[0.75rem] font-semibold mt-3 relative z-10 text-accent-text">
                        Learn more →
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </AnimatedSection>

        {/* Mobile/tablet fallback — standard grid */}
        <AnimatedSection delay={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden" aria-hidden="true">
            {solutions.map((s) => {
              const edge = topEdge[s.slug] ?? s.accent;
              return (
                <Link key={s.slug} href={s.route} className="block">
                  <div
                    className="relative overflow-hidden flex flex-col h-full bg-surface-card border border-border"
                    style={{
                      borderTop: `4px solid ${edge}`,
                      borderRadius: 14,
                      padding: "28px 22px",
                    }}
                  >
                    <div className="text-[1.8rem] mb-2.5 text-accent-text">{s.icon}</div>
                    <div className="font-sans text-[1.05rem] font-bold text-text-strong mb-1">
                      {s.title}
                    </div>
                    <div className="font-mono text-[0.55rem] tracking-[0.1em] uppercase mb-3 text-accent-text">
                      {s.subtitle}
                    </div>
                    <div className="flex-1">
                      {s.shortFeatures.slice(0, 3).map((f, fi) => (
                        <div
                          key={fi}
                          className="font-sans text-[0.8rem] text-text-body leading-[1.6] pl-3 relative mb-0.5"
                        >
                          <span className="absolute left-0 text-[0.55rem] top-[4px] text-accent-text">
                            ▸
                          </span>
                          {f}
                        </div>
                      ))}
                    </div>
                    <div className="font-sans text-[0.75rem] font-semibold mt-3 text-accent-text">
                      Learn more →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
