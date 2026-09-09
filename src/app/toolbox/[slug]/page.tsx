import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ToolboxLoader } from "@/components/toolbox/ToolboxLoader";
import { toolPages, getToolPage, publishedToolPages } from "@/toolbox/lib/toolSeo";
import { allTools } from "@/toolbox/lib/toolRegistry";

const SITE = "https://www.automatedqs.com";

export const dynamicParams = false;

export function generateStaticParams() {
  return toolPages.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getToolPage(slug);
  if (!page) return {};
  const url = `${SITE}/toolbox/${page.slug}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    robots: page.published ? undefined : { index: false, follow: true },
    openGraph: { title: page.title, description: page.description, url, type: "website" },
  };
}

/**
 * One indexable page per tool. The intro is server-rendered; the app below is
 * the same single toolbox opened on this tool, so moving between tools inside it
 * never leaves the page — the address bar just follows.
 */
export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getToolPage(slug);
  if (!page) notFound();
  const tool = allTools.find((t) => t.id === page.toolId)!;
  const url = `${SITE}/toolbox/${page.slug}`;
  const related = (page.related ?? [])
    .map((s) => getToolPage(s))
    .filter((p): p is NonNullable<typeof p> => !!p && p.published);
  const more = publishedToolPages.filter((p) => p.slug !== page.slug && !related.some((r) => r.slug === p.slug));

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: page.h1,
    url,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (web browser)",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: page.description,
    isPartOf: { "@type": "SoftwareApplication", name: "AQS Engineering Toolbox", url: `${SITE}/toolbox` },
    author: { "@type": "Organization", name: "Automated Quality Solutions (AQS)", url: SITE },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Engineering Toolbox", item: `${SITE}/toolbox` },
      { "@type": "ListItem", position: 3, name: page.h1, item: url },
    ],
  };

  return (
    <>
      <Navigation />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="toolbox-scope pt-[80px]">
        {/* Server-rendered intro: what the tool calculates and how */}
        <section className="px-6 pt-10 pb-8 md:pt-14 md:pb-10">
          <div className="mx-auto max-w-5xl">
            <nav className="font-mono text-[0.58rem] tracking-[0.12em] uppercase mb-3 text-text-dim">
              <Link href="/toolbox" className="text-accent-primary hover:underline">Engineering Toolbox</Link>
              <span className="mx-2 text-white/20">/</span>
              <span>{tool.label}</span>
            </nav>
            <h1 className="font-sans text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold text-white mb-4">{page.h1}</h1>
            {page.intro.map((p, i) => (
              <p key={i} className="text-text-body text-base md:text-lg max-w-3xl leading-relaxed mb-4">{p}</p>
            ))}
            {page.howItWorks && page.howItWorks.length > 0 && (
              <details className="mt-2 max-w-3xl" open>
                <summary className="font-mono text-[0.62rem] tracking-[0.12em] uppercase text-accent-primary cursor-pointer select-none">How it works</summary>
                <ul className="mt-3 space-y-2 text-text-body text-sm leading-relaxed list-disc pl-5">
                  {page.howItWorks.map((line, i) => <li key={i}>{line}</li>)}
                </ul>
              </details>
            )}
            <p className="text-text-dim text-xs mt-4">
              Free, no login. Your inputs are saved in this browser. Values are engineering references — verify against manufacturer data and applicable codes before a final design.
            </p>
          </div>
        </section>

        <ToolboxLoader initialTool={page.toolId} initialSection={page.section} />

        {/* Related and remaining tools — real links, one per page */}
        <section className="px-6 py-14 md:py-16">
          <div className="mx-auto max-w-5xl">
            {related.length > 0 && (
              <>
                <h2 className="font-sans text-xl md:text-2xl font-bold text-white mb-5">Related tools</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-12">
                  {related.map((r) => (
                    <li key={r.slug} className="border-l-2 border-border pl-4">
                      <Link href={`/toolbox/${r.slug}`} className="font-sans font-semibold text-white hover:text-accent-primary transition-colors">{r.h1}</Link>
                      <p className="text-text-body text-sm leading-relaxed mt-1">{r.description}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <h2 className="font-sans text-lg font-semibold text-white mb-4">Everything in the toolbox</h2>
            <ul className="flex flex-wrap gap-2">
              {more.map((p) => (
                <li key={p.slug}>
                  <Link href={`/toolbox/${p.slug}`} className="inline-block font-mono text-[0.62rem] tracking-[0.06em] uppercase rounded-full px-3 py-1.5 border border-border text-text-secondary hover:text-white hover:border-accent-primary transition-colors no-underline">
                    {p.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
