/**
 * JSON-LD builders shared by the marketing pages. Pure functions — no React.
 * Every builder returns a plain object ready for JSON.stringify, or null when
 * there is nothing to say (so callers can pass results straight to <JsonLd>).
 */

export const SITE = "https://automatedqs.com";

export const ORGANIZATION = {
  "@type": "Organization",
  name: "Automated Quality Solutions (AQS)",
  url: SITE,
} as const;

export interface Crumb {
  name: string;
  /** Site-relative path, "" or "/" for the home page */
  path: string;
}

const abs = (path: string) => (path.startsWith("http") ? path : `${SITE}${path === "/" ? "" : path}`);

/** BreadcrumbList — callers pass the full trail including Home */
export function breadcrumbList(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

/** FAQPage, or null when there are no questions (so no empty schema is emitted) */
export function faqPage(items?: { q: string; a: string }[] | null) {
  if (!items || items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function service(o: {
  name: string;
  description: string;
  url: string;
  serviceType?: string;
  areaServed?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: o.name,
    description: o.description,
    url: abs(o.url),
    serviceType: o.serviceType ?? "Custom Conveyor Engineering",
    areaServed: o.areaServed ?? "US",
    provider: ORGANIZATION,
    ...(o.image ? { image: abs(o.image) } : {}),
  };
}

export interface SchemaImage {
  url: string;
  caption?: string;
  width?: number;
  height?: number;
}

export function imageObject(img: SchemaImage) {
  return {
    "@type": "ImageObject",
    url: abs(img.url),
    ...(img.caption ? { caption: img.caption } : {}),
    ...(img.width ? { width: img.width } : {}),
    ...(img.height ? { height: img.height } : {}),
  };
}

/** Article for project spotlights; dates are omitted when not supplied */
export function article(o: {
  headline: string;
  description: string;
  url: string;
  images: SchemaImage[];
  datePublished?: string | null;
  dateModified?: string | null;
  about?: string[];
  articleSection?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: o.headline,
    description: o.description,
    url: abs(o.url),
    mainEntityOfPage: abs(o.url),
    image: o.images.map(imageObject),
    author: ORGANIZATION,
    publisher: ORGANIZATION,
    ...(o.datePublished ? { datePublished: o.datePublished } : {}),
    ...(o.dateModified ? { dateModified: o.dateModified } : {}),
    ...(o.about && o.about.length ? { about: o.about.map((name) => ({ "@type": "Thing", name })) } : {}),
    ...(o.articleSection ? { articleSection: o.articleSection } : {}),
  };
}
