"use client";

import { useState } from "react";
import Link from "next/link";
import { CONVEYOR_ACCENT, categories } from "@/data/conveyors";
import { getTypePage } from "@/data/conveyor-type-pages";
import { choose, productOptions, roomOptions, type ProductKind, type RoomKind } from "@/data/conveyor-chooser";

const accent = CONVEYOR_ACCENT;

function Pill({ active, onClick, label, hint }: { active: boolean; onClick: () => void; label: string; hint: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="text-left rounded-lg px-3.5 py-2.5 transition-all duration-200"
      style={{
        background: active ? `${accent}22` : "rgba(255,255,255,0.03)",
        border: `1px solid ${active ? accent : "rgba(255,255,255,0.1)"}`,
      }}
    >
      <div className="font-sans text-[0.85rem] font-semibold" style={{ color: active ? "#fff" : "rgba(255,255,255,0.75)" }}>
        {label}
      </div>
      <div className="font-sans text-[0.7rem] text-text-dim">{hint}</div>
    </button>
  );
}

/**
 * Two questions — what are you moving, and in what room — that route a
 * visitor to the two to four conveyor types that fit. Runs entirely on the
 * data in conveyor-chooser.ts; links go to a type page when one exists.
 */
export function ConveyorChooser() {
  const [product, setProduct] = useState<ProductKind | null>(null);
  const [room, setRoom] = useState<RoomKind | null>(null);
  const result = product && room ? choose(product, room) : null;

  return (
    <div className="rounded-xl p-6 md:p-8 bg-[rgba(17,34,64,0.5)] border border-white/[0.06]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="font-mono text-[0.58rem] tracking-[0.12em] uppercase mb-3" style={{ color: accent }}>
            1 · What are you moving?
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
            {productOptions.map((o) => (
              <Pill key={o.id} active={product === o.id} onClick={() => setProduct(o.id)} label={o.label} hint={o.hint} />
            ))}
          </div>
        </div>
        <div>
          <div className="font-mono text-[0.58rem] tracking-[0.12em] uppercase mb-3" style={{ color: accent }}>
            2 · What room does it run in?
          </div>
          <div className="grid grid-cols-3 gap-2">
            {roomOptions.map((o) => (
              <Pill key={o.id} active={room === o.id} onClick={() => setRoom(o.id)} label={o.label} hint={o.hint} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/[0.06]" aria-live="polite">
        {!result ? (
          <p className="font-sans text-[0.84rem] text-text-dim m-0">
            Pick one from each row and the types that fit appear here — or browse the three families below.
          </p>
        ) : (
          <>
            <div className="font-mono text-[0.58rem] tracking-[0.12em] uppercase mb-3" style={{ color: accent }}>
              Start with these
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-none p-0 m-0">
              {result.picks.map((p) => {
                const family = categories.find((c) => c.slug === p.family)!;
                const type = family.types.find((t) => t.slug === p.typeSlug)!;
                const page = getTypePage(p.family, p.typeSlug);
                const href = page?.href ?? `/solutions/conveyors/${p.family}#${p.typeSlug}`;
                return (
                  <li key={`${p.family}-${p.typeSlug}`}>
                    <Link href={href} className="block rounded-lg px-4 py-3 no-underline border border-white/[0.08] bg-black/20 hover:border-[#94A3B8]/60 transition-colors group">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-[0.56rem] tracking-[0.1em] uppercase" style={{ color: accent }}>
                          {family.shortTitle}
                        </span>
                        <span className="font-sans text-[0.92rem] font-semibold text-white group-hover:text-[#cbd5e1] transition-colors">
                          {type.title}
                        </span>
                      </div>
                      <div className="font-sans text-[0.78rem] text-text-body mt-1">{p.why}</div>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p className="font-sans text-[0.78rem] text-text-dim mt-4 mb-0">{result.note}</p>
          </>
        )}
      </div>
    </div>
  );
}
