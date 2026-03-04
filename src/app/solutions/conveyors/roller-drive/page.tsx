import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ConveyorsRollerDriveContent } from "@/components/pages/conveyors-roller-drive";
import { SystemArchitecture } from "@/components/sections/system-architecture";
import { CTASection } from "@/components/sections/cta-section";
import { pageMetadata } from "@/content/seo";

export const metadata: Metadata = {
  title: pageMetadata.conveyorsRollerDrive.title,
  description: pageMetadata.conveyorsRollerDrive.description,
};

export default function ConveyorsRollerDrivePage() {
  return (
    <>
      <Navigation />
      <ConveyorsRollerDriveContent />
      <SystemArchitecture currentProduct="conveyors" />
      <CTASection />
      <Footer />
    </>
  );
}
