"use client";

import dynamic from "next/dynamic";

/**
 * Client-only mount for the Engineering Toolbox. The app hydrates its state
 * from localStorage (zustand persist), so it must never render on the server —
 * otherwise the server's empty defaults would mismatch the user's saved work.
 */
const ToolboxApp = dynamic(() => import("@/toolbox/ToolboxApp"), {
  ssr: false,
  loading: () => (
    <div
      id="toolbox-app"
      className="min-h-[80vh] bg-dark-900 flex items-center justify-center"
      aria-busy="true"
    >
      <div className="flex items-center gap-3 text-text-muted font-mono text-xs tracking-[0.12em] uppercase">
        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
        Loading toolbox
      </div>
    </div>
  ),
});

export function ToolboxLoader() {
  return <ToolboxApp />;
}
