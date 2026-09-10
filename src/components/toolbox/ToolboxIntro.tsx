"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/toolbox/stores/appStore";
import { tabHelp } from "@/toolbox/lib/toolHelp";
import type { ToolPage } from "@/toolbox/lib/toolSeo";

const NOTE =
  "Free, no login. Your inputs are saved in this browser. Values are engineering references — verify against manufacturer data and applicable codes before a final design.";

const EYEBROW = "font-mono text-[0.62rem] tracking-[0.12em] uppercase text-accent-primary";

type Props =
  /** A tool's own page: the server passes the page copy; nothing changes after mount */
  | { mode: "tool"; page: ToolPage; toolLabel: string }
  /** The hub: the current tab's help, in the same layout, following the active tab */
  | { mode: "tab" };

/**
 * The one intro section above the toolbox. Same background, type, and rhythm
 * on every toolbox page, so the hub's per-tab help reads exactly like a tool
 * page's header rather than a panel bolted onto the title strip.
 */
export function ToolboxIntro(props: Props) {
  return props.mode === "tool" ? <ToolIntro page={props.page} toolLabel={props.toolLabel} /> : <TabIntro />;
}

function Shell({ crumb, heading, children, product }: { crumb: React.ReactNode; heading: string; children: React.ReactNode; product?: { href: string; label: string } }) {
  return (
    <section className="px-6 pt-10 pb-8 md:pt-14 md:pb-10">
      <div className="mx-auto max-w-5xl">
        <nav className="font-mono text-[0.58rem] tracking-[0.12em] uppercase mb-3 text-text-dim">{crumb}</nav>
        <h1 className="font-sans text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold text-white mb-4">{heading}</h1>
        {children}
        <p className="text-text-dim text-xs mt-4">{NOTE}</p>
        {product && (
          <p className="text-text-body text-sm mt-3">
            Built by the engineers behind{" "}
            <Link href={product.href} className="text-accent-primary hover:underline">{product.label}</Link>.
          </p>
        )}
      </div>
    </section>
  );
}

function Crumb({ trail, linkHome }: { trail: string; linkHome: boolean }) {
  return (
    <>
      {linkHome ? (
        <Link href="/toolbox" className="text-accent-primary hover:underline">Engineering Toolbox</Link>
      ) : (
        <span className="text-accent-primary">Engineering Toolbox</span>
      )}
      <span className="mx-2 text-white/20">/</span>
      <span>{trail}</span>
    </>
  );
}

function ToolIntro({ page, toolLabel }: { page: ToolPage; toolLabel: string }) {
  return (
    <Shell crumb={<Crumb trail={toolLabel} linkHome />} heading={page.h1} product={page.product}>
      {page.intro.map((p, i) => (
        <p key={i} className="text-text-body text-base md:text-lg max-w-3xl leading-relaxed mb-4">{p}</p>
      ))}
      {page.howItWorks && page.howItWorks.length > 0 && (
        <details className="mt-2 max-w-3xl" open>
          <summary className={`${EYEBROW} cursor-pointer select-none`}>How it works</summary>
          <ul className="mt-3 space-y-2 text-text-body text-sm leading-relaxed list-disc pl-5">
            {page.howItWorks.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </details>
      )}
    </Shell>
  );
}

function TabIntro() {
  const activeTab = useAppStore((s) => s.activeTab);
  // The server (and the first client paint) show the Home tab; the persisted
  // tab takes over after mount so the markup never mismatches on hydration.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const help = tabHelp[mounted ? activeTab : "home"];

  return (
    <Shell crumb={<Crumb trail={`${help.title} tab`} linkHome={false} />} heading="Engineering Toolbox">
      <p className="text-text-body text-base md:text-lg max-w-3xl leading-relaxed mb-4">{help.description}</p>

      {help.tips.length > 0 && (
        <details className="mt-2 max-w-3xl" open>
          <summary className={`${EYEBROW} cursor-pointer select-none`}>How it works</summary>
          <ul className="mt-3 space-y-2 text-text-body text-sm leading-relaxed list-disc pl-5">
            {help.tips.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </details>
      )}

      {help.tools.length > 0 && (
        <div className="mt-6 max-w-3xl">
          <div className={`${EYEBROW} mb-3`}>How to use</div>
          <div className="space-y-3">
            {help.tools.map((tool) => (
              <details key={tool.id} className="group border-l-2 border-border pl-4">
                <summary className="cursor-pointer select-none">
                  <span className="font-sans font-semibold text-white group-open:text-accent-primary transition-colors">{tool.label}</span>
                  <span className="block text-text-body text-sm leading-relaxed mt-0.5">{tool.summary}</span>
                </summary>
                <ol className="mt-3 space-y-2 text-text-body text-sm leading-relaxed list-decimal pl-5">
                  {tool.steps.map((s, i) => <li key={i}>{s}</li>)}
                </ol>
                {tool.notes && tool.notes.length > 0 && (
                  <ul className="mt-2 space-y-1 text-text-dim text-xs leading-relaxed list-disc pl-5">
                    {tool.notes.map((n, i) => <li key={i}>{n}</li>)}
                  </ul>
                )}
                <a href={`#tool-${tool.id}`} className={`${EYEBROW} inline-block mt-3 hover:underline`}>
                  Open {tool.label}
                </a>
              </details>
            ))}
          </div>
        </div>
      )}
    </Shell>
  );
}
