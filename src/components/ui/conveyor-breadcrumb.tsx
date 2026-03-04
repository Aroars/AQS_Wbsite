import Link from "next/link";

interface BreadcrumbProps {
  current: string;
}

export function ConveyorBreadcrumb({ current }: BreadcrumbProps) {
  return (
    <nav className="font-mono text-[0.68rem] tracking-[0.1em] uppercase mb-4">
      <Link
        href="/solutions/conveyors"
        className="text-[#94A3B8] hover:text-white transition-colors"
      >
        Conveyors
      </Link>
      <span className="text-white/20 mx-2">/</span>
      <span className="text-white/50">{current}</span>
    </nav>
  );
}
