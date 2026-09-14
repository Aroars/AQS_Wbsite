import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { FAQSection } from "@/components/sections/faq-section";
import { ConveyorCTA } from "@/components/sections/conveyor-cta";
import { ConveyorSpotlightContent } from "@/components/pages/conveyor-spotlight";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE, article, breadcrumbList, faqPage } from "@/lib/schema";
import { getSpotlight, isFilled, spotlightHref, spotlightProjects } from "@/data/conveyors";

// Only projects with a spotlight body have a page; legacy cards stay unlinked.
export const dynamicParams = false;

export function generateStaticParams() {
  return spotlightProjects().map((p) => ({ slug: p.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const project = getSpotlight(slug);
  if (!project?.spotlight) return {};
  const s = project.spotlight;
  const url = `${SITE}${spotlightHref(project)}`;
  return {
    title: s.title,
    description: s.description,
    alternates: { canonical: url },
    openGraph: {
      title: s.ogTitle ?? s.title,
      description: s.description,
      url,
      type: "article",
      images: [{ url: `${SITE}${s.hero.src}`, alt: s.hero.alt }],
    },
  };
}

export default async function ConveyorSpotlightPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getSpotlight(slug);
  if (!project?.spotlight) notFound();
  const s = project.spotlight;
  const path = spotlightHref(project);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbList([
            { name: "Home", path: "/" },
            { name: "Sanitary Conveyors", path: "/solutions/conveyors" },
            { name: "Projects", path: "/solutions/conveyors/projects" },
            { name: project.title, path },
          ]),
          article({
            headline: s.h1,
            description: s.description,
            url: path,
            images: [s.hero, ...s.gallery.filter((g) => g.src !== s.hero.src)].map((img) => ({ url: img.src, caption: img.caption ?? img.alt })),
            datePublished: isFilled(s.datePublished) ? s.datePublished : null,
            dateModified: isFilled(s.dateModified) ? s.dateModified : null,
            about: s.about,
            articleSection: "Conveyor Projects",
          }),
          faqPage(s.faq),
        ]}
      />
      <Navigation />
      <ConveyorSpotlightContent project={project} />
      <FAQSection items={s.faq} />
      <ConveyorCTA />
      <Footer />
    </>
  );
}
