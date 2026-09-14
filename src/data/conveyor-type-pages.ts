// Per-type conveyor pages at /solutions/conveyors/<family>/<slug>.
// Each entry is one page; the family page and hub link to it when it exists.

import { TODO, type FAQItem, type ImageRef, type SpecRow } from "./conveyors";

export interface ConveyorTypePage {
  family: "belt" | "mdr" | "pallet";
  /** URL segment */
  slug: string;
  /** `ConveyorType.slug` — the anchor on the family page this page expands */
  typeSlug: string;
  h1: string;
  /** ≤ 60 characters, keyword first */
  title: string;
  /** ≤ 155 characters */
  description: string;
  /** The term the page is built around, plus the alias stated once in the definition */
  primaryTerm: string;
  alias?: string;
  /** First sentence: entity + attributes, in plain words */
  definition: string;
  intro: string[];
  whereUsed: { context: string; detail: string }[];
  construction: { title: string; body: string }[];
  /** Rows valued TODO are hidden until AQS supplies them */
  specs: SpecRow[];
  /** Tier to highlight in the protection table */
  ipTier?: string;
  hero: ImageRef;
  secondary?: ImageRef[];
  /** Spotlight slug; the card shows only if that project has a spotlight body */
  relatedProject?: string;
  faq: FAQItem[];
  /** Toolbox page slugs for the "Size It Yourself" strip */
  tools: string[];
}

export const conveyorTypePages: ConveyorTypePage[] = [];

export const typePageHref = (p: Pick<ConveyorTypePage, "family" | "slug">) =>
  `/solutions/conveyors/${p.family}/${p.slug}`;

/** By family-page anchor (what the family page and hub know) */
export function getTypePage(family: string, typeSlug: string) {
  const p = conveyorTypePages.find((x) => x.family === family && x.typeSlug === typeSlug);
  return p ? { ...p, href: typePageHref(p) } : undefined;
}

/** By URL segment (what the route knows) */
export function getTypePageBySlug(family: string, slug: string) {
  return conveyorTypePages.find((x) => x.family === family && x.slug === slug);
}

export { TODO };
