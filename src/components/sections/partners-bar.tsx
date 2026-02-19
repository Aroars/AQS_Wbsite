"use client";

import { motion } from "framer-motion";
import { partners } from "@/content/solutions";

export function PartnersBar() {
  return (
    <section className="py-8 px-8 border-t border-b border-border-default overflow-hidden">
      <div className="max-w-[1280px] mx-auto flex items-center justify-center gap-9 flex-wrap">
        <span className="font-mono text-[0.58rem] text-text-dim tracking-[0.14em] uppercase">
          Trusted Partners
        </span>
        {partners.map((p, i) => (
          <motion.span
            key={p}
            className="font-sans text-[0.8rem] font-semibold text-white/[0.16] whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            whileHover={{ color: "rgba(255,255,255,0.5)", scale: 1.05 }}
          >
            {/* TODO: Replace with partner logo images from /public/media/partners/ */}
            {p}
          </motion.span>
        ))}
      </div>
    </section>
  );
}
