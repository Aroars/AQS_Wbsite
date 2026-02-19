# AQS Website — Claude Code Build Prompt

## Project Overview

Build a production-ready marketing website for **Automated Quality Solutions (AQS)** — an industrial automation company based in Boise, Idaho that engineers SCADA platforms, liquid recovery systems, leak detection technology, sanitary robotics, and conveyor systems for food production facilities.

Use **Next.js 14+ (App Router)** with **Tailwind CSS**. Deploy target is **Vercel** or **Cloudflare Pages**.

A complete interactive prototype exists at `reference/prototype.jsx` — this is the **SINGLE SOURCE OF TRUTH** for all design decisions, content, copy, page structure, and component architecture. Every page, every section, every word of copy has been approved. Do not deviate from the prototype's content or messaging without asking.

---

## Tech Stack

- **Framework**: Next.js 14+ (App Router, `src/app/`)
- **Styling**: Tailwind CSS v4 + CSS variables for the design tokens
- **Fonts**: Google Fonts — `DM Sans` (body) + `JetBrains Mono` (monospace/technical accents)
- **Animations**: Framer Motion for scroll-triggered reveals, counters, page transitions
- **Forms**: React Hook Form + server action or Resend for contact form email delivery
- **Deployment**: Vercel (primary) or Cloudflare Pages

---

## Design System (extract from prototype)

### Color Tokens
```
--bg-primary: #1a1d2b         (charcoal base)
--accent-primary: #00c2ff     (electric cyan)
--accent-secondary: #0066ff   (deep blue)
--accent-green: #00d4aa       (EvacuPak green)
--accent-red: #ff6666         (leak detection red)
--accent-blue: #4d9fff        (robotics blue)
--accent-conveyor: #66b3ff    (conveyor blue)
--accent-warning: #f5a623     (optional/warning amber)
--card-bg: rgba(0,0,0,0.28)
--card-bg-hover: rgba(0,0,0,0.42)
--border: rgba(0,0,0,0.25)
--text-primary: #ffffff
--text-body: rgba(255,255,255,0.55)
--text-dim: rgba(255,255,255,0.35)
```

### Typography
- **Headings**: DM Sans, 800 weight, sizes clamp(2rem, 4vw, 3rem)
- **Body**: DM Sans, 400/500 weight, 0.84-1.02rem, line-height 1.6-1.7
- **Monospace labels**: JetBrains Mono, 0.58-0.68rem, uppercase, letter-spacing 0.1-0.15em, cyan accent color
- **Section pattern**: SectionLabel (mono, cyan, uppercase) → SectionTitle (h2, white, 800) → SectionDesc (body, 55% white)

### Visual Effects
- **Particle grid**: Fixed background, 60px grid lines at 5% opacity
- **Glow orbs**: Radial gradient blurred circles positioned per-section, 8% opacity
- **Cards**: Dark semi-transparent with 1px border, 14-16px border-radius, hover lift + border glow
- **Scan lines**: Subtle repeating linear gradient overlay on hero
- **Scroll animations**: translateY(40px) → 0, opacity 0 → 1, staggered delays

### Reusable Components
- `SolutionCard` — icon + title + mono subtitle + feature bullet list + "Learn more →"
- `StatCounter` — Animated number counter, mono font, cyan, text-shadow glow
- `FAQItem` — Click-to-expand accordion with + icon rotation
- `ComparisonTable` — 3-column (Status Quo / VeriPak / VeriPak+Inspection) with ✓/✕/OPT badges
- `AnimatedSection` — Scroll-triggered fade-up wrapper with configurable delay
- `GlowOrb` — Positioned radial gradient blur for ambient lighting
- `SectionLabel` / `SectionTitle` / `SectionDesc` — Consistent section header pattern

---

## Site Architecture & Routes

```
/                              → Home (hero, partners, solutions grid, why AQS, testimonials, industries)
/solutions                     → Solutions hub (all 5 solution cards)
/solutions/veripak             → VeriPak SCADA (SCADA callout, feedback loop, specs, comparison table)
/solutions/evacupak            → EvacuPak Liquid Recovery (feature cards, 97% recovery, 3A/CIP/HACCP)
/solutions/leak-detection      → Leak Detection R&D (vision critique, dual-pull method, failure modes)
/solutions/robotics            → Sanitary Robotics (capabilities, spec card, 6 application types)
/solutions/conveyors           → Conveyor Systems (2 case studies, 4 conveyor types)
/about                         → About (3 core values, 3 leadership bios with LinkedIn)
/contact                       → Contact form (functional email submission)
```

Shared across all pages: Navigation, FAQ section, CTA section, Footer.

---

## Page Content & Positioning Notes

ALL copy lives in the prototype. Here are the critical positioning rules:

### VeriPak — Standalone SCADA
- **NEVER** call it "a data logger" or "quality system" — it is a **standalone SCADA platform**
- Emphasize: real-time dashboards, sub-second alerts, auto line stop, immediate operator feedback
- Tagline: "See It. Know It. Fix It. Now."
- 4-step feedback loop: Detect → Decide → Act → Record
- No middleware, no third-party software, no IT integration project
- Allen-Bradley CompactLogix + Optix HMI
- Comparison table is a key sales tool — keep prominent

### EvacuPak — Patented Liquid Recovery
- Up to 97% product recovery from packaging
- 3A certified hygienic lances, CIP capable
- "Never exposed to atmosphere" — lances extract directly into 3A process piping
- Full HACCP traceability
- "Re-process, don't re-work"

### Leak Detection — R&D / Patent Pending
- Core thesis: **"Vision Can't Detect What Physics Can Measure"**
- AQS has proven vision-based systems fail through years of implementation
- Dual-pull differential suction: two consecutive pulls, measure force + deflection delta
- Self-referencing (each package = own baseline), binary pass/fail output
- 8 catalogued failure modes from real-world bacon packaging expertise
- Early Access Program CTA — convey innovation without overpromising availability

### Sanitary Robotics — Broader Than Palletizing
- Covers: palletizing, case packing, pick-and-place, depalletizing, stacking, custom automation
- All washdown: 316L SS, IP69K, USDA/FDA compliant
- Rockwell-native (Allen-Bradley) — no proprietary black boxes
- KUKA and Fanuc platforms
- "Full Washdown. Full Ownership."

### Conveyors — Real Case Studies
- 50+ years combined engineering experience
- Freezer Conveyors: marshmallow production, Utah
- EQ70 Accumulation: major dairy facility, Philadelphia
- Types: modular belt, flat-top chain, roller, custom

### About — People & Values
- Core values: Solutions Seekers, Motivated to Achieve, Integrity in Everything
- Leadership: Travis Nebeker (CEO), Robert Byars (COO), David Mitchell (CRO)
- Each has LinkedIn URL and approved bio in prototype

---

## SEO Requirements

### Per-Page Metadata
Every route needs unique `<title>`, `<meta name="description">`, and Open Graph tags.
Title format: `Page Name | AQS — Automated Quality Solutions`

### Structured Data (JSON-LD)
- **Organization** schema on all pages (name, URL, Boise ID address, founders, sameAs)
- **Product** schema on VeriPak, EvacuPak
- **FAQPage** schema where FAQ renders
- **Service** schema on Robotics, Conveyors, Leak Detection

### Technical SEO
- Semantic HTML (`<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`)
- One `<h1>` per page, proper heading hierarchy
- `next/image` for all images with alt text
- `next-sitemap` for sitemap generation
- `robots.txt`
- Canonical URLs

---

## Contact Form

All "Get a Quote" / "Request a Quote" CTAs route to `/contact`.

**Fields**: Name, Email, Phone (optional), Company, Message, Solution Interest (multi-select: VeriPak SCADA, EvacuPak, Leak Detection, Sanitary Robotics, Conveyors, Other)

**Submission**: Next.js server action → send email to `info@automatedqs.com` via Resend API. Show success/error states.

---

## Image Strategy

Real images added later. For now create styled placeholder containers using gradient backgrounds that match the dark theme. Add TODO comments with dimensions so real images are a 1-line swap.

**Images needed** (placeholder now, real later):
- Hero background (packaging line video/image)
- VeriPak system / HMI screenshot
- EvacuPak system photo
- Robotic cell photo
- Conveyor photos (freezer, EQ70)
- Team headshots (Travis, Robert, David)
- Partner logos (Allen-Bradley, Rockwell, Keyence, OneMotion, Intralox, PulseRoller, KUKA)

---

## Build Order

1. Project scaffold — Next.js + Tailwind + fonts + design tokens + global layout
2. Shared components — Nav, Footer, CTA, FAQ, SolutionCard, StatCounter, AnimatedSection
3. Home page
4. VeriPak SCADA page
5. EvacuPak page
6. Leak Detection page
7. Sanitary Robotics page
8. Conveyors page
9. Solutions hub
10. About page
11. Contact page + server action
12. SEO pass — metadata, structured data, sitemap, robots.txt

---

## Key Contacts & Links

- **Website**: automatedqs.com
- **Email**: info@automatedqs.com
- **Location**: Boise, Idaho
- **LinkedIn**: https://www.linkedin.com/company/automatedqs/
- **YouTube**: https://www.youtube.com/@AutomatedQS
- **Conveyor Calculator (beta)**: aqsconveyorcalculator-production.up.railway.app

---

## Critical Reminders

- The dark "mission control" aesthetic is APPROVED — do not lighten or add white sections
- JetBrains Mono for technical labels is deliberate — keep it
- Particle grid background and glow orbs are signature elements — preserve them
- All prototype content/copy is FINAL — don't rewrite headlines or descriptions
- Read the full prototype.jsx before writing any code
