import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { blogPosts } from "@/content/blog";

export const metadata: Metadata = {
  title: "Blog | Packaging Automation Insights | AQS",
  description:
    "White papers and technical articles on packaging quality platforms, sanitary conveyor design, inspection, and leak detection from the AQS engineering team.",
  openGraph: {
    title: "Blog | Packaging Automation Insights | AQS",
    description:
      "White papers and technical articles on packaging quality platforms, sanitary conveyor design, inspection, and leak detection from the AQS engineering team.",
    url: "https://automatedqs.com/blog",
    siteName: "Automated Quality Solutions",
    type: "website",
  },
};

export default function BlogPage() {
  return (
    <>
      <Navigation />

      {/* Hero */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.15em] text-accent-text mb-4 block">
            INSIGHTS &amp; RESOURCES
          </span>
          <h1 className="font-sans text-text-strong font-extrabold text-[clamp(2rem,4vw,3rem)] leading-[1.15] mb-5">
            The AQS Blog
          </h1>
          <p className="text-text-body text-[0.95rem] leading-[1.7] max-w-2xl mx-auto">
            White papers, project write-ups, and practical guidance for
            packaging line automation — from the engineers who build the systems.
          </p>
        </div>
      </section>

      {/* Card Grid */}
      <section className="px-6 pb-28">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-[16px] border border-border bg-surface-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent-text/30 hover:bg-surface-card-hover"
            >
              {/* Category badge */}
              <span
                className="inline-block font-mono text-[0.58rem] uppercase tracking-[0.12em] px-2.5 py-1 rounded-full mb-4 text-accent-text"
                style={{
                  backgroundColor: `${post.categoryColor}15`,
                  border: `1px solid ${post.categoryColor}30`,
                }}
              >
                {post.category}
              </span>

              {/* Title */}
              <h2 className="text-text-strong font-bold text-[1.05rem] leading-[1.4] mb-3 group-hover:text-accent-text transition-colors duration-200">
                {post.title}
              </h2>

              {/* Excerpt */}
              <p className="text-text-body text-[0.82rem] leading-[1.6] mb-5 line-clamp-3">
                {post.description}
              </p>

              {/* Date & Read Time */}
              <div className="flex items-center gap-3 text-text-dim font-mono text-[0.58rem] uppercase tracking-[0.1em]">
                <span>{post.date}</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>{post.readTime} read</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
