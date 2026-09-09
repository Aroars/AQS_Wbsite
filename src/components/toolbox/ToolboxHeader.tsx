"use client";

import { useEffect, useState } from "react";
import { Wrench, Search, ChevronDown } from "lucide-react";
import { useAppStore } from "@/toolbox/stores/appStore";
import { tabHelp } from "@/toolbox/lib/toolHelp";

const isMac = typeof navigator !== "undefined" && /Mac|iP/.test(navigator.platform);

/**
 * The toolbox title strip: wrench, title, a Help chevron that expands a panel
 * for the current tab, and the ⌘K jump button. Server-rendered (it is the
 * hub page's H1); the tab-specific panel renders only after mount because the
 * active tab comes from the persisted store.
 */
export function ToolboxHeader({ titleAs = "div" }: { titleAs?: "h1" | "div" }) {
  const activeTab = useAppStore((s) => s.activeTab);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const help = mounted ? tabHelp[activeTab] : null;
  const Title = titleAs;

  return (
    <div className="toolbox-scope">
      <header className="border-b border-border bg-dark-800">
        <div className="px-4 md:px-6 py-2.5 flex items-center gap-3">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Wrench className="w-5 h-5 text-primary" />
          </div>
          <Title className="text-base md:text-lg font-semibold text-text-primary leading-tight m-0">
            Engineering Toolbox
          </Title>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            title="How to use this tab"
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs border transition-colors ${
              open ? "border-primary/50 text-primary bg-primary/10" : "border-border text-text-muted hover:text-text-secondary hover:border-text-muted"
            }`}
          >
            <span className="hidden sm:inline">Help{help ? ` · ${help.title}` : ""}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          <div className="flex-1" />
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

        {open && help && (
          <div className="px-4 md:px-6 pb-4 border-t border-border/60">
            <div className="max-w-5xl pt-3">
              <div className="text-xs text-text-muted uppercase tracking-wider mb-1">{help.title} tab</div>
              <p className="text-sm text-text-secondary leading-relaxed mb-3">{help.description}</p>
              {help.tips.length > 0 && (
                <ul className="mb-3 space-y-1 text-xs text-text-secondary list-disc pl-5">
                  {help.tips.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              )}
              {help.tools.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-xs text-text-muted uppercase tracking-wider">How to use</div>
                  {help.tools.map((tool) => (
                    <details key={tool.id} className="rounded-lg border border-border bg-dark-900/50 px-3 py-2">
                      <summary className="cursor-pointer select-none text-sm text-text-primary">
                        {tool.label}
                        <span className="block sm:inline sm:ml-2 text-xs text-text-muted font-normal">{tool.summary}</span>
                      </summary>
                      <ol className="mt-2 space-y-1.5 text-xs text-text-secondary leading-relaxed list-decimal pl-5">
                        {tool.steps.map((s, i) => <li key={i}>{s}</li>)}
                      </ol>
                      {tool.notes && tool.notes.length > 0 && (
                        <ul className="mt-2 space-y-1 text-[11px] text-text-muted list-disc pl-5">
                          {tool.notes.map((n, i) => <li key={i}>{n}</li>)}
                        </ul>
                      )}
                    </details>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
