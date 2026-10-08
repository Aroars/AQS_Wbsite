"use client";

import { useState, useEffect } from "react";

export const CONSENT_KEY = "aqs_cookie_consent";
export const CONSENT_EVENT = "aqs:consent";
export type ConsentValue = "accepted" | "declined";

/** The stored choice, or null before the visitor has answered (safe during SSR) */
export function readConsent(): ConsentValue | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "accepted" || v === "declined" ? v : null;
  } catch {
    return null;
  }
}

function writeConsent(value: ConsentValue) {
  localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent<ConsentValue>(CONSENT_EVENT, { detail: value }));
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept() {
    writeConsent("accepted");
    setVisible(false);
  }

  function decline() {
    writeConsent("declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
      style={{ animation: "slideUp 0.4s ease-out" }}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <div
        className="max-w-[960px] mx-auto rounded-xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{
          background: "var(--surface-card)",
          border: "1px solid var(--border)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 -4px 30px rgba(10,22,40,0.14)",
        }}
      >
        <div className="flex-1">
          <div className="font-sans text-[0.92rem] font-bold text-text-strong mb-1.5">
            We value your privacy
          </div>
          <p className="font-sans text-[0.82rem] leading-[1.6] text-text-body">
            We use cookies to analyze site traffic and improve your experience. Essential cookies are
            required for the site to function. Analytics cookies help us understand how you interact
            with our content.{" "}
            <a href="/cookie-policy" className="text-accent-text hover:underline">
              Cookie Policy
            </a>
          </p>
        </div>
        <div className="flex gap-2.5 shrink-0">
          <button
            onClick={decline}
            className="font-sans text-[0.82rem] font-medium px-5 py-2 rounded-lg border border-border text-accent-text hover:border-accent-text transition-all"
          >
            Decline Non-Essential
          </button>
          <button
            onClick={accept}
            className="font-sans text-[0.82rem] font-bold px-5 py-2 rounded-lg bg-brand-cyan text-brand-navy-deep hover:brightness-110 transition-all"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
