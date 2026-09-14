import Link from "next/link";
import Image from "next/image";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionLabel, SectionTitle } from "@/components/ui/section-header";
import { GlowOrb } from "@/components/ui/glow-orb";
import { ConveyorBreadcrumb } from "@/components/ui/conveyor-breadcrumb";
import { RenderFigure } from "@/components/ui/render-figure";
import { SpecTable } from "@/components/ui/spec-table";
import { ConveyorGallery } from "@/components/ui/conveyor-gallery";
import { CONVEYOR_ACCENT, type ConveyorProject } from "@/data/conveyors";

const accent = CONVEYOR_ACCENT;

/**
 * A project spotlight: what the plant needed, what AQS built, how it is
 * controlled, what the environment demanded, and the result — anonymized to
 * industry and region, AQS renders only.
 */
export function ConveyorSpotlightContent({ project }: { project: ConveyorProject }) {
  const s = project.spotlight!;
  return (
    <article>
      {/* Hero */}
      <section className="relative pt-[140px] pb-[56px] px-8 overflow-hidden">
        <GlowOrb top="-100px" left="80%" size={500} color="148,163,184" />
        <div className="max-w-[1280px] mx-auto relative z-10">
          <AnimatedSection>
            <ConveyorBreadcrumb trail={[{ label: "Projects", href: "/solutions/conveyors/projects" }]} current={project.title} />
            <SectionLabel>
              {s.industry} · {s.region}
            </SectionLabel>
            <h1 className="font-sans font-extrabold text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.12] text-white mb-6 max-w-[900px]">{s.h1}</h1>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            {s.hero.kind === "render" ? (
              <RenderFigure image={s.hero} priority aspect="aspect-[16/10]" sizes="(max-width: 1280px) 100vw, 1280px" />
            ) : (
              <figure className="m-0">
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-white/[0.08]">
                  <Image src={s.hero.src} alt={s.hero.alt} fill priority className="object-cover" sizes="(max-width: 1280px) 100vw, 1280px" />
                </div>
                {s.hero.caption && <figcaption className="font-sans text-[0.76rem] text-text-dim mt-2">{s.hero.caption}</figcaption>}
              </figure>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* At a glance */}
      <section className="pb-[56px] px-8">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection>
            <SpecTable rows={s.atAGlance} caption="At a glance" />
          </AnimatedSection>
        </div>
      </section>

      {/* Story sections */}
      <section className="py-[56px] px-8 bg-black/[0.06]">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
          <nav aria-label="On this page" className="hidden lg:block sticky top-[110px] self-start">
            <div className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-text-dim mb-3">On this page</div>
            <ul className="space-y-2 list-none p-0 m-0">
              {s.sections.map((sec) => (
                <li key={sec.id}>
                  <a href={`#${sec.id}`} className="font-sans text-[0.84rem] text-text-body hover:text-white no-underline transition-colors">
                    {sec.heading}
                  </a>
                </li>
              ))}
              <li>
                <a href="#result" className="font-sans text-[0.84rem] text-text-body hover:text-white no-underline transition-colors">
                  Result
                </a>
              </li>
            </ul>
          </nav>
          <div className="max-w-[780px]">
            {s.sections.map((sec) => (
              <AnimatedSection key={sec.id}>
                <section id={sec.id} className="mb-10 scroll-mt-[110px]">
                  <h2 className="font-sans text-[1.35rem] font-bold text-white mb-3">{sec.heading}</h2>
                  {sec.paragraphs.map((p) => (
                    <p key={p} className="font-sans text-[0.95rem] text-text-body leading-[1.75] mb-3">
                      {p}
                    </p>
                  ))}
                </section>
              </AnimatedSection>
            ))}
            <AnimatedSection>
              <section id="result" className="scroll-mt-[110px] rounded-xl p-6 border border-white/[0.08]" style={{ background: `${accent}0C` }}>
                <h2 className="font-sans text-[1.35rem] font-bold text-white mb-3">Result</h2>
                <p className="font-sans text-[0.95rem] text-text-body leading-[1.75] mb-5">{s.result.body}</p>
                <div className="grid grid-cols-2 gap-4">
                  {s.result.numbers.map((n) => (
                    <div key={n.label}>
                      <div className="font-mono text-[1.8rem] font-bold leading-none mb-1" style={{ color: accent }}>
                        {n.value}
                      </div>
                      <div className="font-sans text-[0.78rem] text-text-body">{n.label}</div>
                    </div>
                  ))}
                </div>
              </section>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Gallery — only images beyond the hero; renders nothing when there are none yet */}
      <ConveyorGallery images={s.gallery.filter((g) => g.src !== s.hero.src)} label="The System" title="Renders" columns={2} />

      {/* Related links */}
      <section className="py-[56px] px-8">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection>
            <SectionLabel>Related</SectionLabel>
            <SectionTitle>Read next</SectionTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              {s.related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="font-mono text-[0.66rem] tracking-[0.06em] uppercase rounded-full px-3.5 py-2 no-underline transition-all duration-200 hover:text-white"
                  style={{ color: accent, background: `${accent}14`, border: `1px solid ${accent}55` }}
                >
                  {r.label} &rarr;
                </Link>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </article>
  );
}
