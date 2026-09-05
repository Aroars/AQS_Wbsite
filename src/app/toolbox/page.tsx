import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ToolboxLoader } from "@/components/toolbox/ToolboxLoader";
import { pageMetadata } from "@/content/seo";
import { chartTools, calculatorTools, conveyorTools } from "@/toolbox/lib/toolRegistry";
import { toolDescriptions } from "@/toolbox/lib/toolDescriptions";

const PAGE_URL = "https://www.automatedqs.com/toolbox";

export const metadata: Metadata = {
  title: pageMetadata.toolbox.title,
  description: pageMetadata.toolbox.description,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: pageMetadata.toolbox.title,
    description: pageMetadata.toolbox.description,
    url: PAGE_URL,
    type: "website",
  },
};

const groups = [
  {
    heading: "Conveyor engineering calculators",
    blurb:
      "Sizing and throughput tools built around sanitary belt and MDR conveyors — the same math our engineers use on customer projects.",
    tools: conveyorTools,
  },
  {
    heading: "Reference charts",
    blurb:
      "Lookup tables engineers reach for daily: fasteners, gauges, fits, wire, pneumatics, connectors, and machine safety distances.",
    tools: chartTools,
  },
  {
    heading: "Calculators and converters",
    blurb:
      "Expression, area, and electrical power calculators, plus a unit converter across length, mass, pressure, flow, temperature, and more.",
    tools: calculatorTools,
  },
];

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AQS Engineering Toolbox",
  url: PAGE_URL,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any (web browser)",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: pageMetadata.toolbox.description,
  featureList: [...conveyorTools, ...chartTools, ...calculatorTools].map((t) => t.label),
  author: {
    "@type": "Organization",
    name: "Automated Quality Solutions (AQS)",
    url: "https://www.automatedqs.com",
  },
};

export default function ToolboxPage() {
  return (
    <>
      <Navigation />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      <div className="toolbox-scope pt-[80px]">
        {/* Server-rendered intro: the H1 and summary crawlers index */}
        <section className="px-6 pt-10 pb-8 md:pt-14 md:pb-10">
          <div className="mx-auto max-w-5xl">
            <p className="font-mono text-[0.58rem] tracking-[0.12em] uppercase mb-3 text-accent-primary">
              Free engineering tools
            </p>
            <h1 className="font-sans text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold text-white mb-4">
              Engineering Toolbox
            </h1>
            <p className="text-text-body text-base md:text-lg max-w-3xl leading-relaxed">
              Conveyor calculators, unit converters, and engineering reference
              charts in one browser tab, built by the AQS engineering team for
              packaging and material handling work. No login. Your converters,
              calculations, and pinned tools are saved in this browser so you
              can pick up where you left off.
            </p>
          </div>
        </section>

        <ToolboxLoader />

        {/* Crawlable index of every tool. Links deep-link into the app above. */}
        <section id="tools" className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-sans text-2xl md:text-3xl font-bold text-white mb-3">
              What&apos;s in the toolbox
            </h2>
            <p className="text-text-body max-w-3xl leading-relaxed mb-12">
              Eighteen tools across three tabs. Press <kbd className="font-mono text-xs px-1.5 py-0.5 rounded border border-border bg-dark-800 text-text-secondary">⌘K</kbd> inside
              the app to jump to any of them by name, size, thread, or fit class.
            </p>

            <div className="space-y-14">
              {groups.map((group) => (
                <div key={group.heading}>
                  <h3 className="font-sans text-lg font-semibold text-white mb-2">
                    {group.heading}
                  </h3>
                  <p className="text-text-body text-sm leading-relaxed mb-6 max-w-3xl">
                    {group.blurb}
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    {group.tools.map((tool) => (
                      <li key={tool.id} className="border-l-2 border-border pl-4">
                        <a
                          href={`#tool-${tool.id}`}
                          className="font-sans font-semibold text-white hover:text-accent-primary transition-colors"
                        >
                          {tool.label}
                        </a>
                        <p className="text-text-body text-sm leading-relaxed mt-1">
                          {toolDescriptions[tool.id]}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="text-text-dim text-sm leading-relaxed mt-14 max-w-3xl">
              Values are provided as engineering references and should be
              verified against manufacturer data and applicable codes before
              use in a final design. Need a conveyor sized and quoted? See our{" "}
              <a href="/solutions/conveyors" className="text-accent-primary hover:underline">
                custom sanitary conveyors
              </a>{" "}
              or{" "}
              <a href="/contact" className="text-accent-primary hover:underline">
                talk to an engineer
              </a>
              .
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
