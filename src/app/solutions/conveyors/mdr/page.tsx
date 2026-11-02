import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ConveyorFamilyContent } from "@/components/pages/conveyor-family";
import { SystemArchitecture } from "@/components/sections/system-architecture";
import { ConveyorCTA } from "@/components/sections/conveyor-cta";
import { pageMetadata } from "@/content/seo";
import { categories } from "@/data/conveyors";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbList, faqPage, service } from "@/lib/schema";

const family = categories.find((c) => c.slug === "mdr")!;

export const metadata: Metadata = {
  title: pageMetadata.conveyorsMdr.title,
  description: pageMetadata.conveyorsMdr.description,
  alternates: { canonical: "https://automatedqs.com/solutions/conveyors/mdr" },
  openGraph: {
    title: pageMetadata.conveyorsMdr.title,
    description: pageMetadata.conveyorsMdr.description,
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
            { name: family.title, path: "/solutions/conveyors/mdr" },
          ]),
          service({ name: family.title, description: pageMetadata.conveyorsMdr.description, url: "/solutions/conveyors/mdr", image: family.heroImage?.src }),
          faqPage(family.faq),
        ]}
      />
      <Navigation />
      <ConveyorFamilyContent family="mdr" />
      <SystemArchitecture currentProduct="conveyors" />
      <ConveyorCTA />
      <Footer />
    </>
  );
}
