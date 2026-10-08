# AQS Website: Light Theme Transition Plan

**For:** Claude Code working in the automatedqs.com repository (Next.js, Tailwind v4, Vercel)
**Owner:** Roars, AQS Inc.
**Reference mockup:** https://claude.ai/artifact/Q9QSeqcWwyxtkAiF8jLTLv (homepage in the target treatment, with a working light/dark toggle in the nav)
**Live site today:** https://automatedqs.com

## 1. What we are doing and why

The site is dark everywhere. We are moving to a light body with the existing brand colors, keeping three bands dark in both themes (the photo hero, the "Ready to Eliminate Quality Blind Spots?" CTA band, and the footer), and adding a theme toggle. Light is the default for every visitor. The toggle switches to a dark theme that looks like the site does today.

No new brand colors. Cyan #00C2FF, gold #F5A623, green #00D4AA, steel #94A3B8, and the two navies stay exactly as they are. The only additions are light-theme surfaces (an off-white ground, white cards, a light border) and one darker shade of the cyan for text on light backgrounds, because #00C2FF text on white measures under 2:1 contrast.

Copy does not change in this pass. Layout does not change except where noted (hero stats row).

## 2. Current state (measured from the live CSS on 2026-10-08)

Tailwind v4 theme tokens found on `:root`:

| Token | Value | Used for |
|---|---|---|
| `--color-bg-primary` | `#1a1d2b` | page ground |
| `--color-bg-card` | `#00000047` | cards |
| `--color-bg-card-hover` | `#0000006b` | card hover |
| `--color-accent-primary` | `#00c2ff` | buttons, links, eyebrows, stats |
| `--color-accent-secondary` | `#06f` | headline gradient end |
| `--color-accent-green` | `#00d4aa` | EvacuPak, secondary links |
| `--color-accent-warning` | `#f5a623` | IntelliPak, gold cards |
| `--color-border-default` | `#00000040` | card borders |
| `--color-text-primary` | `#fff` | headings |
| `--color-text-body` | `#ffffff8c` | body copy (55% white) |
| `--color-text-dim` | `#ffffff59` | captions (35% white, about 3:1, fails AA) |
| `--color-dark-900` / `-800` / `-700` | `#0a1628` / `#0f1d2f` / `#162a40` | navies, mostly unused on the homepage |
| `--color-border` | `#2a4562` | |
| `--color-primary` / `--color-primary-light` | `#00b4d8` / `#90e0ef` | defined, not used on the homepage |
| `--color-text-secondary` / `--color-text-muted` | `#94a3b8` / `#64748b` | |
| `--font-sans` / `--font-mono` | DM Sans / JetBrains Mono | keep |

Also present: a `--roi-*` token set for the ROI calculator (leave it alone in this pass), scroll-reveal animations that start sections at opacity 0, and a blue-to-cyan text gradient on the hero headline.

Before editing, run a usage inventory so nothing is missed:

```bash
grep -rnoE "bg-bg-(primary|card|card-hover)|text-text-(primary|body|dim|secondary|muted)|border-border(-default)?|accent-(primary|secondary|green|warning)|dark-(900|800|700)" app components --include=*.tsx --include=*.ts --include=*.css | sort | uniq -c | sort -rn
```

Keep that list; it is the checklist for section 5.

## 3. Target token model

Two kinds of tokens. **Semantic** tokens flip with the theme. **Brand** tokens never change. Components that must stay dark in both themes (hero, CTA band, footer) use brand navies directly, never semantic surfaces.

### Semantic tokens

| Token | Light (default) | Dark (toggle) | Notes |
|---|---|---|---|
| `--surface-page` | `#F3F5F8` | `#1A1D2B` | page ground; dark value is today's ground |
| `--surface-card` | `#FFFFFF` | `#13151F` | cards, FAQ box, alternating sections |
| `--surface-card-hover` | `#F7F9FB` | `#0E1019` | |
| `--border` | `#D9E0E8` | `#2F3344` | 1px card and section rules |
| `--border-soft` | `#E6EBF1` | `#262A38` | inner dividers (FAQ rows, testimonial footers) |
| `--text-strong` | `#0A1628` | `#FFFFFF` | headings, brand name |
| `--text-body` | `#475569` | `#ADB3BF` | paragraphs, bullets |
| `--text-dim` | `#64748B` | `#8B94A3` | captions, roles, "Trusted Partners" |
| `--text-nav` | `#334155` | `#CBD5E1` | nav links |
| `--accent-text` | `#007099` | `#00C2FF` | eyebrows, "Learn more" links, list markers, active nav item, icon strokes |
| `--logo-filter` | `grayscale(1)` at opacity .55 | `brightness(0) invert(1)` at opacity .3 | partner logos |

Contrast on the light ground (#F3F5F8): `--text-strong` 16:1, `--text-body` 7.4:1, `--text-dim` 4.6:1, `--accent-text` 5.1:1. On the dark ground: `--text-body` 9.7:1, `--text-dim` 5.5:1. All pass AA for body text.

### Brand tokens (fixed in both themes)

| Token | Value |
|---|---|
| `--brand-cyan` | `#00C2FF` (button fills, card top edges, hero accent text, stats) |
| `--brand-gold` | `#F5A623` |
| `--brand-green` | `#00D4AA` |
| `--brand-steel` | `#94A3B8` |
| `--brand-navy-band` | `#1A1D2B` (hero scrim and CTA band) |
| `--brand-navy-deep` | `#0A1628` (footer, text on cyan buttons) |

Rules:
- Cyan, gold, and green are used as **fills and edges** on light surfaces, never as text. Text that was cyan becomes `--accent-text`.
- Dark text on a cyan button is `--brand-navy-deep` in both themes (8:1).
- Hero, CTA band, and footer read only brand tokens, so they look identical in both themes.

## 4. Theme mechanism

Use `next-themes`. It handles the pre-paint script that prevents a flash of the wrong theme, and it persists the choice.

```bash
npm install next-themes
```

`app/layout.tsx`:

```tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem={false}
          storageKey="aqs-theme"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

`enableSystem={false}` is deliberate: the site defaults to light for everyone regardless of OS setting. A visitor who picks dark keeps it on return (localStorage key `aqs-theme`).

`app/globals.css` (Tailwind v4):

```css
@import "tailwindcss";

:root {
  --surface-page: #F3F5F8;
  --surface-card: #FFFFFF;
  --surface-card-hover: #F7F9FB;
  --border: #D9E0E8;
  --border-soft: #E6EBF1;
  --text-strong: #0A1628;
  --text-body: #475569;
  --text-dim: #64748B;
  --text-nav: #334155;
  --accent-text: #007099;
  --logo-filter: grayscale(1);
  --logo-opacity: .55;
  color-scheme: light;
}

[data-theme="dark"] {
  --surface-page: #1A1D2B;
  --surface-card: #13151F;
  --surface-card-hover: #0E1019;
  --border: #2F3344;
  --border-soft: #262A38;
  --text-strong: #FFFFFF;
  --text-body: #ADB3BF;
  --text-dim: #8B94A3;
  --text-nav: #CBD5E1;
  --accent-text: #00C2FF;
  --logo-filter: brightness(0) invert(1);
  --logo-opacity: .3;
  color-scheme: dark;
}

@theme inline {
  --color-surface-page: var(--surface-page);
  --color-surface-card: var(--surface-card);
  --color-surface-card-hover: var(--surface-card-hover);
  --color-border: var(--border);
  --color-border-soft: var(--border-soft);
  --color-text-strong: var(--text-strong);
  --color-text-body: var(--text-body);
  --color-text-dim: var(--text-dim);
  --color-text-nav: var(--text-nav);
  --color-accent-text: var(--accent-text);

  --color-brand-cyan: #00C2FF;
  --color-brand-gold: #F5A623;
  --color-brand-green: #00D4AA;
  --color-brand-steel: #94A3B8;
  --color-brand-navy-band: #1A1D2B;
  --color-brand-navy-deep: #0A1628;
}

body { background: var(--surface-page); color: var(--text-strong); }
```

`@theme inline` makes utilities like `bg-surface-card`, `text-text-body`, `border-border`, `text-accent-text`, `bg-brand-cyan` available and lets them follow the `data-theme` switch at runtime.

**Migration shim.** To avoid touching every file at once, alias the old token names to the new ones in the same `@theme inline` block during the transition, then delete the aliases in the last step:

```css
  /* temporary aliases, remove in step 5h */
  --color-bg-primary: var(--surface-page);
  --color-bg-card: var(--surface-card);
  --color-bg-card-hover: var(--surface-card-hover);
  --color-border-default: var(--border);
  --color-text-primary: var(--text-strong);
  --color-text-body: var(--text-body);
  --color-text-dim: var(--text-dim);
  --color-accent-primary: #00C2FF;
```

Note that with the shim in place, anything that uses `bg-bg-card` becomes a solid white card in light mode automatically, and anything that uses `text-accent-primary` stays bright cyan, which is wrong for text on light. The component sweep below is mostly about that second case.

### Toggle component

`components/ThemeToggle.tsx`:

```tsx
'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <span className="inline-block h-11 w-20" aria-hidden />
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="inline-flex h-11 items-center gap-2 rounded-lg border border-border px-3 text-[13px] font-semibold text-text-nav"
    >
      {dark ? <SunIcon /> : <MoonIcon />}
      <span>{dark ? 'Light' : 'Dark'}</span>
    </button>
  )
}
```

Place it in the Navbar between the links and the "Get a Quote" button. On mobile it goes into the menu sheet next to the quote button. Use inline SVG icons (the mockup has sun and moon paths you can copy), not emoji.

## 5. Component sweep (in this order)

Work the homepage first, deploy a preview, get sign-off, then repeat for the other routes.

**a. Navbar.** Ground `bg-surface-page`, bottom rule `border-border`, brand name `text-text-strong`, "Nampa, Idaho" `text-accent-text`, links `text-text-nav`, active link `text-accent-text`. "Get a Quote" stays `bg-brand-cyan text-brand-navy-deep`. Add the toggle.

**b. Hero.** Unchanged in look: video/poster under `bg-brand-navy-band/80`, white headline, cyan accent span, cyan button, outlined secondary button. Two changes: (1) replace the `#0066ff → #00c2ff` text gradient on the headline span with flat `text-brand-cyan` (optional; keep the gradient if Roars prefers it, but it is the one element that reads as template); (2) move the four-stat row inside the hero band so the dark area ends on a clean edge, as in the mockup. Stats: mono cyan numbers, `text-brand-steel` uppercase labels.

**c. Partner logo strip.** Light ground, `border-b border-border`. Logos: `style={{ filter: 'var(--logo-filter)', opacity: 'var(--logo-opacity)' }}` instead of the fixed `brightness-0 invert opacity-20` classes. Label `text-text-dim`.

**d. "Our Platform" product cards.** `bg-surface-card border border-border rounded-xl` plus a 4px top edge per product: VeriPak `border-t-brand-cyan`, IntelliPak `border-t-brand-gold`, Conveyors `border-t-brand-steel`, Robotics `border-t-brand-cyan`, EvacuPak `border-t-brand-green`. Title `text-text-strong`, mono subtitle `text-accent-text`, bullets `text-text-body` with `text-accent-text` markers, "Learn more" `text-accent-text`. Icon strokes `text-accent-text` (use `currentColor` in the SVGs).

**e. "What Makes Us Different".** Section `bg-surface-card` with `border-y border-border` so it alternates against the page ground. The four cards sit on `bg-surface-page` with `border-border`. Mono links `text-accent-text`.

**f. Testimonials.** `bg-surface-card border-border`; the big quote mark stays `text-brand-cyan` (it is decorative, not text); quote `text-text-body`; name `text-text-strong`; role `text-text-dim`; divider `border-border-soft`.

**g. "Built for the Moments That Cost You".** Section `bg-surface-card border-y border-border`. Cards `bg-surface-page border border-border` with the existing left edges: `border-l-[5px] border-l-brand-cyan` on the first two, `border-l-brand-gold` on the last two. Headings go from colored text to `text-text-strong`; body `text-text-body`.

**h. FAQ.** One `bg-surface-card border border-border rounded-xl` box, rows divided by `border-border-soft`, "+" in `text-accent-text`.

**i. CTA band.** `bg-brand-navy-band`, white heading, `text-[#CBD5E1]` body, cyan button. Identical in both themes.

**j. Footer.** `bg-brand-navy-deep`. Column headings `text-brand-cyan` mono, links `text-[#CBD5E1]`, fine print `text-brand-steel`, top rule `border-[#1E3048]`. Identical in both themes.

**k. Remove the shim.** Once the homepage and the routes below are swept, delete the alias block and rerun the grep from section 2; it should return nothing.

Then the same sweep, in this order: `/solutions/veripak`, `/solutions/conveyors` and its sub-pages, `/solutions/intellipak`, `/solutions/robotics`, `/solutions/evacupak`, `/toolbox` and the calculators (the `--roi-*` tokens can stay dark-only for now; wrap the ROI tool in `data-theme="dark"` if its palette does not survive the light ground), `/apps`, company pages.

## 6. Two fixes to make while in there

**Scroll reveal.** Sections currently mount at opacity 0 and animate in on scroll, which leaves link previews, search thumbnails, and reduced-motion users with an empty page below the fold. Render every section visible by default and only apply the reveal when `window.matchMedia('(prefers-reduced-motion: no-preference)')` matches, using `motion-safe:` variants for the animation classes. Nothing should depend on JavaScript to become visible.

**Caption contrast.** `--color-text-dim` at 35% white is about 3:1 on the dark ground. The new `--text-dim` values (section 3) fix this in both themes.

## 7. Rollout

1. Branch `feat/light-theme` from main.
2. Commit 1: `globals.css` tokens, shim, `next-themes`, `ThemeToggle`, Navbar. Site still looks dark everywhere except the nav. Push; Vercel preview.
3. Commit 2: homepage sections a through j. Push; preview. Compare against the mockup side by side, light and dark. Get Roars's sign-off here before touching other routes.
4. Commits 3 to N: one route per commit.
5. Final commit: remove the shim, rerun the grep, fix stragglers.
6. Merge to main. Watch the production deploy and the Vercel analytics for a day.

## 8. Acceptance checklist

- [ ] A fresh visitor (no localStorage) gets the light theme with no flash of dark on load.
- [ ] Toggle switches the whole page; the choice survives reload and navigation.
- [ ] Dark theme matches the current production site closely enough that a returning visitor would not call it a redesign.
- [ ] Hero, CTA band, and footer are dark in both themes.
- [ ] No cyan, gold, or green text on light surfaces; those colors appear only as fills, edges, and icons. Accent text is `--accent-text`.
- [ ] All body and caption text passes 4.5:1 in both themes (check with the browser's accessibility panel on the ground and on cards).
- [ ] Partner logos read as gray on light and as inverted white on dark.
- [ ] Nothing starts at opacity 0; the page is complete with JavaScript disabled and with reduced motion on.
- [ ] 400px viewport: no horizontal scroll, nav collapses, product cards stack, stats row goes to two columns.
- [ ] Lighthouse accessibility score does not drop from today's.
- [ ] The grep from section 2 returns nothing after the shim is removed.

## 9. Kickoff prompt for Claude Code

Paste this to start the session in the website repo:

> Read `docs/light-theme-transition-plan.md` in full. Then run the grep in section 2 and show me the usage inventory before changing anything. Implement section 4 (tokens, shim, next-themes, ThemeToggle, Navbar) as the first commit on a branch named `feat/light-theme`. Do not touch any page sections until I confirm the preview. Keep every change inside the token model in section 3; if a color you need is not in that table, stop and ask rather than inventing one. Do not change copy.
