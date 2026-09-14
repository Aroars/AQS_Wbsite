import Link from "next/link";

interface BreadcrumbProps {
  /** Intermediate crumbs between Conveyors and the current page (e.g. the family) */
  trail?: { label: string; href: string }[];
  current: string;
}

const linkCls = "text-[#94A3B8] hover:text-white transition-colors";
const sep = <span className="text-white/20 mx-2">/</span>;

export function ConveyorBreadcrumb({ trail = [], current }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="font-mono text-[0.68rem] tracking-[0.1em] uppercase mb-4">
      <Link href="/solutions/conveyors" className={linkCls}>
        Conveyors
      </Link>
      {trail.map((t) => (
        <span key={t.href}>
          {sep}
          <Link href={t.href} className={linkCls}>
            {t.label}
          </Link>
        </span>
      ))}
      {sep}
      <span className="text-white/50">{current}</span>
    </nav>
  );
}
