"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorGlow() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isTouch = useRef(false);

  const springX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 150 });

  useEffect(() => {
    isTouch.current = window.matchMedia("(pointer: coarse)").matches;

    if (isTouch.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Don't render on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[2]"
      style={{
        background: "radial-gradient(600px circle at var(--glow-x) var(--glow-y), rgba(0,194,255,0.06), transparent 40%)",
        // @ts-expect-error CSS custom property
        "--glow-x": springX.get() + "px",
        "--glow-y": springY.get() + "px",
      }}
    >
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(0,194,255,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
    </motion.div>
  );
}
