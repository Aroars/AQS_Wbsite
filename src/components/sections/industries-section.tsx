"use client";

import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/animated-section";
import { SectionLabel, SectionTitle } from "@/components/ui/section-header";

const scenarios = [
  {
    accent: "#00c2ff",
    title: "The Chargeback You Can\u2019t Fight",
    body: "A customer claims a case arrived underweight. You know your checkweigher was running. But you can\u2019t prove that specific case was in spec when it left your dock. With VeriPak, you can pull the exact weight record, the inspection image, and the operator timestamp for that package.",
  },
  {
    accent: "#00c2ff",
    title: "The Audit That Becomes a Fire Drill",
    body: "An auditor gives you 48 hours to prove every package on a production run was inspected. Your QC manager starts pulling binders. With VeriPak, the data is already centralized, timestamped, and exportable. Same-day response instead of a two-week scramble.",
  },
  {
    accent: "#f5a623",
    title: "The Margin You Gave Away Last Week",
    body: "Your team discovers Monday that Friday\u2019s run was 10% overweight. That\u2019s margin you can never recover. VeriPak\u2019s real-time alarm escalation catches drift as it happens \u2014 alerts on the floor, then text, then RACI escalation \u2014 so you stop the bleed before it costs a full shift.",
  },
  {
    accent: "#f5a623",
    title: "The Line That Stops for No Reason",
    body: "Product misfeeds cause jams, downtime, and waste. IntelliPak\u2019s Mag-Drive technology eliminates the gearbox \u2014 and the oil leaks, backlash, and encoder failures that come with it. 500 PPM synchronous feeding. 55% less energy. 50% faster sanitation.",
  },
];

export function IndustriesSection() {
  return (
    <section className="py-[90px] px-8">
      <div className="max-w-[1280px] mx-auto">
        <AnimatedSection>
          <div className="text-center mb-11">
            <SectionLabel>Real-World Impact</SectionLabel>
            <SectionTitle className="text-center">
              Built for the Moments That Cost You
            </SectionTitle>
          </div>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {scenarios.map((s) => (
            <StaggerItem key={s.title}>
              <div
                className="bg-bg-card border border-border-default rounded-xl p-8 h-full group hover:bg-bg-card-hover hover:-translate-y-1 transition-all duration-400"
                style={{ borderLeftWidth: 3, borderLeftColor: s.accent }}
              >
                <div
                  className="font-sans text-[1.1rem] font-bold mb-3"
                  style={{ color: s.accent }}
                >
                  {s.title}
                </div>
                <div className="font-sans text-[0.88rem] text-text-body leading-[1.7]">
                  {s.body}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
