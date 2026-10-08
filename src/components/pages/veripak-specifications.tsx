"use client";

import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/animated-section";
import {
  SectionLabel,
  SectionTitle,
  SectionDesc,
} from "@/components/ui/section-header";
import { VeriPakBreadcrumb } from "@/components/ui/veripak-breadcrumb";
import { ComparisonTable } from "@/components/ui/comparison-table";
import { veripakSpecs } from "@/data/veripak-specs";
import { hardwareSpecs, compatibleDevices } from "@/data/veripak";

export function VeriPakSpecificationsContent() {
  return (
    <section className="pt-[140px] pb-[100px] px-8 relative">
      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* Breadcrumb + Hero */}
        <AnimatedSection>
          <VeriPakBreadcrumb current="Technical Specifications" />
          <SectionLabel>VeriPak Platform</SectionLabel>
          <SectionTitle>Technical Specifications</SectionTitle>
          <SectionDesc>
            NEMA 4X stainless steel enclosure, Allen-Bradley CompactLogix PLC,
            Optix HMI, dual-network security architecture &mdash; everything
            inside the VeriPak SCADA platform.
          </SectionDesc>
        </AnimatedSection>

        {/* Hardware Specs */}
        <AnimatedSection delay={0.1}>
          <div className="mt-[50px] mb-[60px]">
            <div
              className="font-mono text-[0.65rem] tracking-[0.12em] uppercase mb-2.5 text-accent-text"
            >
              Hardware
            </div>
            <h3 className="font-sans text-[1.3rem] font-bold text-text-strong mb-5">
              What&apos;s Inside the VeriPak SCADA
            </h3>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hardwareSpecs.map((group, gi) => (
                <StaggerItem key={gi}>
                  <div className="rounded-xl bg-surface-card border border-border p-6 h-full">
                    <div
                      className="font-mono text-[0.62rem] tracking-[0.1em] uppercase mb-3 text-accent-text"
                    >
                      {group.category}
                    </div>
                    {group.items.map((item, ii) => (
                      <div
                        key={ii}
                        className="flex justify-between py-1.5 border-b border-border-soft last:border-0"
                      >
                        <span className="font-sans text-[0.82rem] text-text-dim">
                          {item.label}
                        </span>
                        <span className="font-sans text-[0.82rem] text-text-strong font-medium text-right ml-4">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </AnimatedSection>

        {/* Platform Specs (from veripak-specs.ts) */}
        <AnimatedSection delay={0.15}>
          <div className="mb-[60px]">
            <div
              className="font-mono text-[0.65rem] tracking-[0.12em] uppercase mb-2.5 text-accent-text"
            >
              Platform Specifications
            </div>
            <h3 className="font-sans text-[1.3rem] font-bold text-text-strong mb-5">
              System Capabilities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0.5 rounded-xl overflow-hidden border border-border bg-border">
              {veripakSpecs.map((item, i) => (
                <div key={i} className="bg-surface-card p-5">
                  <div className="font-mono text-[0.62rem] text-accent-text tracking-[0.08em] uppercase mb-[7px]">
                    {item.label}
                  </div>
                  <div className="font-sans text-[0.84rem] text-text-body leading-[1.6]">
                    {item.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Comparison Table */}
        <AnimatedSection delay={0.2}>
          <div className="mb-[60px]">
            <h3 className="font-sans text-[1.4rem] font-bold text-text-strong mb-6 text-center">
              Feature Comparison
            </h3>
            <div className="bg-surface-card border border-border rounded-xl overflow-hidden">
              <ComparisonTable />
            </div>
          </div>
        </AnimatedSection>

        {/* Compatible Devices */}
        <AnimatedSection delay={0.25}>
          <div className="mb-[40px]">
            <div
              className="font-mono text-[0.65rem] tracking-[0.12em] uppercase mb-2.5 text-accent-text"
            >
              Device Compatibility
            </div>
            <h3 className="font-sans text-[1.3rem] font-bold text-text-strong mb-5">
              Compatible Equipment
            </h3>
            <div className="flex flex-wrap gap-2">
              {compatibleDevices.map((d) => (
                <span
                  key={d}
                  className="font-sans text-[0.78rem] text-text-body border border-border px-3 py-1.5 rounded-full"
                >
                  {d}
                </span>
              ))}
            </div>
            <p className="font-sans text-[0.8rem] text-text-dim mt-4 leading-[1.6]">
              VeriPak connects to any device with Ethernet/IP, Modbus-TCP, or
              digital I/O output. Antiquated analog-only equipment without
              digital interfaces is not compatible.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
