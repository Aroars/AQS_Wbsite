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

const family = categories.find((c) => c.slug === "pallet")!;

export const metadata: Metadata = {
  title: pageMetadata.conveyorsPallet.title,
  description: pageMetadata.conveyorsPallet.description,
  alternates: { canonical: "https://automatedqs.com/solutions/conveyors/pallet" },
  openGraph: {
    title: pageMetadata.conveyorsPallet.title,
    description: pageMetadata.conveyorsPallet.description,
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
            { name: family.title, path: "/solutions/conveyors/pallet" },
          ]),
          service({ name: family.title, description: pageMetadata.conveyorsPallet.description, url: "/solutions/conveyors/pallet", image: family.heroImage?.src }),
          faqPage(family.faq),
        ]}
      />
      <Navigation />
      <ConveyorFamilyContent family="pallet" />
      <SystemArchitecture currentProduct="conveyors" />
      <ConveyorCTA />
      <Footer />
    </>
  );
}
