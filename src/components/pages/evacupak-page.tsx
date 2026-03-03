"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { SectionLabel, SectionTitle, SectionDesc } from "@/components/ui/section-header";
import { GlowOrb } from "@/components/ui/glow-orb";

const features = [
  {
    icon: "🔬",
    title: "3A Certified & CIP Capable",
    desc: "Hygienic lances integrate into rework or blend processes. Clean-in-place capability ensures rapid sanitation between runs.",
  },
  {
    icon: "📋",
    title: "Full HACCP Traceability",
    desc: "Product lot, case type, operator login tracked continuously. Optional vision sensors for barcode or lot number scanning.",
  },
  {
    icon: "🔒",
    title: "Never Exposed to Atmosphere",
    desc: "Lances pierce the carton and extract directly into 3A process piping. Product never contacts atmosphere — always in spec.",
  },
  {
    icon: "💰",
    title: "97% Product Recovery",
    desc: "Transform waste into profit. Keep products in process with complete data recording for quality standards compliance.",
  },
  {
    icon: "🏭",
    title: "Durable Hygienic Design",
    desc: "Full stainless steel for dairy, beverage, and liquid food processing environments. Built for years of reliable operation.",
  },
  {
    icon: "📊",
    title: "Integrated Data Recording",
    desc: "Every recovery operation logged with traceability data. Export reports for compliance, auditing, and operational analysis.",
  },
];

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  const [hovered, setHovered] = useState(false);
  const accent = "#00d4aa";
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-xl p-7 h-full transition-all duration-300"
      style={{
        background: hovered ? `${accent}0C` : "rgba(17,34,64,0.5)",
        border: `1px solid ${hovered ? accent : "rgba(255,255,255,0.06)"}`,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      <div
        className="text-[1.5rem] mb-2.5 transition-transform duration-300"
        style={{ transform: hovered ? "scale(1.1)" : "scale(1)" }}
      >
        {icon}
      </div>
      <div className="font-sans text-[1.02rem] font-bold text-white mb-1.5">
        {title}
      </div>
      <div className="font-sans text-[0.85rem] text-text-body leading-[1.6]">
        {desc}
      </div>
    </div>
  );
}

export function EvacuPakContent() {
  return (
    <section className="pt-[140px] pb-[100px] px-8 relative">
      <GlowOrb top="-100px" left="70%" size={500} color="0,212,170" />
      <div className="max-w-[1280px] mx-auto relative z-10">
        <AnimatedSection>
          <SectionLabel>EvacuPak Liquid Recovery</SectionLabel>
          <SectionTitle>
            Redefining Efficiency in Fluid Recovery
          </SectionTitle>
          <SectionDesc>
            Our patented design achieves up to 97% product recovery from
            packaging. Hygienic lances pierce cartons and extract product
            directly into 3A process piping — never exposed to atmosphere,
            never compromised. Re-process, don&apos;t re-work.
          </SectionDesc>
        </AnimatedSection>

        {/* Product imagery */}
        <AnimatedSection delay={0.05}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-[50px] items-center">
            <div className="relative aspect-[800/545] rounded-2xl overflow-hidden border border-border-default mx-auto max-w-[500px] w-full">
              <Image
                src="/images/evacupak/product-render.webp"
                alt="EvacuPak liquid recovery system — patented hygienic lance design for up to 97% product recovery"
                fill
                className="object-contain bg-white/5"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-border-default mx-auto max-w-[400px] w-full">
              <Image
                src="/images/evacupak/product-shot.jpg"
                alt="EvacuPak system physical unit with 3A certified stainless steel construction"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((item, i) => (
            <StaggerItem key={i}>
              <FeatureCard icon={item.icon} title={item.title} desc={item.desc} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
