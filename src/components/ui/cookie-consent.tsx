"use client";

import { useState, useEffect } from "react";

const CONSENT_KEY = "aqs-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Small delay so it doesn't flash on first paint
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
          background: "rgba(11,26,46,0.95)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 -4px 30px rgba(0,0,0,0.3)",
        }}
      >
        <div className="flex-1">
          <p className="font-sans text-[0.84rem] text-white/70 leading-[1.6]">
            We use cookies to improve your experience and analyze site traffic. By clicking
            &ldquo;Accept,&rdquo; you consent to our use of cookies. See our{" "}
            <a
              href="/privacy-policy"
              className="text-accent-primary hover:underline"
            >
              Privacy Policy
            </a>{" "}
            for details.
          </p>
        </div>
        <div className="flex gap-2.5 shrink-0">
          <button
            onClick={decline}
            className="font-sans text-[0.82rem] font-medium text-white/50 px-5 py-2 rounded-lg border border-white/10 hover:border-white/20 hover:text-white/70 transition-all"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="font-sans text-[0.82rem] font-bold text-[#0B1A2E] bg-accent-primary px-5 py-2 rounded-lg hover:brightness-110 transition-all"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
