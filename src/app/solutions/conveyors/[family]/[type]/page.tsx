import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ToolboxLinks } from "@/components/sections/toolbox-links";
import { FAQSection } from "@/components/sections/faq-section";
import { ConveyorCTA } from "@/components/sections/conveyor-cta";
import { ConveyorTypeContent } from "@/components/pages/conveyor-type";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE, breadcrumbList, faqPage, service } from "@/lib/schema";
import { CONVEYOR_ACCENT, categories } from "@/data/conveyors";
import { conveyorTypePages, getTypePageBySlug, typePageHref } from "@/data/conveyor-type-pages";

// Static segments (belt/, mdr/, pallet/, projects/) win over this route, so
// only the pages listed in conveyor-type-pages resolve here.
export const dynamicParams = false;

export function generateStaticParams() {
  return conveyorTypePages.map((p) => ({ family: p.family, type: p.slug }));
}

type Params = Promise<{ family: string; type: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { family, type } = await params;
  const page = getTypePageBySlug(family, type);
  if (!page) return {};
  const url = `${SITE}${typePageHref(page)}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      type: "website",
      ...(page.hero ? { images: [{ url: `${SITE}${page.hero.src}`, alt: page.hero.alt }] } : {}),
    },
  };
}

export default async function ConveyorTypePage({ params }: { params: Params }) {
  const { family, type } = await params;
  const page = getTypePageBySlug(family, type);
  if (!page) notFound();
  const category = categories.find((c) => c.slug === page.family)!;
  const path = typePageHref(page);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbList([
            { name: "Home", path: "/" },
            { name: "Sanitary Conveyors", path: "/solutions/conveyors" },
            { name: category.title, path: `/solutions/conveyors/${category.slug}` },
            { name: page.h1, path },
          ]),
          service({ name: page.h1, description: page.description, url: path, image: page.hero?.src }),
          faqPage(page.faq),
        ]}
      />
      <Navigation />
      <ConveyorTypeContent page={page} />
      <ToolboxLinks tools={page.tools} title="Size It Yourself" accent={CONVEYOR_ACCENT} />
      <FAQSection items={page.faq} />
      <ConveyorCTA />
      <Footer />
    </>
  );
}
