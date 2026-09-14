import Image from "next/image";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionLabel, SectionTitle, SectionDesc } from "@/components/ui/section-header";
import type { ImageRef } from "@/data/conveyors";

/**
 * The "In the Field" image grid shared by the hub, projects index, and
 * spotlight pages. Renders (`kind: "render"`) sit on a light tile with
 * object-contain; photos fill their tile.
 */
export function ConveyorGallery({
  images,
  label = "In the Field",
  title = "Conveyor Gallery",
  intro,
  columns = 3,
}: {
  images: ImageRef[];
  label?: string;
  title?: string;
  intro?: string;
  columns?: 2 | 3;
}) {
  if (images.length === 0) return null;
  const cols = columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-2 md:grid-cols-3";
  const sizes = columns === 2 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 33vw";
  return (
    <section className="py-[72px] px-8 bg-black/[0.06]">
      <div className="max-w-[1280px] mx-auto">
        <AnimatedSection>
          <SectionLabel>{label}</SectionLabel>
          <SectionTitle>{title}</SectionTitle>
          {intro && <SectionDesc>{intro}</SectionDesc>}
        </AnimatedSection>
        <div className={`grid ${cols} gap-3 mt-6`}>
          {images.map((img) => (
            <figure key={img.src} className="m-0">
              <div
                className={`relative aspect-[4/3] rounded-xl overflow-hidden border border-border-default group ${
                  img.kind === "render" ? "bg-[#f3f5f7]" : ""
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className={
                    img.kind === "render"
                      ? "object-contain p-2"
                      : "object-cover group-hover:scale-105 transition-transform duration-500"
                  }
                  sizes={sizes}
                />
                {img.kind === "render" && (
                  <span className="absolute bottom-2 right-2 font-mono text-[0.52rem] tracking-[0.12em] uppercase text-[#1a1d2b]/60 bg-white/80 rounded px-1.5 py-0.5">
                    Engineering render
                  </span>
                )}
              </div>
              {img.caption && (
                <figcaption className="font-sans text-[0.74rem] text-text-dim mt-1.5 leading-[1.5]">{img.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
