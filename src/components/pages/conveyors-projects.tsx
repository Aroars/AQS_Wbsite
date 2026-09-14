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
import { GlowOrb } from "@/components/ui/glow-orb";
import { ConveyorBreadcrumb } from "@/components/ui/conveyor-breadcrumb";
import { ProjectCard } from "@/components/ui/project-card";
import { ConveyorGallery } from "@/components/ui/conveyor-gallery";
import { conveyorProjects, galleryImages } from "@/data/conveyors";

/* ================================================
   Page Content
   ================================================ */

export function ConveyorsProjectsContent() {
  return (
    <>
      {/* Hero */}
      <section className="pt-[140px] pb-[80px] px-8 relative overflow-hidden">
        <GlowOrb top="-100px" left="80%" size={500} color="148,163,184" />
        <div className="max-w-[1280px] mx-auto relative z-10">
          <AnimatedSection>
            <ConveyorBreadcrumb current="Projects" />
            <SectionLabel>Project Portfolio</SectionLabel>
            <SectionTitle>Conveyor Projects & Case Studies</SectionTitle>
            <SectionDesc>
              Real-world sanitary conveyor systems designed, built, and installed
              by AQS — from freezer-rated marshmallow lines to high-capacity dairy
              accumulation systems. Spotlights open to the full story.
            </SectionDesc>
          </AnimatedSection>
        </div>
      </section>

      {/* Project Cards — a card links to its spotlight only when that page exists */}
      <section className="pb-[72px] px-8">
        <div className="max-w-[1280px] mx-auto">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {conveyorProjects.map((p) => (
              <StaggerItem key={p.slug}>
                <ProjectCard project={p} size="full" />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Photo Gallery */}
      <ConveyorGallery
        images={galleryImages}
        intro="AQS conveyor systems installed across dairy, protein, bakery, and frozen food production facilities."
      />
    </>
  );
}
