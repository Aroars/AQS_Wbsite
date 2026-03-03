"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { partners } from "@/content/solutions";

export function PartnersBar() {
  return (
    <section className="py-8 px-8 border-t border-b border-border-default overflow-hidden">
      <div className="max-w-[1280px] mx-auto flex items-center justify-center gap-10 flex-wrap">
        <span className="font-mono text-[0.58rem] text-text-dim tracking-[0.14em] uppercase">
          Trusted Partners
        </span>
        {partners.map((p, i) => (
          <motion.div
            key={p.name}
            className="relative h-[28px] shrink-0"
            style={{ width: Math.round((p.width / p.height) * 28) }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
          >
            <Image
              src={p.logo!}
              alt={p.name}
              fill
              className="object-contain brightness-0 invert opacity-20 hover:opacity-50 transition-opacity duration-300"
              sizes="120px"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
