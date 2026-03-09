import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Digital Tools & Apps | Conveyor Quoting & ROI Calculator | AQS",
  description:
    "AQS builds purpose-built digital tools for packaging automation sales — including a conveyor quote builder with 3D preview and an ROI projection calculator for capital equipment decisions.",
  openGraph: {
    title: "Digital Tools & Apps | Conveyor Quoting & ROI Calculator | AQS",
    description:
      "AQS builds purpose-built digital tools for packaging automation sales — including a conveyor quote builder with 3D preview and an ROI projection calculator for capital equipment decisions.",
  },
};

const apps = [
  {
    title: "Conveyor Quote Builder",
    badge: "SALES TOOL",
    accent: "#F5A623",
    href: "https://apps.automatedqs.com",
    external: true,
    comingSoon: false,
    description:
      "Configure and price custom sanitary conveyors in minutes. Select conveyor type and dimensions, choose materials and drive options, and generate a professional PDF quote — all from your browser.",
    features: [
      "3D conveyor preview with real-time updates",
      "Six conveyor types with full materials configurator",
      "Instant costing with markup and commission tracking",
      "One-click PDF generation and quote delivery",
    ],
    footer: "Authorized reps and partners",
  },
  {
    title: "ROI Projection Tool",
    badge: "FINANCIAL TOOL",
    accent: "#00C6D7",
    href: "#",
    external: false,
    comingSoon: true,
    description:
      "Build a conservative 60-month financial projection for capital equipment purchases. Calculate break-even timelines, labor savings, and capacity gains with interactive charts ready for executive presentations.",
    features: [
      "Break-even analysis with month-by-month tracking",
      "Labor savings and capacity benefit calculators",
      "Interactive cumulative cash flow visualization",
      "Conservative methodology — no inflated projections",
    ],
    footer: "Authorized reps and partners",
  },
] as const;

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className || "w-3.5 h-3.5"}
    >
      <path
        fillRule="evenodd"
        d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className || "w-4 h-4"}
    >
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 01.75-.75h10.638L11.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.04-1.08l3.158-2.96H3.75A.75.75 0 013 10z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className || "w-4 h-4"}
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function AppsPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="mx-auto max-w-4xl text-center">
            <p
              className="font-mono text-[0.58rem] tracking-[0.1em] uppercase mb-4"
              style={{ color: "#00c2ff" }}
            >
              DIGITAL TOOLS
            </p>
            <h1 className="font-sans text-[clamp(2rem,4vw,3rem)] font-extrabold text-white mb-6">
              AQS Apps
            </h1>
            <p className="text-[rgba(255,255,255,0.55)] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Purpose-built tools that help our team and partners move faster
              — from quoting custom conveyors to building defensible ROI
              projections for capital equipment purchases.
            </p>
          </div>
        </section>

        {/* App Cards Grid */}
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
            {apps.map((app) => {
              const cardContent = (
                <div
                  className={`relative flex flex-col h-full rounded-[16px] border overflow-hidden transition-all duration-300 ${
                    app.comingSoon
                      ? "opacity-70"
                      : "hover:-translate-y-1 hover:shadow-lg"
                  }`}
                  style={{
                    background: "rgba(0,0,0,0.28)",
                    borderColor: "rgba(0,0,0,0.25)",
                    borderTopWidth: "3px",
                    borderTopColor: app.accent,
                    ...(app.comingSoon
                      ? {}
                      : {
                          // Hover glow handled via group class
                        }),
                  }}
                >
                  {/* Card Header */}
                  <div className="p-6 pb-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="font-mono text-[0.58rem] tracking-[0.1em] uppercase font-semibold px-2.5 py-1 rounded-md"
                          style={{
                            color: app.accent,
                            background: `${app.accent}15`,
                            border: `1px solid ${app.accent}30`,
                          }}
                        >
                          {app.badge}
                        </span>
                        {app.comingSoon && (
                          <span className="font-mono text-[0.58rem] tracking-[0.1em] uppercase font-semibold px-2.5 py-1 rounded-md text-[rgba(255,255,255,0.4)] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)]">
                            COMING SOON
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[rgba(255,255,255,0.35)]">
                        <LockIcon className="w-3 h-3" />
                        <span className="font-mono text-[0.5rem] tracking-[0.05em] uppercase">
                          Login required
                        </span>
                      </div>
                    </div>

                    <h2 className="font-sans text-xl font-bold text-white mb-3">
                      {app.title}
                    </h2>
                    <p className="text-[rgba(255,255,255,0.55)] text-sm leading-relaxed mb-5">
                      {app.description}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="px-6 pb-4 flex-1">
                    <ul className="space-y-2.5">
                      {app.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-sm"
                        >
                          <CheckIcon
                            className="w-4 h-4 mt-0.5 shrink-0"
                          />
                          <span
                            className="text-[rgba(255,255,255,0.55)]"
                            style={
                              !app.comingSoon
                                ? { color: "rgba(255,255,255,0.55)" }
                                : undefined
                            }
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Footer */}
                  <div
                    className="px-6 py-4 mt-auto border-t flex items-center justify-between"
                    style={{ borderColor: "rgba(255,255,255,0.06)" }}
                  >
                    <span className="text-[rgba(255,255,255,0.35)] text-xs font-mono tracking-wide">
                      {app.footer}
                    </span>
                    {!app.comingSoon && (
                      <ArrowRightIcon className="w-4 h-4 text-[rgba(255,255,255,0.35)]" />
                    )}
                  </div>
                </div>
              );

              if (app.comingSoon) {
                return (
                  <div key={app.title} className="cursor-default">
                    {cardContent}
                  </div>
                );
              }

              return (
                <a
                  key={app.title}
                  href={app.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                  style={
                    {
                      "--card-accent": app.accent,
                    } as React.CSSProperties
                  }
                >
                  <style>{`
                    .group:hover > div {
                      border-color: ${app.accent}40 !important;
                      box-shadow: 0 0 30px ${app.accent}12, 0 8px 32px rgba(0,0,0,0.3);
                    }
                  `}</style>
                  {cardContent}
                </a>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-6 pb-12">
          <div
            className="mx-auto max-w-3xl text-center rounded-[16px] border px-8 py-12 md:py-16"
            style={{
              background: "rgba(0,0,0,0.28)",
              borderColor: "rgba(0,0,0,0.25)",
            }}
          >
            <p className="text-[rgba(255,255,255,0.55)] text-base md:text-lg mb-6">
              Want to become an AQS sales partner? Get in touch.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white transition-all duration-200 hover:brightness-110"
              style={{ background: "#00c2ff" }}
            >
              Contact Us
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
