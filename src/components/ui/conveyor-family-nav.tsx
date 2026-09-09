"use client";

import Link from "next/link";
import { CONVEYOR_ACCENT, categories } from "@/data/conveyors";

const accent = CONVEYOR_ACCENT;

/**
 * Family tabs (Belt / MDR / Pallet) plus the types on the current family page.
 * Types scroll in place; families are real pages.
 */
export function ConveyorFamilyNav({ currentFamily }: { currentFamily: string }) {
  const family = categories.find((c) => c.slug === currentFamily);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-text-dim mr-1">
          Family:
        </span>
        {categories.map((cat) => {
          const active = cat.slug === currentFamily;
          return (
            <Link
              key={cat.slug}
              href={`/solutions/conveyors/${cat.slug}`}
              className="font-sans text-[0.8rem] font-semibold rounded-lg px-3.5 py-1.5 no-underline transition-all duration-200"
              style={{
                color: active ? "#fff" : "rgba(255,255,255,0.6)",
                background: active ? `${accent}22` : "rgba(255,255,255,0.03)",
                border: `1px solid ${active ? accent : "rgba(255,255,255,0.1)"}`,
              }}
            >
              {cat.shortTitle}
            </Link>
          );
        })}
      </div>
      {family && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-text-dim mr-1">
            On this page:
          </span>
          {family.types.map((type) => (
            <a
              key={type.slug}
              href={`#${type.slug}`}
              className="font-mono text-[0.62rem] tracking-[0.06em] uppercase rounded-full px-3 py-1.5 no-underline transition-all duration-200 hover:text-white"
              style={{ color: accent, background: `${accent}14`, border: `1px solid ${accent}55` }}
            >
              {type.shortTitle}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
