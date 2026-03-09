"use client";

import { useState, useEffect } from "react";

const CONSENT_KEY = "aqs_cookie_consent";

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
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, "declined");
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
          background: "#112240",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 -4px 30px rgba(0,0,0,0.3)",
        }}
      >
        <div className="flex-1">
          <div className="font-sans text-[0.92rem] font-bold text-white mb-1.5">
            We value your privacy
          </div>
          <p className="font-sans text-[0.82rem] leading-[1.6]" style={{ color: "#A8B2D1" }}>
            We use cookies to analyze site traffic and improve your experience. Essential cookies are
            required for the site to function. Analytics cookies help us understand how you interact
            with our content.{" "}
            <a href="/cookie-policy" className="text-accent-primary hover:underline">
              Cookie Policy
            </a>
          </p>
        </div>
        <div className="flex gap-2.5 shrink-0">
          <button
            onClick={decline}
            className="font-sans text-[0.82rem] font-medium px-5 py-2 rounded-lg border transition-all"
            style={{ color: "#8892B0", borderColor: "#8892B0" }}
          >
            Decline Non-Essential
          </button>
          <button
            onClick={accept}
            className="font-sans text-[0.82rem] font-bold px-5 py-2 rounded-lg hover:brightness-110 transition-all"
            style={{ background: "#00C6D7", color: "#0B1A2E" }}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
