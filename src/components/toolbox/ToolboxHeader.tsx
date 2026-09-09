"use client";

import { useRef } from "react";
import { Wrench, Search, ChevronUp } from "lucide-react";
import { useSnapBarrier } from "./useSnapBarrier";

const isMac = typeof navigator !== "undefined" && /Mac|iP/.test(navigator.platform);

/**
 * The toolbox title strip: wrench, title, and the ⌘K jump button. The page's
 * intro section above it (ToolboxIntro) carries the H1 and the help copy.
 * The strip is also the scroll-snap target: it docks under the site nav and
 * holds there until the user scrolls up enough to bring the intro back.
 */
export function ToolboxHeader() {
  const stripRef = useRef<HTMLDivElement>(null);
  const progress = useSnapBarrier(stripRef);

  return (
    <div ref={stripRef} id="toolbox-strip" className="toolbox-scope toolbox-snap-target">
      <header className="relative border-b border-border bg-dark-800">
        {/* Release cue: fills as upward scroll accumulates against the barrier */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 h-[2px] bg-primary transition-[width] duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
        <div className="px-4 md:px-6 py-2.5 flex items-center gap-3">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Wrench className="w-5 h-5 text-primary" />
          </div>
          <div className="text-base md:text-lg font-semibold text-text-primary leading-tight m-0">
            Engineering Toolbox
          </div>
          <div className="flex-1 flex justify-center">
            <span
              aria-live="polite"
              className={`hidden md:inline-flex items-center gap-1 text-xs text-text-muted transition-opacity duration-200 ${
                progress > 0 ? "opacity-100" : "opacity-0"
              }`}
            >
              <ChevronUp className="w-3.5 h-3.5" />
              Keep scrolling to bring the intro back
            </span>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("toolbox:open-palette"))}
            title="Jump to any tool"
            className="flex items-center gap-2 px-3 py-1.5 bg-dark-900 border border-border rounded-lg text-text-muted hover:text-text-secondary hover:border-text-muted transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="text-xs hidden sm:inline">Jump to...</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 bg-dark-700 border border-border rounded">{isMac ? "⌘K" : "Ctrl K"}</kbd>
          </button>
        </div>
      </header>
    </div>
  );
}
