# Turnstile on the contact forms: going live, rollback, test keys

Cloudflare Turnstile protects both forms that post to `/api/contact`: the contact page (`src/components/pages/contact-page.tsx`) and the rep inquiry form (`src/components/pages/reps-page.tsx`). The browser gets a token from Cloudflare and sends it as `turnstileToken`. The route (`src/app/api/contact/route.ts`) verifies it with Cloudflare's siteverify endpoint before it sends any email.

Two values, two homes:

| Value | Variable | Public? |
|---|---|---|
| Site key | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. Baked into the build, so changing it needs a redeploy. | Yes, it ships to every browser |
| Secret key | `TURNSTILE_SECRET_KEY`. Read at request time. | No. Vercel only, never in the repo |

With neither set, the forms render no widget, load no Cloudflare script, and the route skips verification. The site behaves as it did before Turnstile. That is what makes the order below safe.

The honeypot field, the 3-second minimum fill time, HTML escaping and the field checks do not depend on the keys. They are always on. A filled honeypot or a submit under 3 s gets a normal-looking success response and no email.

## Going live (exact order)

1. **Cloudflare dashboard > Turnstile > Add widget.** Hostname `automatedqs.com` (add `www.automatedqs.com` if the site answers there). Widget mode: Managed. Copy the site key and the secret key.
2. **Deploy this code with no keys set.** Nothing changes for visitors. Submit one real message on `/contact` and check that both emails arrive.
3. **Vercel > aqs-website > Settings > Environment Variables.** Add `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`, environment Production.
4. **Redeploy.** The site key is baked in at build time, so saving the variables does nothing until the next build finishes.
5. **Test a real submission** on `/contact` and on the rep form at `/reps#contact`. The widget is normally invisible ("interaction only"). Both emails should arrive. If every attempt says "We couldn't confirm you're a person", the site key and secret are not from the same widget, or the hostname is not on the widget.

Why both keys together: a site key without a secret means the browser asks for a token nobody checks, which is harmless. A secret without a site key makes the server demand a token no page sends, so every submission fails until the redeploy. Setting both and redeploying once avoids that window.

## Rollback

Remove both `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in Vercel and redeploy. The widget disappears and the server stops verifying. Remove them together; removing only the site key leaves the server demanding tokens.

## What visitors see when it fails

- Cloudflare rejected the check, or no token arrived within 30 s: "We couldn't confirm you're a person. Try again." The widget resets and the next submit runs a fresh check.
- The Cloudflare script could not load (blocked, offline, slower than 15 s): "We couldn't load the spam check. Reload the page, or try another browser or network."
- Cloudflare's siteverify is down or slower than 5 s: the server answers 503 and the form shows the first message. It fails closed; no email is sent.
- Tokens are single use and last 5 minutes. The widget resets after every response from the server.

## Test keys

Cloudflare's public test keys work on any hostname, including localhost. See developers.cloudflare.com/turnstile/troubleshooting/testing/. For local runs put these in `.env.local`:

```
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

| Site key | Behavior |
|---|---|
| `1x00000000000000000000AA` | always passes |
| `2x00000000000000000000AB` | always blocks in the browser |
| `3x00000000000000000000FF` | forces an interactive challenge |

| Secret | Behavior |
|---|---|
| `1x0000000000000000000000000000000AA` | always passes verification |
| `2x0000000000000000000000000000000AA` | always fails verification |

A test site key issues the token `XXXX.DUMMY.TOKEN.XXXX`, which only a test secret accepts. Do not put test keys in Vercel Production.

## CSP

The project sets no Content-Security-Policy (not in `next.config.ts`, middleware or `vercel.json`), so nothing blocks `https://challenges.cloudflare.com`. If a CSP is added later, allow that origin in `script-src` and `frame-src`.
