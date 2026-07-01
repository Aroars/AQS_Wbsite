"use client";

import Link from "next/link";
import { CONVEYOR_ACCENT, categories } from "@/data/conveyors";

const accent = CONVEYOR_ACCENT;

/**
 * Pill strip listing all conveyor types across every category.
 * Types on the current category page anchor-scroll in place;
 * types from other categories deep-link across pages.
 */
export function ConveyorTypeSwitcher({
  currentCategory,
}: {
  currentCategory: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-text-dim mr-1">
        Jump to type:
      </span>
      {categories.map((cat) =>
        cat.types.map((type) => {
          const onPage = cat.slug === currentCategory;
          const href = onPage
            ? `#${type.slug}`
            : `/solutions/conveyors/${cat.slug}#${type.slug}`;
          return (
            <Link
              key={type.slug}
              href={href}
              className="font-mono text-[0.62rem] tracking-[0.06em] uppercase rounded-full px-3 py-1.5 no-underline transition-all duration-200 hover:text-white"
              style={{
                color: onPage ? accent : "rgba(255,255,255,0.45)",
                background: onPage ? `${accent}14` : "rgba(255,255,255,0.03)",
                border: `1px solid ${onPage ? `${accent}55` : "rgba(255,255,255,0.08)"}`,
              }}
            >
              {type.shortTitle}
            </Link>
          );
        })
      )}
    </div>
  );
}
