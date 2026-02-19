"use client";

import { motion } from "framer-motion";

interface GlowOrbProps {
  top?: string;
  left?: string;
  size?: number;
  color?: string;
}

export function GlowOrb({
  top = "0",
  left = "0",
  size = 400,
  color = "0,194,255",
}: GlowOrbProps) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        top,
        left,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(${color},0.08) 0%, transparent 70%)`,
        filter: "blur(40px)",
      }}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.8, 1, 0.8],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
