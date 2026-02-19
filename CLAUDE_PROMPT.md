# AQS Website — Claude Code Build Prompt

## Project Overview

Build a production Next.js website for **Automated Quality Solutions (AQS)** — an industrial automation company based in Boise, Idaho that builds quality control systems, liquid recovery systems, leak detection technology, sanitary robotics, and conveyor systems for food production facilities.

The complete design, content, page structure, component hierarchy, and interaction patterns are defined in the reference artifact at `reference/aqswebsite.jsx`. That file is a working single-file React app that serves as the design spec. Your job is to break it into a real production Next.js project while preserving the exact design system, content, and feel.

---

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS v4 + CSS custom properties for the design tokens
- **Fonts**: Google Fonts — `DM Sans` (body) + `JetBrains Mono` (mono/accents)
- **Deployment target**: Vercel or Cloudflare Pages
- **Form handling**: Resend (email API) or a simple mailto fallback initially
- **Analytics**: Ready for Google Analytics / Tag Manager injection
- **SEO**: Full meta tags, Open Graph, JSON-LD structured data per page

---

## Design System (extract from reference artifact)

### Colors
```
--bg: #1a1d2b (charcoal base)
--accent: #00c2ff (electric cyan)
--accent-blue: #0088ff
--accent-deep: #0066ff
--card: rgba(0,0,0,0.28)
--card-hover: rgba(0,0,0,0.42)
--border: rgba(0,0,0,0.25)
--text: rgba(255,255,255,0.55)
--text-dim: rgba(255,255,255,0.35)
--text-bright: #ffffff
--accent-green: #00d4aa (EvacuPak)
--accent-red: #ff6666 (Leak Detection)
--accent-mid-blue: #4d9fff (Sanitary Robotics)
--accent-light-blue: #66b3ff (Conveyors)
```

### Typography
- Headlines: DM Sans, 800 weight, clamp(2rem, 4vw, 3rem)
- Body: DM Sans, 400/500 weight, ~0.85-1.05rem
- Mono/labels: JetBrains Mono, 0.6-0.7rem, uppercase, letter-spacing 0.1-0.15em
- Section labels: JetBrains Mono, cyan colored, uppercase

### Visual Effects
- Particle grid background (subtle CSS grid lines at 60px, 5% opacity)
- Glow orbs (radial gradient blurs, positioned per section)
- Scroll-triggered fade-up animations (IntersectionObserver)
- Hover depth on cards (translateY(-4px), border color shift)
- Animated stat counters on hero
- Scanline overlay on hero section

### Card Design
- Semi-transparent dark backgrounds (rgba(0,0,0,0.28))
- 1px borders using --border color
- 12-16px border radius
- Hover: darken to rgba(0,0,0,0.42), accent border glow

---

## Pages & Routes

Each page has its own route. Extract all content from the reference artifact.

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, stats, partners bar, solutions grid, why AQS, testimonials, industries |
| `/solutions` | Solutions Hub | Overview cards linking to each solution page |
| `/solutions/veripak` | VeriPak SCADA | Standalone SCADA platform — real-time dashboards, feedback loop, spec grid, comparison table, compatible devices |
| `/solutions/evacupak` | EvacuPak Recovery | Liquid recovery system — 97% recovery, 3A certified, HACCP traceability |
| `/solutions/leak-detection` | Leak Detection | R&D dual-pull suction system — why vision fails, 3-step process, 8 failure modes, VeriPak integration |
| `/solutions/sanitary-robotics` | Sanitary Robotics | Washdown robotic systems — palletizing, case packing, pick-and-place, applications grid |
| `/solutions/conveyors` | Conveyor Systems | Sanitary conveyors — case studies (freezer, EQ70), conveyor types |
| `/about` | About | Core values, leadership team (Travis Nebeker, Robert Byars, David Mitchell) with LinkedIn links |
| `/contact` | Contact | Contact form + info (build as a new page, not in the reference) |

---

## Shared Components

Extract these from the reference artifact into reusable components:

- `Navigation` — Fixed top nav with dropdown on Solutions, scroll-aware background, mobile hamburger menu (mobile menu needs to be built — not in reference)
- `Footer` — 4-column grid with solution links, company links, contact info, social links
- `FAQSection` — Accordion FAQ with 7 questions (shared across all pages)
- `CTASection` — "Ready to Eliminate Quality Blind Spots?" with email CTA
- `SectionLabel` — Cyan mono uppercase label
- `SectionTitle` — Large bold heading
- `SectionDesc` — Body paragraph, max-width constrained
- `SolutionCard` — Hover-depth card with icon, title, subtitle, feature list, accent color
- `AnimatedSection` — IntersectionObserver wrapper for scroll-triggered fade-up
- `StatCounter` — Animated number counter (used on hero)
- `GlowOrb` — Decorative radial gradient blur
- `FAQItem` — Individual accordion item
- `ComparisonTable` — VeriPak feature comparison (Status Quo vs VeriPak vs VeriPak+Inspection)

---

## SEO Requirements

### Per-page meta tags
Every page needs unique `<title>`, `<meta name="description">`, and Open Graph tags. Use the page content to write SEO-optimized descriptions.

### JSON-LD Structured Data (embed on home page)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Automated Quality Solutions (AQS)",
  "url": "https://www.automatedqs.com",
  "description": "AQS designs and manufactures standalone SCADA platforms, liquid recovery systems, leak detection technology, sanitary robotic systems, and conveyor systems for food production facilities.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Boise",
    "addressRegion": "ID",
    "addressCountry": "US"
  },
  "sameAs": [
    "https://www.linkedin.com/company/automatedqs/",
    "https://www.youtube.com/@AutomatedQS"
  ],
  "founder": [
    { "@type": "Person", "name": "Travis Nebeker", "jobTitle": "CEO and Co-Founder" },
    { "@type": "Person", "name": "Robert Byars", "jobTitle": "COO and Co-Founder" }
  ]
}
```

Also add `FAQPage` schema on any page with FAQs, and `Product`/`Service` schema for each solution.

---

## Content Data

All page content (text, features, testimonials, team bios, FAQ Q&As, leak types, etc.) should be extracted from the reference artifact into data files at `src/data/`. This keeps content separate from components:

- `src/data/solutions.ts` — solution card data
- `src/data/team.ts` — leadership bios + LinkedIn URLs
- `src/data/testimonials.ts` — client quotes
- `src/data/faq.ts` — all FAQ Q&As
- `src/data/leak-types.ts` — 8 leak failure modes
- `src/data/industries.ts` — 6 industry cards
- `src/data/partners.ts` — partner names
- `src/data/veripak-specs.ts` — spec grid items + comparison table data

---

## Image Placeholders

The reference artifact uses no images (text/icon only). In the real build, add `next/image` placeholders where images should go:

- Hero background (industrial/packaging line footage or image)
- Each solution page hero (product photos)
- Team headshots (Travis, Robert, David) — currently using initial avatars
- Conveyor case study galleries (freezer conveyors, EQ70)
- Partner logos (Allen-Bradley, Keyence, Intralox, PulseRoller, KUKA)
- Industry section imagery

Use a consistent placeholder pattern (gray cards with icon + "Add Image" text) so the team knows exactly where to drop in real assets.

---

## Contact Form

Build a `/contact` page (not in reference artifact) that includes:
- Name, email, phone, company fields
- Dropdown: "What are you interested in?" (VeriPak SCADA, EvacuPak, Leak Detection, Sanitary Robotics, Conveyors, Other)
- Message textarea
- Submit → send via Resend API or mailto fallback
- Match the site's dark theme and card styling

---

## Mobile Responsiveness

The reference artifact has basic media queries but needs a proper mobile experience:
- Hamburger menu for navigation (slide-out or full-screen overlay)
- Stack all grids to single column below 768px
- Touch-friendly tap targets (min 44px)
- Readable font sizes on small screens
- Horizontal scroll prevention

---

## Build Order

1. `npx create-next-app@latest` with App Router, Tailwind, TypeScript
2. Set up design tokens (CSS variables + Tailwind config)
3. Install Google Fonts (DM Sans + JetBrains Mono)
4. Build layout shell (Navigation + Footer)
5. Build shared UI components (AnimatedSection, SectionLabel, SolutionCard, etc.)
6. Extract all content into data files
7. Build Home page
8. Build each solution page
9. Build About page
10. Build Contact page
11. Add SEO meta tags + structured data
12. Add mobile hamburger menu
13. Test all routes and responsive breakpoints

---

## Reference File

The complete working prototype is at `reference/aqswebsite.jsx`. Every piece of content, every design decision, every interaction pattern is defined there. Use it as the single source of truth for what this site should look and feel like.

---

## Key Business Context

- AQS is a **values-first company** — no tiered pricing, no high-pressure sales
- VeriPak is positioned as a **standalone SCADA** — not a data logger, emphasize real-time
- Leak Detection is **R&D / patent pending** — position as early access, not GA product
- The team has **deep domain expertise** in food production packaging failures
- Competitors include **Velec Systems** (velecsystems.com) — AQS differentiates on honesty, full ownership, and Rockwell-native controls
- Contact: **info@automatedqs.com** | Boise, Idaho
- Social: [LinkedIn](https://www.linkedin.com/company/automatedqs/) | [YouTube](https://www.youtube.com/@AutomatedQS)
