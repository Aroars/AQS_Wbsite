import Link from "next/link";
import Image from "next/image";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionLabel, SectionTitle, SectionDesc } from "@/components/ui/section-header";
import { CONVEYOR_ACCENT, constructionStats, weldDetailImage } from "@/data/conveyors";

const accent = CONVEYOR_ACCENT;

/**
 * "Built Different. On Purpose." — the full block lives on the conveyor hub;
 * family and type pages show the compact version and link to it, so the same
 * four claims are not repeated verbatim on every page.
 */
export function ConstructionStandards({ variant = "full" }: { variant?: "full" | "compact" }) {
  if (variant === "compact") {
    return (
      <section className="py-[56px] px-8 bg-black/[0.06]">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection>
            <SectionLabel>Construction Standards</SectionLabel>
            <p className="font-sans text-[0.95rem] text-text-body leading-[1.7] max-w-[720px] mb-5">
              Every AQS conveyor shares one construction standard — continuous TIG welds, 304/316
              mirror-polished stainless, sloped drainage, and IP69K-capable components — whether it
              carries a tray, a case, or a full pallet.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {constructionStats.map((s) => (
                <span
                  key={s.label}
                  className="font-mono text-[0.62rem] tracking-[0.06em] uppercase rounded-full px-3 py-1.5"
                  style={{ color: accent, background: `${accent}14`, border: `1px solid ${accent}55` }}
                >
                  <span className="font-bold text-white">{s.value}</span> {s.label}
                </span>
              ))}
              <Link
                href="/solutions/conveyors#construction"
                className="ml-1 font-mono text-[0.62rem] tracking-[0.08em] uppercase no-underline transition-colors hover:text-white"
                style={{ color: accent }}
              >
                How we build them &rarr;
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    );
  }

  return (
    <section id="construction" className="py-[72px] px-8 scroll-mt-24">
      <div className="max-w-[1280px] mx-auto">
        <AnimatedSection>
          <SectionLabel>Construction Standards</SectionLabel>
          <SectionTitle>Built Different. On Purpose.</SectionTitle>
          <SectionDesc>
            Continuous TIG welds instead of bolted joints. Mirror-polished stainless instead of
            painted steel. Sloped geometry that drains water in seconds — not minutes. Sanitary is
            the baseline.
          </SectionDesc>
        </AnimatedSection>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 mt-2 items-start">
          <div className="grid grid-cols-2 gap-4">
            {constructionStats.map((stat) => (
              <AnimatedSection key={stat.label} delay={0.05}>
                <div className="text-center p-6 rounded-xl bg-black/20 border border-white/[0.04]">
                  <div className="font-mono text-[1.3rem] font-bold mb-1" style={{ color: accent }}>
                    {stat.value}
                  </div>
                  <div className="font-sans text-[0.78rem] text-text-body">{stat.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection delay={0.1}>
            <figure className="m-0">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/[0.08]">
                <Image src={weldDetailImage.src} alt={weldDetailImage.alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 420px" />
              </div>
              {weldDetailImage.caption && (
                <figcaption className="font-sans text-[0.76rem] text-text-dim mt-2 leading-[1.5]">{weldDetailImage.caption}</figcaption>
              )}
            </figure>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
