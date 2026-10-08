import Link from "next/link";

interface BreadcrumbProps {
  current: string;
}

export function VeriPakBreadcrumb({ current }: BreadcrumbProps) {
  return (
    <nav className="font-mono text-[0.68rem] tracking-[0.1em] uppercase mb-4">
      <Link
        href="/solutions/veripak"
        className="text-accent-text hover:text-text-strong transition-colors"
      >
        VeriPak
      </Link>
      <span className="text-text-dim mx-2">/</span>
      <span className="text-text-body">{current}</span>
    </nav>
  );
}
