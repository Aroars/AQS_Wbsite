"use client";

import Link from "next/link";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/animated-section";
import {
  SectionLabel,
  SectionTitle,
} from "@/components/ui/section-header";
import { whyAQS } from "@/content/solutions";

export function WhyAQS() {
  return (
    <section className="py-[90px] px-8">
      <div className="max-w-[1280px] mx-auto">
        <AnimatedSection>
          <div className="text-center mb-[50px]">
            <SectionLabel>What Makes Us Different</SectionLabel>
            <SectionTitle className="text-center">
              We Don&apos;t Sell Inspection Equipment. We Sell Proof.
            </SectionTitle>
            <p className="font-sans text-[1.02rem] text-text-body max-w-[720px] mx-auto leading-[1.7] mb-0 text-center">
              Most packaging lines already have metal detectors, checkweighers,
              and vision systems. The equipment works. The problem is that each
              device runs independently — logging to its own screen, its own USB
              drive, its own binder. When it matters most, you can&apos;t tie the
              data to a specific package. AQS solves that.
            </p>
          </div>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {whyAQS.map((v) => (
            <StaggerItem key={v.title}>
              <div className="bg-bg-card border border-border-default rounded-xl p-7 h-full group hover:bg-bg-card-hover hover:-translate-y-1 transition-all duration-400 flex flex-col">
                <div className="text-[1.6rem] mb-3 text-accent-primary group-hover:scale-110 transition-transform duration-300">
                  {v.icon}
                </div>
                <div className="font-sans text-[1.05rem] font-bold text-white mb-1.5">
                  {v.title}
                </div>
                <div className="font-sans text-[0.85rem] text-text-body leading-[1.6] mb-4 flex-1">
                  {v.desc}
                </div>
                {v.link && (
                  <Link
                    href={v.link.href}
                    className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-accent-primary hover:text-white transition-colors"
                  >
                    {v.link.label}
                  </Link>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
