"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionLabel, SectionTitle, SectionDesc } from "@/components/ui/section-header";
import { CONVEYOR_ACCENT, categories } from "@/data/conveyors";
import { getTypePage } from "@/data/conveyor-type-pages";
import { conveyingItems } from "@/data/conveying";

const accent = CONVEYOR_ACCENT;

/**
 * Hover (or tap, on touch) a product and the conveyor types that carry it
 * appear beside the list. No clicking through a form — the product boxes
 * react on hover and the picks are the links.
 */
export function WhatAreYouConveying() {
  const [activeId, setActiveId] = useState(conveyingItems[0].id);
  const active = conveyingItems.find((i) => i.id === activeId) ?? conveyingItems[0];

  return (
    <section className="py-[64px] px-8">
      <div className="max-w-[1280px] mx-auto">
        <AnimatedSection>
          <SectionLabel>Find Your Conveyor</SectionLabel>
          <SectionTitle>What are you conveying?</SectionTitle>
          <SectionDesc>
            Hover over the product and the conveyor types that carry it appear alongside — each one
            opens its page.
          </SectionDesc>
        </AnimatedSection>
        <AnimatedSection delay={0.05}>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)] gap-6 items-start">
            {/* Product boxes — hover to select */}
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 list-none p-0 m-0" onMouseLeave={() => undefined}>
              {conveyingItems.map((item) => {
                const on = item.id === activeId;
                return (
                  <li key={item.id}>
                    <div
                      role="button"
                      tabIndex={0}
                      aria-pressed={on}
                      onMouseEnter={() => setActiveId(item.id)}
                      onFocus={() => setActiveId(item.id)}
                      onClick={() => setActiveId(item.id)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveId(item.id); } }}
                      className="rounded-xl px-5 py-4 cursor-default transition-all duration-200 select-none"
                      style={{
                        background: on ? `${accent}22` : "rgba(17,34,64,0.5)",
                        border: `1px solid ${on ? accent : "rgba(255,255,255,0.08)"}`,
                        transform: on ? "translateY(-2px)" : "translateY(0)",
                        boxShadow: on ? `0 8px 24px ${accent}22` : "none",
                      }}
                    >
                      <div className="font-sans text-[1.05rem] font-bold" style={{ color: on ? "#fff" : "rgba(255,255,255,0.85)" }}>
                        {item.label}
                      </div>
                      <div className="font-sans text-[0.74rem] text-text-dim mt-0.5">{item.hint}</div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Picks for the hovered product */}
            <div className="rounded-xl p-6 bg-[rgba(17,34,64,0.5)] border border-white/[0.08] lg:sticky lg:top-[110px]" aria-live="polite">
              <div className="font-mono text-[0.58rem] tracking-[0.12em] uppercase mb-1" style={{ color: accent }}>
                Conveyors for
              </div>
              <div className="font-sans text-[1.3rem] font-bold text-white mb-4">{active.label}</div>
              <ul className="space-y-2 list-none p-0 m-0">
                {active.picks.map((p) => {
                  const family = categories.find((c) => c.slug === p.family)!;
                  const type = family.types.find((t) => t.slug === p.typeSlug)!;
                  const href = getTypePage(p.family, p.typeSlug)?.href ?? `/solutions/conveyors/${p.family}#${p.typeSlug}`;
                  return (
                    <li key={`${p.family}-${p.typeSlug}`}>
                      <Link href={href} className="block rounded-lg px-4 py-3 no-underline border border-white/[0.08] bg-black/20 hover:border-[#94A3B8]/70 hover:bg-black/30 transition-colors group">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="font-mono text-[0.56rem] tracking-[0.1em] uppercase" style={{ color: accent }}>
                            {family.shortTitle}
                          </span>
                          <span className="font-sans text-[0.95rem] font-semibold text-white group-hover:text-[#cbd5e1] transition-colors">
                            {type.title}
                          </span>
                          <span className="ml-auto font-mono text-[0.62rem]" style={{ color: accent }}>&rarr;</span>
                        </div>
                        <div className="font-sans text-[0.8rem] text-text-body mt-1">{p.why}</div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
