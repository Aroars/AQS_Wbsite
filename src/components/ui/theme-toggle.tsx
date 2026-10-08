"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/* Light/dark switch for the nav. Renders a same-size placeholder until
   mounted so the server and client markup agree (the theme is only known
   on the client). */

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <span className={`inline-block h-10 w-[76px] ${className}`} aria-hidden />;

  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className={`inline-flex h-10 items-center gap-2 rounded-lg border border-border px-3 font-sans text-[13px] font-semibold text-text-nav transition-colors hover:text-text-strong hover:border-accent-text ${className}`}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
      <span>{dark ? "Light" : "Dark"}</span>
    </button>
  );
}
