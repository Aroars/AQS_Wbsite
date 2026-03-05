import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { RepsPageContent } from "@/components/pages/reps-page";
import { pageMetadata } from "@/content/seo";

export const metadata: Metadata = {
  title: pageMetadata.reps.title,
  description: pageMetadata.reps.description,
};

export default function RepsPage() {
  return (
    <>
      <Navigation />
      <RepsPageContent />
      <Footer />
    </>
  );
}
