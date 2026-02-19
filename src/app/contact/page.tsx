import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ContactContent } from "@/components/pages/contact-page";
import { pageMetadata } from "@/content/seo";

export const metadata: Metadata = {
  title: pageMetadata.contact.title,
  description: pageMetadata.contact.description,
};

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <ContactContent />
      <Footer />
    </>
  );
}
