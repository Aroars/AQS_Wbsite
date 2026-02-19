"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface SolutionCardProps {
  icon: string;
  title: string;
  subtitle: string;
  features: string[];
  accent: string;
  href: string;
}

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
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      <Link
        href={href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="block h-full"
        data-cursor-hover
      >
        <div
          className="relative overflow-hidden flex flex-col h-full transition-all duration-400"
          style={{
            background: hovered
              ? "rgba(0,0,0,0.42)"
              : "rgba(0,0,0,0.28)",
            border: `1px solid ${hovered ? accent + "40" : "rgba(0,0,0,0.25)"}`,
            borderRadius: 14,
            padding: "32px 26px",
            transform: hovered ? "translateY(-4px)" : "translateY(0)",
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

          <div className="text-[2rem] mb-3 relative z-10">{icon}</div>
          <div className="font-sans text-[1.2rem] font-bold text-white mb-1 relative z-10">
            {title}
          </div>
          <div
            className="font-mono text-[0.6rem] tracking-[0.1em] uppercase mb-3.5 relative z-10"
            style={{ color: accent }}
          >
            {subtitle}
          </div>
          <div className="flex-1 relative z-10">
            {features.map((f, i) => (
              <div
                key={i}
                className="font-sans text-[0.84rem] text-text-body leading-[1.7] pl-3.5 relative mb-0.5"
              >
                <span
                  className="absolute left-0 text-[0.6rem] top-[5px]"
                  style={{ color: accent }}
                >
                  ▸
                </span>
                {f}
              </div>
            ))}
          </div>
          <div
            className="font-sans text-[0.78rem] font-semibold mt-3.5 relative z-10"
            style={{ color: accent }}
          >
            Learn more →
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
