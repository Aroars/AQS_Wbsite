"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { CONSENT_EVENT, readConsent, type ConsentValue } from "@/components/ui/cookie-consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Google Analytics 4, gated by the cookie banner: the gtag script is not
 * requested until the visitor clicks Accept All, and a later Decline (via
 * Cookie Settings) turns analytics storage off. Does nothing when
 * NEXT_PUBLIC_GA_MEASUREMENT_ID is unset, so preview and local builds stay
 * clean. Vercel Web Analytics is cookieless and loads separately.
 */
export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const [consent, setConsent] = useState<ConsentValue | null>(null);

  useEffect(() => {
    setConsent(readConsent());
    const onChange = (e: Event) => setConsent((e as CustomEvent<ConsentValue>).detail);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  // Consent Mode: the visitor withdraws consent after gtag has loaded
  useEffect(() => {
    if (consent === "declined" && window.gtag) {
      window.gtag("consent", "update", { analytics_storage: "denied" });
    }
  }, [consent]);

  if (consent !== "accepted") return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
          gtag('config', '${measurementId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
