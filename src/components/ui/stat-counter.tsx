"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

interface StatCounterProps {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
  /** Label colour; the hero band uses text-brand-steel */
  labelClassName?: string;
}

export function StatCounter({
  value,
  suffix = "",
  label,
  duration = 2,
  labelClassName = "text-text-dim",
}: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  // Start at the real value so crawlers and no-JS readers see it; the count-up runs once in view
  const [count, setCount] = useState(value);

  useEffect(() => {
    if (!isInView) return;

    const end = value;
    setCount(0);
    const increment = end / (duration * 60);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-mono text-5xl font-bold text-brand-cyan leading-none glow-text">
        <span>{count}{suffix}</span>
      </div>
      <div className={`font-sans text-[0.78rem] mt-2 uppercase tracking-[0.12em] ${labelClassName}`}>
        {label}
      </div>
    </div>
  );
}
