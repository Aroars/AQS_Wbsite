import Image from "next/image";
import { partners } from "@/content/solutions";

/* Logos read as gray on the light ground and as inverted white on dark
   (the --logo-filter / --logo-opacity tokens in globals.css). */
export function PartnersBar() {
  return (
    <section className="py-8 px-8 border-b border-border overflow-hidden">
      <div className="max-w-[1280px] mx-auto flex items-center justify-center gap-10 flex-wrap">
        <span className="font-mono text-[0.75rem] text-text-dim tracking-[0.14em] uppercase">
          Trusted Partners
        </span>
        {partners.map((p) => (
          <div
            key={p.name}
            className="relative h-[28px] shrink-0 group"
            style={{ width: Math.round((p.width / p.height) * 28) }}
          >
            <Image
              src={p.logo!}
              alt={`${p.name} — AQS technology partner`}
              fill
              className="object-contain transition-opacity duration-300 group-hover:opacity-100"
              style={{ filter: "var(--logo-filter)", opacity: "var(--logo-opacity)" }}
              sizes="120px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
