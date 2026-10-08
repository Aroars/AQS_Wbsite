import Link from "next/link";

interface BreadcrumbProps {
  /** Intermediate crumbs between Conveyors and the current page (e.g. the family) */
  trail?: { label: string; href: string }[];
  current: string;
  /** "dark" inside a photo hero (a brand-navy band in both themes); "light" on the page ground */
  tone?: "light" | "dark";
}

const tones = {
  light: {
    link: "text-text-dim hover:text-text-strong transition-colors",
    sep: "text-text-dim/40 mx-2",
    current: "text-text-body",
  },
  dark: {
    link: "text-brand-steel hover:text-white transition-colors",
    sep: "text-white/20 mx-2",
    current: "text-[#CBD5E1]",
  },
};

export function ConveyorBreadcrumb({ trail = [], current, tone = "light" }: BreadcrumbProps) {
  const t = tones[tone];
  const sep = <span className={t.sep}>/</span>;
  return (
    <nav aria-label="Breadcrumb" className="font-mono text-[0.68rem] tracking-[0.1em] uppercase mb-4">
      <Link href="/solutions/conveyors" className={t.link}>
        Conveyors
      </Link>
      {trail.map((tr) => (
        <span key={tr.href}>
          {sep}
          <Link href={tr.href} className={t.link}>
            {tr.label}
          </Link>
        </span>
      ))}
      {sep}
      <span className={t.current}>{current}</span>
    </nav>
  );
}
