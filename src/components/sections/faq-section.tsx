"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionLabel, SectionTitle } from "@/components/ui/section-header";

const faqs = [
  {
    q: "What is VeriPak?",
    a: "VeriPak is AQS's standalone SCADA platform purpose-built for packaging quality control. It delivers real-time dashboards, instant operator alerts, and automated line intervention — not just after-the-fact data logging. Every connected device feeds a live control view with sub-second feedback, auto-reject triggers, and audit-ready records. No middleware or third-party software required.",
  },
  {
    q: "What is the EvacuPak Liquid Recovery System?",
    a: "EvacuPak is AQS's patented fluid recovery system. Hygienic lances pierce packaging and extract product directly into 3A process piping — never exposed to atmosphere. Achieves up to 97% recovery with full HACCP traceability and CIP capability.",
  },
  {
    q: "Are AQS systems rated for washdown?",
    a: "Yes. All systems use NEMA 4X stainless-steel enclosures, IP69K-rated components, 304L/316L stainless steel, and sanitary hardware for USDA and FDA regulated facilities.",
  },
  {
    q: "Can VeriPak integrate with existing equipment?",
    a: "Yes. VeriPak's SCADA platform supports Ethernet/IP, Modbus-TCP, and digital I/O. It connects checkweighers, metal detectors, X-ray systems, code date printers, OneMotion motors, and other devices into one real-time control view — with live dashboards and instant alerts, not batch reports.",
  },
  {
    q: "Does AQS offer sanitary robotic systems?",
    a: "Yes. AQS designs fully washdown-rated robotic systems for palletizing, case packing, pick-and-place, depalletizing, and custom automation. All systems use 316L stainless steel, IP69K-rated enclosures, and Rockwell/Allen-Bradley programming for USDA/FDA environments with KUKA and Fanuc platforms.",
  },
  {
    q: "What conveyor types does AQS build?",
    a: "Custom sanitary conveyors including freezer-rated systems, accumulation conveyors, modular belt, flat-top chain, and roller configurations — all designed for washdown with quick-disconnect features.",
  },
  {
    q: "Why doesn't vision-based leak detection work?",
    a: "Camera systems inspect what a package looks like, not whether it's sealed. Pinholes, grease in seal zones, and internal board cuts are physically invisible to optical inspection at line speed. AQS is developing a mechanical dual-pull suction system that measures force and deflection delta — detecting actual atmosphere ingress through any breach regardless of visual appearance.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border-default">
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-transparent border-none py-5 flex justify-between items-center gap-4 text-left"
        data-cursor-hover
      >
        <span
          className="font-sans text-[0.98rem] font-semibold transition-colors duration-300"
          style={{ color: open ? "#00c2ff" : "#ffffff" }}
        >
          {question}
        </span>
        <motion.span
          className="text-[1.1rem] text-accent-primary shrink-0"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="font-sans text-[0.9rem] text-text-body leading-[1.7] pb-5">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection({
  items,
}: {
  items?: { q: string; a: string }[];
} = {}) {
  const data = items ?? faqs;
  return (
    <section className="py-[70px] px-8 bg-black/[0.06]">
      <div className="max-w-[780px] mx-auto">
        <AnimatedSection>
          <div className="text-center mb-9">
            <SectionLabel>Frequently Asked</SectionLabel>
            <SectionTitle className="text-center text-[clamp(1.8rem,3vw,2.3rem)]">
              Common Questions
            </SectionTitle>
          </div>
        </AnimatedSection>
        {data.map((item, i) => (
          <AnimatedSection key={i} delay={i * 0.03}>
            <FAQItem question={item.q} answer={item.a} />
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
