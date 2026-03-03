"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SplitText } from "@/components/ui/split-text";
import { StatCounter } from "@/components/ui/stat-counter";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { GlowOrb } from "@/components/ui/glow-orb";
import { heroStats } from "@/content/solutions";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-[120px] pb-20 px-8 overflow-hidden">
      {/* Background elements */}
      <GlowOrb top="-200px" left="-100px" size={600} />
      <GlowOrb top="200px" left="60%" size={500} color="0,102,255" />

      {/* Hero background image + video */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/hero-packaging-line.jpg"
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1d2b]/80 via-[#1a1d2b]/60 to-[#1a1d2b]/90" />
      </div>

      <div className="max-w-[1280px] mx-auto w-full relative z-10">
        {/* Status badge */}
        <AnimatedSection>
          <motion.div
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-5"
            style={{
              background: "rgba(0,194,255,0.08)",
              border: "1px solid rgba(0,194,255,0.15)",
            }}
            whileHover={{ scale: 1.02 }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full bg-accent-primary"
              style={{
                boxShadow: "0 0 8px #00c2ff",
                animation: "pulse 2s infinite",
              }}
            />
            <span className="font-mono text-[0.62rem] text-accent-primary tracking-[0.1em] uppercase">
              Now Offering Sanitary Robotic Systems
            </span>
          </motion.div>
        </AnimatedSection>

        {/* Headline with split text animation */}
        <AnimatedSection delay={0.1}>
          <h1 className="font-sans text-[clamp(2.5rem,5.5vw,4.6rem)] font-extrabold leading-[1.05] text-white max-w-[800px] mb-5">
            <SplitText text="Precision Quality" delay={0.2} />
            <br />
            <SplitText text="Control for" delay={0.35} />{" "}
            <span className="gradient-text">
              <SplitText text="Modern Food" delay={0.5} />
            </span>
            <br />
            <SplitText text="Production" delay={0.65} />
          </h1>
        </AnimatedSection>

        {/* Subtitle */}
        <AnimatedSection delay={0.2}>
          <p className="font-sans text-[1.12rem] text-text-body leading-[1.7] max-w-[620px] mb-9">
            AQS engineers standalone SCADA platforms, liquid recovery systems,
            leak detection technology, sanitary conveyors, and washdown robotics
            that protect your brand, ensure compliance, and drive measurable ROI.
          </p>
        </AnimatedSection>

        {/* CTAs */}
        <AnimatedSection delay={0.3}>
          <div className="flex gap-3.5 flex-wrap">
            <MagneticButton
              as="a"
              href="/solutions"
              className="font-sans text-[0.92rem] font-bold text-bg-primary bg-gradient-to-br from-accent-primary to-[#0088ff] px-8 py-3.5 rounded-lg no-underline shadow-[0_0_28px_rgba(0,194,255,0.25)] inline-block"
            >
              Explore Solutions →
            </MagneticButton>
            <MagneticButton
              as="a"
              href="/contact"
              className="font-sans text-[0.92rem] font-semibold text-accent-primary bg-transparent border border-accent-primary/30 px-8 py-3.5 rounded-lg no-underline inline-block hover:border-accent-primary/60 transition-colors"
            >
              Request a Quote
            </MagneticButton>
          </div>
        </AnimatedSection>

        {/* Stat counters */}
        <AnimatedSection delay={0.5}>
          <div className="mt-[72px] grid grid-cols-2 sm:grid-cols-4 gap-7 pt-9 border-t border-border-default">
            {heroStats.map((stat) => (
              <StatCounter
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
