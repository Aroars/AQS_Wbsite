"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  as?: "button" | "a";
  href?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
}

export function MagneticButton({
  children,
  className = "",
  as = "button",
  href,
  onClick,
  target,
  rel,
}: MagneticButtonProps) {
  const Component = as === "a" ? motion.a : motion.button;

  return (
    <Component
      href={href}
      onClick={onClick}
      target={target}
      rel={rel}
      className={className}
      data-cursor-hover
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children}
    </Component>
  );
}
