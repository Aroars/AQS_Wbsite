"use client";

import { useState } from "react";
import Link from "next/link";

interface SolutionCardProps {
  icon: string;
  title: string;
  subtitle: string;
  features: string[];
  accent: string;
  href: string;
}

/* Matches the homepage platform cards (solutions-overview.tsx): card surface,
   a 4px top edge in the product colour, and every piece of text on the
   semantic tokens. The product colour is a fill, an edge and a glow only. */
export function SolutionCard({
  icon,
  title,
  subtitle,
  features,
  accent,
  href,
}: SolutionCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="block h-full"
      data-cursor-hover
    >
      <div
        className="relative overflow-hidden flex flex-col h-full transition-all duration-400 bg-surface-card hover:bg-surface-card-hover"
        style={{
          border: `1px solid ${hovered ? accent + "80" : "var(--border)"}`,
          borderTop: `4px solid ${accent}`,
          borderRadius: 14,
          padding: "32px 26px",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hovered
            ? `0 20px 40px rgba(10,22,40,0.14), 0 0 30px ${accent}15`
            : "0 4px 12px rgba(10,22,40,0.06)",
        }}
      >
        {/* Hover glow effect */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none"
          style={{
            opacity: hovered ? 0.08 : 0,
            background: `radial-gradient(circle at 50% 0%, ${accent}, transparent 70%)`,
          }}
        />

        <div className="text-[2rem] mb-3 relative z-10 text-accent-text">{icon}</div>
        <div className="font-sans text-[1.2rem] font-bold text-text-strong mb-1 relative z-10">
          {title}
        </div>
        <div className="font-mono text-[0.6rem] tracking-[0.1em] uppercase mb-3.5 relative z-10 text-accent-text">
          {subtitle}
        </div>
        <div className="flex-1 relative z-10">
          {features.map((f, i) => (
            <div
              key={i}
              className="font-sans text-[0.84rem] text-text-body leading-[1.7] pl-3.5 relative mb-0.5"
            >
              <span className="absolute left-0 text-[0.6rem] top-[5px] text-accent-text">
                ▸
              </span>
              {f}
            </div>
          ))}
        </div>
        <div className="font-sans text-[0.78rem] font-semibold mt-3.5 relative z-10 text-accent-text">
          Learn more →
        </div>
      </div>
    </Link>
  );
}
