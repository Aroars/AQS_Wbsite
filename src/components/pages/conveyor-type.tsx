import Image from "next/image";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { SectionLabel, SectionTitle, SectionDesc } from "@/components/ui/section-header";
import { ConveyorBreadcrumb } from "@/components/ui/conveyor-breadcrumb";
import { ConveyorFamilyNav } from "@/components/ui/conveyor-family-nav";
import { RenderFigure } from "@/components/ui/render-figure";
import { VideoFigure } from "@/components/ui/video-figure";
import { SpecTable } from "@/components/ui/spec-table";
import { ProtectionTierTable } from "@/components/ui/protection-tier-table";
import { ProjectCard } from "@/components/ui/project-card";
import { categories, getSpotlight, spotlightHref, type ImageRef } from "@/data/conveyors";
import type { ConveyorTypePage } from "@/data/conveyor-type-pages";

/** A photo fills its frame (3:4 when it is a portrait shot); a render sits on a light tile so it is not cropped */
function Figure({ image, priority = false, sizes }: { image: ImageRef; priority?: boolean; sizes?: string }) {
  if (image.kind === "render") return <RenderFigure image={image} priority={priority} sizes={sizes} />;
  const aspect = image.orientation === "portrait" ? "aspect-[3/4] max-h-[560px] mx-auto" : "aspect-[4/3]";
  return (
    <figure className="m-0">
      <div className={`relative ${aspect} rounded-xl overflow-hidden border border-border`}>
        <Image src={image.src} alt={image.alt} fill priority={priority} className="object-cover" sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"} />
      </div>
      {image.caption && <figcaption className="font-sans text-[0.76rem] text-text-dim mt-2 leading-[1.5]">{image.caption}</figcaption>}
    </figure>
  );
}

/**
 * One conveyor type, in the order an engineer reads it: what it is → where
 * it is used → how AQS builds this type → specifications → a related project.
 * FAQ, calculators, and the CTA follow from the route shell.
 *
 * Sections alternate between the page ground and card-surface bands; cards
 * inside a band sit on the page ground (plan section 5e).
 */
export function ConveyorTypeContent({ page }: { page: ConveyorTypePage }) {
  const category = categories.find((c) => c.slug === page.family)!;
  const project = page.relatedProject ? getSpotlight(page.relatedProject) : undefined;

  return (
    <>
      {/* What it is — definition beside the hero image; a text hero, so it is on the page ground */}
      <section className="relative pt-[140px] pb-[64px] px-8 overflow-hidden">
        <div className="max-w-[1280px] mx-auto relative z-10">
          <AnimatedSection>
            <ConveyorBreadcrumb trail={[{ label: category.shortTitle, href: `/solutions/conveyors/${category.slug}` }]} current={page.h1} />
          </AnimatedSection>
          <div className={`grid grid-cols-1 gap-10 items-center ${page.hero ? "lg:grid-cols-[1.1fr_1fr]" : ""}`}>
            <AnimatedSection>
              <SectionLabel>{category.title}</SectionLabel>
              <h1 className="font-sans font-extrabold text-[clamp(1.9rem,3.6vw,2.8rem)] leading-[1.1] text-text-strong mb-5">{page.h1}</h1>
              <p className="font-sans text-[1.05rem] text-text-strong leading-[1.65] mb-4">{page.definition}</p>
              <div className={page.hero ? "" : "max-w-[820px]"}>
                {page.intro.map((p) => (
                  <p key={p} className="font-sans text-[0.95rem] text-text-body leading-[1.7] mb-3">
                    {p}
                  </p>
                ))}
              </div>
            </AnimatedSection>
            {page.hero && (
              <AnimatedSection delay={0.1}>
                <Figure image={page.hero} priority />
              </AnimatedSection>
            )}
          </div>
          <AnimatedSection delay={0.15}>
            <div className="mt-10">
              <ConveyorFamilyNav currentFamily={page.family} currentType={page.typeSlug} onFamilyPage={false} />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Where it is used — a card-surface band */}
      <section className="py-[64px] px-8 bg-surface-card border-y border-border">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection>
            <SectionLabel>Where It&apos;s Used</SectionLabel>
            <SectionTitle>Where {/^[aeiou]/i.test(page.primaryTerm) ? "an" : "a"} {page.primaryTerm} earns its place</SectionTitle>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {page.whereUsed.map((w) => (
              <StaggerItem key={w.context}>
                <div className="p-5 rounded-xl bg-surface-page border border-border h-full">
                  <div className="font-sans text-[0.95rem] font-semibold text-text-strong mb-1.5">{w.context}</div>
                  <p className="font-sans text-[0.84rem] text-text-body leading-[1.65] m-0">{w.detail}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Construction for this type */}
      <section className="py-[64px] px-8">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection>
            <SectionLabel>Construction for This Type</SectionLabel>
            <SectionTitle>How AQS builds it</SectionTitle>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {page.construction.map((c) => (
              <StaggerItem key={c.title}>
                <div className="p-5 rounded-xl bg-surface-card border border-border h-full">
                  <div className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-accent-text mb-2">
                    {c.title}
                  </div>
                  <p className="font-sans text-[0.84rem] text-text-body leading-[1.65] m-0">{c.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          {((page.secondary && page.secondary.length > 0) || page.video) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {page.video && (
                <AnimatedSection>
                  <VideoFigure video={page.video} aspect="aspect-[4/3]" />
                </AnimatedSection>
              )}
              {page.secondary?.map((img, i) => (
                <AnimatedSection key={img.src} delay={0.05 * (i + 1)}>
                  <Figure image={img} />
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Specifications — a card-surface band; the tables sit on the page ground inside it */}
      <section className="py-[64px] px-8 bg-surface-card border-y border-border">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection>
            <SectionLabel>Specifications</SectionLabel>
            <SectionTitle>Typical ranges</SectionTitle>
            <SectionDesc>
              Every AQS conveyor is engineered to order around the product, the rate, and the room. The
              ranges below are typical, not limits — tell us what the line needs and we size to it.
            </SectionDesc>
          </AnimatedSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2 items-start">
            <AnimatedSection>
              <SpecTable rows={page.specs} caption={`${page.h1} — as built by AQS`} surface="page" />
            </AnimatedSection>
            <AnimatedSection delay={0.05}>
              <ProtectionTierTable highlight={page.ipTier} surface="page" />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Related project spotlight */}
      {project && (
        <section className="py-[64px] px-8">
          <div className="max-w-[1280px] mx-auto">
            <AnimatedSection>
              <SectionLabel>Related Project</SectionLabel>
              <SectionTitle>Built and running</SectionTitle>
            </AnimatedSection>
            <div className="max-w-[640px] mt-2">
              <AnimatedSection delay={0.05}>
                {/* Card only needs the summary fields; the spotlight body stays out of the RSC payload */}
                <ProjectCard project={{ ...project, spotlight: undefined }} href={spotlightHref(project)} size="preview" />
              </AnimatedSection>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
