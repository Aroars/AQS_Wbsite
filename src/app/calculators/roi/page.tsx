import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { RoiApp } from "@/components/calculators/roi/RoiApp";

export const metadata: Metadata = {
  title: "ROI Projection Tool | Automated Quality Solutions",
  description:
    "Calculate the return on investment for automation equipment. Model labor savings, capacity benefits, and payback timelines.",
};

export default function RoiCalculatorPage() {
  return (
    <>
      <Navigation />
      <section className="roi-scope pt-[100px] pb-[60px] px-4 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="font-mono text-[0.62rem] text-accent-primary tracking-[0.12em] uppercase mb-2">
              Calculator
            </div>
            <h1 className="font-sans text-[1.8rem] font-bold text-white mb-1">
              ROI Projection Tool
            </h1>
            <p className="font-sans text-[0.9rem] text-text-body max-w-[600px]">
              Model labor savings, capacity gains, and payback timelines for your automation investment.
            </p>
          </div>
          <RoiApp />
        </div>
      </section>
      <Footer />
    </>
  );
}
