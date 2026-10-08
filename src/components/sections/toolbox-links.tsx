import Link from "next/link";
import type { CSSProperties } from "react";
import { toolBySlug } from "@/toolbox/lib/toolRegistry";
import { getToolPage } from "@/toolbox/lib/toolSeo";

/**
 * "Size it yourself" — links from a product page into the free engineering
 * tools that size that product. Server-rendered so the links are crawlable.
 *
 * A card-surface band with the tool cards on the page ground. The product
 * accent is only the card's hover border; all text is on the semantic tokens.
 */
export function ToolboxLinks({
  tools,
  title = "Size It Yourself",
  intro = "The free calculators our engineers use to size conveyors — belt pull, speed, throughput, and drive selection. No login; your inputs stay in your browser.",
  accent = "#00C2FF",
}: {
  tools: string[];
  title?: string;
  intro?: string;
  /** Product colour for the card hover border (a fill/edge use, never text) */
  accent?: string;
}) {
  const cards = tools
    .map((slug) => ({ slug, label: toolBySlug(slug)?.label, page: getToolPage(slug) }))
    .filter((c): c is { slug: string; label: string | undefined; page: NonNullable<ReturnType<typeof getToolPage>> } => !!c.page && c.page.published);
  if (cards.length === 0) return null;

  return (
    <section
      className="py-[72px] px-8 bg-surface-card border-y border-border"
      style={{ "--tool-accent": accent } as CSSProperties}
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="font-mono text-[0.62rem] tracking-[0.12em] uppercase text-accent-text mb-3">
          Engineering Toolbox
        </div>
        <h2 className="font-sans text-text-strong font-extrabold text-[clamp(1.5rem,2.6vw,2rem)] leading-tight mb-3">{title}</h2>
        <p className="font-sans text-text-body text-[0.95rem] leading-relaxed max-w-2xl mb-8">{intro}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map(({ slug, label, page }) => (
            <Link
              key={slug}
              href={`/toolbox/${slug}`}
              className="group block rounded-xl border border-border bg-surface-page p-5 no-underline transition-colors hover:border-(--tool-accent) hover:bg-surface-card-hover"
            >
              <div className="font-sans font-semibold text-text-strong mb-1.5 group-hover:text-accent-text transition-colors">{label ?? page.h1}</div>
              <p className="font-sans text-text-body text-[0.82rem] leading-relaxed">{page.description}</p>
            </Link>
          ))}
        </div>
        <div className="mt-6">
          <Link href="/toolbox" className="font-mono text-[0.72rem] tracking-[0.1em] uppercase text-accent-text no-underline transition-colors hover:text-text-strong">
            All engineering tools →
          </Link>
        </div>
      </div>
    </section>
  );
}
