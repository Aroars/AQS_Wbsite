# AQS — Automated Quality Solutions Website

Production marketing website for [automatedqs.com](https://www.automatedqs.com).

## Getting Started

```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir
npm install framer-motion react-hook-form
npm install -D next-sitemap
```

## Project Structure

```
aqs-website/
├── CLAUDE.md                    # Claude Code prompt (read this first)
├── reference/
│   └── prototype.jsx            # Interactive prototype — source of truth for all content & design
├── src/
│   ├── app/                     # Next.js App Router pages
│   ├── components/
│   │   ├── ui/                  # Primitives (buttons, badges, cards)
│   │   ├── layout/              # Nav, Footer, CTA
│   │   ├── sections/            # Reusable page sections (FAQ, Partners, Industries)
│   │   └── pages/               # Page-specific compound components
│   ├── lib/                     # Utilities, hooks (useInView, etc.)
│   ├── styles/                  # Global CSS, design tokens
│   ├── content/                 # Structured content data (solutions, team, testimonials)
│   └── assets/                  # Images and icons (placeholders for now)
└── public/                      # Static assets, robots.txt, favicons
```

## Key Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npx next-sitemap     # Generate sitemap
```

## Design Reference

The complete interactive prototype is at `reference/prototype.jsx`. Open it in Claude.ai or any React renderer to see the full site with all pages, animations, and content.
