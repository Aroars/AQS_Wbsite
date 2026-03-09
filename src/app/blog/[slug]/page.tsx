import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { blogPosts, getBlogPost, getRelatedPosts } from "@/content/blog";

import PostWhatIsPackagingScada from "@/components/blog/post-what-is-packaging-scada";
import PostMagDriveVsConventionalGearbox from "@/components/blog/post-mag-drive-vs-conventional-gearbox";
import PostMechanicalVsVisionLeakDetection from "@/components/blog/post-mechanical-vs-vision-leak-detection";

const contentComponents: Record<string, React.ComponentType> = {
  "what-is-packaging-scada": PostWhatIsPackagingScada,
  "mag-drive-vs-conventional-gearbox": PostMagDriveVsConventionalGearbox,
  "mechanical-vs-vision-leak-detection": PostMechanicalVsVisionLeakDetection,
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} | AQS Blog`,
    description: post.description,
    openGraph: {
      title: `${post.title} | AQS Blog`,
      description: post.description,
      url: `https://www.automatedqs.com/blog/${post.slug}`,
      siteName: "Automated Quality Solutions",
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const ContentComponent = contentComponents[post.slug];
  if (!ContentComponent) notFound();

  const relatedPosts = getRelatedPosts(post.slug);

  return (
    <>
      <Navigation />

      {/* Breadcrumb */}
      <div className="pt-28 pb-4 px-6">
        <nav className="max-w-[720px] mx-auto flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[rgba(255,255,255,0.3)]">
          <Link
            href="/"
            className="hover:text-accent-primary transition-colors"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            href="/blog"
            className="hover:text-accent-primary transition-colors"
          >
            Blog
          </Link>
          <span>/</span>
          <span className="text-[rgba(255,255,255,0.5)] truncate max-w-[200px] sm:max-w-none">
            {post.title}
          </span>
        </nav>
      </div>

      {/* Hero / Header */}
      <header className="relative px-6 pt-6 pb-14">
        {/* Glow orb */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,194,255,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-[720px] mx-auto">
          {/* Category badge */}
          <span
            className="inline-block font-mono text-[0.58rem] uppercase tracking-[0.12em] px-2.5 py-1 rounded-full mb-5"
            style={{
              color: post.categoryColor,
              backgroundColor: `${post.categoryColor}15`,
              border: `1px solid ${post.categoryColor}30`,
            }}
          >
            {post.category}
          </span>

          <h1 className="font-sans text-white font-extrabold text-[clamp(1.6rem,3.5vw,2.4rem)] leading-[1.2] mb-5">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-[rgba(255,255,255,0.35)]">
            <span>{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.2)]" />
            <span>{post.readTime} read</span>
          </div>
        </div>
      </header>

      {/* Divider */}
      <div className="max-w-[720px] mx-auto px-6">
        <div className="h-px bg-[rgba(255,255,255,0.08)]" />
      </div>

      {/* Article Content */}
      <section className="px-6 pt-10 pb-16">
        <ContentComponent />
      </section>

      {/* CTA */}
      <section className="px-6 pb-16">
        <div className="max-w-[720px] mx-auto rounded-[16px] border border-[rgba(0,0,0,0.25)] bg-[rgba(0,0,0,0.28)] p-8 sm:p-10 text-center">
          <h2 className="text-white font-bold text-[1.15rem] mb-3">
            Ready to discuss your packaging line?
          </h2>
          <p className="text-[rgba(255,255,255,0.45)] text-[0.88rem] leading-[1.6] mb-6 max-w-md mx-auto">
            Our engineers can help you evaluate options and design a system that
            fits your production environment.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-primary text-[#1a1d2b] font-semibold text-[0.85rem] hover:brightness-110 transition-all duration-200"
          >
            Get a Quote
            <span>&rarr;</span>
          </Link>
        </div>
      </section>

      {/* Related Posts */}
      <section className="px-6 pb-24">
        <div className="max-w-[720px] mx-auto">
          <h2 className="font-mono text-[0.62rem] uppercase tracking-[0.15em] text-accent-primary mb-6">
            RELATED ARTICLES
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="group block rounded-[14px] border border-[rgba(0,0,0,0.25)] bg-[rgba(0,0,0,0.28)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(0,194,255,0.2)] hover:bg-[rgba(0,0,0,0.42)]"
              >
                <span
                  className="inline-block font-mono text-[0.52rem] uppercase tracking-[0.12em] px-2 py-0.5 rounded-full mb-3"
                  style={{
                    color: related.categoryColor,
                    backgroundColor: `${related.categoryColor}15`,
                    border: `1px solid ${related.categoryColor}30`,
                  }}
                >
                  {related.category}
                </span>

                <h3 className="text-white font-semibold text-[0.9rem] leading-[1.4] mb-2 group-hover:text-accent-primary transition-colors duration-200">
                  {related.title}
                </h3>

                <div className="flex items-center gap-2 text-[rgba(255,255,255,0.28)] font-mono text-[0.52rem] uppercase tracking-[0.1em]">
                  <span>{related.date}</span>
                  <span className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.15)]" />
                  <span>{related.readTime} read</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
