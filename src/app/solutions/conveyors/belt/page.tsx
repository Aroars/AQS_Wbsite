import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ToolboxLinks } from "@/components/sections/toolbox-links";
import { ConveyorFamilyContent } from "@/components/pages/conveyor-family";
import { SystemArchitecture } from "@/components/sections/system-architecture";
import { ConveyorCTA } from "@/components/sections/conveyor-cta";
import { pageMetadata } from "@/content/seo";
import { categories } from "@/data/conveyors";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbList, faqPage, service } from "@/lib/schema";

const family = categories.find((c) => c.slug === "belt")!;

export const metadata: Metadata = {
  title: pageMetadata.conveyorsBeltFamily.title,
  description: pageMetadata.conveyorsBeltFamily.description,
  alternates: { canonical: "https://automatedqs.com/solutions/conveyors/belt" },
  openGraph: {
    title: pageMetadata.conveyorsBeltFamily.title,
    description: pageMetadata.conveyorsBeltFamily.description,
  },
};

export default function ConveyorFamilyPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbList([
            { name: "Home", path: "/" },
            { name: "Sanitary Conveyors", path: "/solutions/conveyors" },
            { name: family.title, path: "/solutions/conveyors/belt" },
          ]),
          service({ name: family.title, description: pageMetadata.conveyorsBeltFamily.description, url: "/solutions/conveyors/belt", image: family.heroImage?.src }),
          faqPage(family.faq),
        ]}
      />
      <Navigation />
      <ConveyorFamilyContent family="belt" />
      <ToolboxLinks tools={['belt-pull-calculator', 'uhmw-wearstrip-span-calculator', 'incline-conveyor-calculator', 'conveyor-speed-calculator', 'conveyor-throughput-calculator', 'friction-coefficient-table']} title="Size a Belt Conveyor Yourself" />
      <SystemArchitecture currentProduct="conveyors" />
      <ConveyorCTA />
      <Footer />
    </>
  );
}
