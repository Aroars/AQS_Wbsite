"use client";

import Image from "next/image";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SplitText } from "@/components/ui/split-text";
import { StatCounter } from "@/components/ui/stat-counter";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { GlowOrb } from "@/components/ui/glow-orb";
import { heroStats } from "@/content/solutions";

/* The hero is a dark band in both themes: brand tokens only, never the
   semantic surfaces (plan section 3). The stats row sits inside the band
   so the dark area ends on a clean edge. */
export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-[120px] pb-16 px-8 overflow-hidden bg-brand-navy-band">
      {/* Background elements */}
      <GlowOrb top="-200px" left="-100px" size={600} />
      <GlowOrb top="200px" left="60%" size={500} color="0,102,255" />

      {/* Hero background image + video */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/hero-poster.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          quality={80}
          sizes="100vw"
        />
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video/hero-loop.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy-band/80 via-brand-navy-band/60 to-brand-navy-band/90" />
      </div>

      <div className="max-w-[1280px] mx-auto w-full relative z-10">
        {/* Headline with split text animation */}
        <AnimatedSection delay={0.1}>
          <h1 className="font-sans text-[clamp(2.2rem,5vw,4.2rem)] font-extrabold leading-[1.08] text-white max-w-[860px] mb-5">
            <SplitText text="Your Equipment Catches" delay={0.2} />
            <br />
            <SplitText text="Bad Product." delay={0.35} />{" "}
            <span className="text-brand-cyan">
              <SplitText text="Can It Prove" delay={0.5} />
            </span>
            <br />
            <span className="text-brand-cyan">
              <SplitText text="a Good One?" delay={0.65} />
            </span>
          </h1>
        </AnimatedSection>

        {/* Subtitle */}
        <AnimatedSection delay={0.2}>
          <p className="font-sans text-[1.12rem] text-[#CBD5E1] leading-[1.7] max-w-[620px] mb-9">
            AQS builds quality control systems that don&apos;t just inspect — they
            record, trace, and prove. Every package. Every station. Every time.
          </p>
        </AnimatedSection>

        {/* CTAs */}
        <AnimatedSection delay={0.3}>
          <div className="flex gap-3.5 flex-wrap">
            <MagneticButton
              as="a"
              href="/solutions"
              className="font-sans text-[0.92rem] font-bold text-brand-navy-deep bg-brand-cyan px-8 py-3.5 rounded-lg no-underline shadow-[0_0_28px_rgba(0,194,255,0.25)] inline-block"
            >
              See Our Solutions →
            </MagneticButton>
            <MagneticButton
              as="a"
              href="/contact"
              className="font-sans text-[0.92rem] font-semibold text-brand-cyan bg-transparent border border-brand-cyan/40 px-8 py-3.5 rounded-lg no-underline inline-block hover:border-brand-cyan/70 transition-colors"
            >
              Request a Quote
            </MagneticButton>
          </div>
        </AnimatedSection>

        {/* Stat counters */}
        <AnimatedSection delay={0.5}>
          <div className="mt-[72px] grid grid-cols-2 sm:grid-cols-4 gap-7 pt-9 border-t border-white/10">
            {heroStats.map((stat) => (
              <StatCounter
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                labelClassName="text-brand-steel"
              />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
