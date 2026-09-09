import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ToolboxLoader } from "@/components/toolbox/ToolboxLoader";
import { ToolboxHeader } from "@/components/toolbox/ToolboxHeader";
import { pageMetadata } from "@/content/seo";
import { chartTools, calculatorTools, conveyorTools } from "@/toolbox/lib/toolRegistry";
import { toolDescriptions } from "@/toolbox/lib/toolDescriptions";
import { getToolPage } from "@/toolbox/lib/toolSeo";

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
        {/* Title strip is the page H1; the Help chevron on it explains each tab */}
        <ToolboxHeader titleAs="h1" />

        <ToolboxLoader />

        {/* Crawlable index of every tool: one link per page, grouped, compact */}
        <section id="tools" className="px-6 py-12 md:py-14">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-white mb-3">
              What&apos;s in the toolbox
            </h2>
            <p className="text-text-body text-sm max-w-3xl leading-relaxed mb-8">
              A conveyor belt pull calculator, conveyor speed calculator, and
              wearstrip span calculator, an MDR hub motor selection chart, a light
              curtain safety distance calculator, and the reference charts a
              packaging engineer reaches for daily. Free, no login, saved in this
              browser. Open the Help chevron on the title strip for a walkthrough
              of each tab.
            </p>
            <div className="space-y-8">
              {groups.map((group) => (
                <div key={group.heading}>
                  <h3 className="font-sans text-sm font-semibold text-white mb-1">
                    {group.heading}
                  </h3>
                  <p className="text-text-dim text-xs leading-relaxed mb-3 max-w-3xl">
                    {group.blurb}
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {group.tools.map((tool) => {
                      const page = getToolPage(tool.slug);
                      const href = page && page.published ? `/toolbox/${tool.slug}` : `#tool-${tool.id}`;
                      return (
                        <li key={tool.id}>
                          <a
                            href={href}
                            title={toolDescriptions[tool.id]}
                            className="inline-block font-mono text-[0.62rem] tracking-[0.06em] uppercase rounded-full px-3 py-1.5 border border-border text-text-secondary hover:text-white hover:border-accent-primary transition-colors no-underline"
                          >
                            {tool.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <p className="text-text-dim text-xs leading-relaxed mt-10 max-w-3xl">
              Values are provided as engineering references and should be
              verified against manufacturer data and applicable codes before
              use in a final design. Need a conveyor sized and quoted? See our{" "}
              <a href="/solutions/conveyors" className="text-accent-primary hover:underline">
                sanitary conveyors
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
