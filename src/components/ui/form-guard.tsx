"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";

/* Spam protection shared by the contact and rep forms: a Cloudflare Turnstile slot,
   a honeypot field, and the time since the form rendered. Server side: src/lib/contact-guard.ts. */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const SCRIPT_TIMEOUT_MS = 15_000;
const TOKEN_TIMEOUT_MS = 30_000;

export const CHECK_FAILED = "We couldn't confirm you're a person. Try again.";
export const CHECK_LOAD_FAILED =
  "We couldn't load the spam check. Reload the page, or try another browser or network.";

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  scriptPromise ??= new Promise<TurnstileApi>((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    const fail = () => {
      clearTimeout(timer);
      script.remove();
      reject(new Error("Turnstile script did not load"));
    };
    const timer = setTimeout(fail, SCRIPT_TIMEOUT_MS);
    script.onload = () => {
      clearTimeout(timer);
      if (window.turnstile) resolve(window.turnstile);
      else fail();
    };
    script.onerror = fail;
    document.head.appendChild(script);
  }).catch((err) => {
    scriptPromise = null; // let the next attempt try again
    throw err;
  });
  return scriptPromise;
}

export type TurnstileHandle = {
  /** Resolves with a token (none when Turnstile is off) or the message to show. Never waits longer than 30 s. */
  getToken: () => Promise<{ token?: string; error?: string }>;
  /** Call after every server response: tokens are single use. */
  reset: () => void;
};

type TokenResult = { token?: string; error?: string };

/** Renders nothing when NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset. */
export function TurnstileSlot({ ref }: { ref: Ref<TurnstileHandle> }) {
  const slotRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const token = useRef<string | null>(null);
  const loadFailed = useRef(false);
  const waiters = useRef<((result: TokenResult) => void)[]>([]);

  const settle = (result: TokenResult) => {
    const pending = waiters.current;
    waiters.current = [];
    pending.forEach((resolve) => resolve(result));
  };

  useImperativeHandle(ref, () => ({
    getToken: () => {
      if (!SITE_KEY) return Promise.resolve({});
      if (loadFailed.current) return Promise.resolve({ error: CHECK_LOAD_FAILED });
      if (token.current) return Promise.resolve({ token: token.current });
      return new Promise<TokenResult>((resolve) => {
        const timer = setTimeout(() => settle({ error: CHECK_FAILED }), TOKEN_TIMEOUT_MS);
        waiters.current.push((result) => {
          clearTimeout(timer);
          resolve(result);
        });
      });
    },
    reset: () => {
      token.current = null;
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
    },
  }));

  useEffect(() => {
    if (!SITE_KEY || !slotRef.current) return;
    const el = slotRef.current;
    let cancelled = false;

    loadTurnstile()
      .then((turnstile) => {
        if (cancelled) return;
        widgetId.current = turnstile.render(el, {
          sitekey: SITE_KEY,
          appearance: "interaction-only",
          callback: (t: string) => {
            token.current = t;
            settle({ token: t });
          },
          "expired-callback": () => {
            token.current = null;
          },
          "error-callback": () => {
            token.current = null;
            settle({ error: CHECK_FAILED });
          },
        });
      })
      .catch(() => {
        if (cancelled) return;
        loadFailed.current = true;
        settle({ error: CHECK_LOAD_FAILED });
      });

    return () => {
      cancelled = true;
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, []);

  if (!SITE_KEY) return null;
  return <div ref={slotRef} />;
}

/** Hidden from people and assistive tech; bots that fill every field give themselves away. */
export function HoneypotField() {
  return (
    <div aria-hidden="true" className="sr-only">
      <label>
        Leave this field empty
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

/** Reads the honeypot out of the submitted form. */
export function honeypotValue(form: HTMLFormElement): string {
  return String(new FormData(form).get("company_website") ?? "");
}

/** Returns a function giving the ms since the calling component first rendered on the client. */
export function useFormAge(): () => number {
  const renderedAt = useRef<number | null>(null);
  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);
  return () => (renderedAt.current === null ? 0 : Date.now() - renderedAt.current);
}
