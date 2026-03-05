import Link from "next/link";

interface BreadcrumbProps {
  current: string;
}

export function VeriPakBreadcrumb({ current }: BreadcrumbProps) {
  return (
    <nav className="font-mono text-[0.68rem] tracking-[0.1em] uppercase mb-4">
      <Link
        href="/solutions/veripak"
        className="text-accent-primary hover:text-white transition-colors"
      >
        VeriPak
      </Link>
      <span className="text-white/20 mx-2">/</span>
      <span className="text-white/50">{current}</span>
    </nav>
  );
}
