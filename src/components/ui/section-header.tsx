import { type ReactNode } from "react";

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="font-mono text-[0.68rem] text-accent-primary tracking-[0.15em] uppercase mb-3">
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`font-sans text-[clamp(2rem,4vw,3rem)] font-extrabold text-white mb-4 leading-[1.1] ${className}`}
    >
      {children}
    </h2>
  );
}

export function SectionDesc({ children }: { children: ReactNode }) {
  return (
    <p className="font-sans text-[1.02rem] text-text-body max-w-[640px] leading-[1.7] mb-12">
      {children}
    </p>
  );
}
