"use client";

import Link from "next/link";
import { CONVEYOR_ACCENT, categories } from "@/data/conveyors";

const accent = CONVEYOR_ACCENT;

/**
 * Family tabs (Belt / MDR / Pallet) plus the types in the current family.
 * On the family page the type pills scroll in place; on a type page they
 * link back to the family page's anchors and the current type is marked.
 */
export function ConveyorFamilyNav({
  currentFamily,
  currentType,
  onFamilyPage = true,
}: {
  currentFamily: string;
  currentType?: string;
  onFamilyPage?: boolean;
}) {
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
            {onFamilyPage ? "On this page:" : `${family.shortTitle} types:`}
          </span>
          {family.types.map((type) => {
            const active = type.slug === currentType;
            const href = onFamilyPage ? `#${type.slug}` : `/solutions/conveyors/${family.slug}#${type.slug}`;
            return (
              <a
                key={type.slug}
                href={href}
                aria-current={active ? "page" : undefined}
                className="font-mono text-[0.62rem] tracking-[0.06em] uppercase rounded-full px-3 py-1.5 no-underline transition-all duration-200 hover:text-white"
                style={{
                  color: active ? "#fff" : accent,
                  background: active ? `${accent}33` : `${accent}14`,
                  border: `1px solid ${active ? accent : `${accent}55`}`,
                }}
              >
                {type.shortTitle}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
