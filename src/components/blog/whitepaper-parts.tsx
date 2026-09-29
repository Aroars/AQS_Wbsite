import Image from "next/image";
import type { ReactNode } from "react";

/*
 * Building blocks for white paper posts: the same 720 px article column as
 * the other blog posts, plus the pieces a white paper needs that an opinion
 * post does not — spec tables, figures with captions, numbered cycles, a
 * pull-out callout, and the PDF download.
 */

export function Article({ children }: { children: ReactNode }) {
  return <article className="max-w-[720px] mx-auto text-[0.95rem] leading-[1.8] text-[rgba(255,255,255,0.55)]">{children}</article>;
}

/** The italic standfirst under the title */
export function Lead({ children }: { children: ReactNode }) {
  return <p className="mb-8 text-[1.05rem] leading-[1.7] italic text-[rgba(255,255,255,0.7)]">{children}</p>;
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-white font-bold text-[1.25rem] mb-4 mt-10">{children}</h2>;
}

export function P({ children }: { children: ReactNode }) {
  return <p className="mb-4">{children}</p>;
}

export function B({ children }: { children: ReactNode }) {
  return <strong className="text-white">{children}</strong>;
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mb-6 space-y-2 list-none p-0">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="text-accent-primary shrink-0 mt-[0.1rem]">&#9656;</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** A named sequence: Stage, Tare, Fill … */
export function Steps({ items }: { items: { name: string; body: ReactNode }[] }) {
  return (
    <ol className="mb-6 space-y-3 list-none p-0">
      {items.map((s, i) => (
        <li key={s.name} className="flex gap-4 rounded-[12px] border border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.22)] px-4 py-3">
          <span className="font-mono text-[0.7rem] text-accent-primary shrink-0 mt-[0.35rem]">{String(i + 1).padStart(2, "0")}</span>
          <span>
            <strong className="text-white">{s.name}.</strong> {s.body}
          </span>
        </li>
      ))}
    </ol>
  );
}

/** "The short version" / "Why it pays" pull-out */
export function Callout({ label, children }: { label: string; children: ReactNode }) {
  return (
    <aside className="my-6 rounded-[14px] border border-[rgba(0,194,255,0.18)] bg-[rgba(0,194,255,0.05)] px-5 py-4">
      <div className="font-mono text-[0.58rem] uppercase tracking-[0.15em] text-accent-primary mb-1.5">{label}</div>
      <div className="text-[rgba(255,255,255,0.8)] leading-[1.7]">{children}</div>
    </aside>
  );
}

/** Two or three column table; scrolls sideways on a phone rather than squeezing */
export function SpecTable({ head, rows }: { head?: string[]; rows: string[][] }) {
  return (
    <div className="my-6 overflow-x-auto rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.25)]">
      <table className={`w-full border-collapse text-left text-[0.84rem] leading-[1.55] ${rows[0]?.length > 2 ? "min-w-[620px]" : ""}`}>
        {head && (
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.1)]">
              {head.map((h) => (
                <th key={h} scope="col" className="px-4 py-2.5 font-mono text-[0.58rem] uppercase tracking-[0.1em] font-normal text-accent-primary">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-t border-[rgba(255,255,255,0.06)] align-top">
              <th scope="row" className="px-4 py-2.5 font-semibold text-white w-[32%]">
                {r[0]}
              </th>
              {r.slice(1).map((c, i) => (
                <td key={i} className="px-4 py-2.5">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Photo or render with a caption. `light` puts a white-background render on a light tile. */
export function Figure({
  src, alt, caption, width, height, light = false, priority = false, narrow = false,
}: {
  src: string; alt: string; caption?: ReactNode; width: number; height: number; light?: boolean; priority?: boolean; narrow?: boolean;
}) {
  return (
    <figure className={`my-8 mx-auto ${narrow ? "max-w-[380px]" : ""}`}>
      <div className={`rounded-[14px] overflow-hidden border border-[rgba(255,255,255,0.08)] ${light ? "bg-[#f3f5f7] p-3" : ""}`}>
        <Image src={src} alt={alt} width={width} height={height} priority={priority} sizes="(max-width: 768px) 100vw, 720px" className="w-full h-auto block" />
      </div>
      {caption && <figcaption className="mt-2 text-[0.78rem] leading-[1.55] text-[rgba(255,255,255,0.4)]">{caption}</figcaption>}
    </figure>
  );
}

/** The laid-out PDF of the same paper */
export function PdfDownload({ href, title, pages }: { href: string; title: string; pages?: string }) {
  return (
    <div className="my-8 flex flex-col sm:flex-row sm:items-center gap-4 rounded-[14px] border border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.28)] px-5 py-4">
      <div className="flex-1">
        <div className="font-mono text-[0.58rem] uppercase tracking-[0.15em] text-accent-primary mb-1">White paper · PDF</div>
        <div className="text-white font-semibold text-[0.95rem] leading-[1.4]">{title}</div>
        {pages && <div className="text-[0.78rem] text-[rgba(255,255,255,0.4)]">{pages}</div>}
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-accent-primary text-[#1a1d2b] font-semibold text-[0.82rem] hover:brightness-110 transition-all duration-200 no-underline shrink-0"
      >
        Download the PDF <span>&darr;</span>
      </a>
    </div>
  );
}

/** Closing line shared by every paper */
export function Closing({ children }: { children: ReactNode }) {
  return <p className="mb-4 italic text-[rgba(255,255,255,0.45)]">{children}</p>;
}
