import type { Metadata } from "next";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ContactContent } from "@/components/pages/contact-page";
import { pageMetadata } from "@/content/seo";

export const metadata: Metadata = {
  title: pageMetadata.contact.title,
  description: pageMetadata.contact.description,
  openGraph: {
    title: pageMetadata.contact.title,
    description: pageMetadata.contact.description,
  },
};

export default function ContactPage() {
  return (
    // data-theme-ready: this route is on the light/dark token model (see globals.css)
    <div data-theme-ready>
      <Navigation />
      <ContactContent />
      <Footer />
    </div>
  );
}
