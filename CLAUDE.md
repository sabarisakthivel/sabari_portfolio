# CLAUDE.md — Sabari S Portfolio

Single-page developer portfolio for **Sabari S, Full Stack Developer**. Reference for layout and section order: https://aruneshj.me (a DevOps portfolio). We copy its *structure and pacing*, not its DevOps theme — ours is a dark, editor/IDE-inspired theme for a full-stack developer, with heavier use of graphics and motion.

Read `docs/01-REQUIREMENTS.md` before building anything. All copy lives in `src/data/content.ts` — never hardcode text in components.

## Stack (fixed — do not substitute)

- Next.js 15 (App Router, TypeScript strict, `src/` directory)
- Tailwind CSS v4
- Framer Motion (`motion` package) for all animation
- `next/font` with Geist Sans + JetBrains Mono (self-hosted, no external font requests)
- lucide-react for icons
- Deployed on Vercel. No backend, no database, no CMS, no env vars needed.

## Commands

```bash
pnpm dev          # localhost:3000
pnpm build        # must pass with zero type errors and zero ESLint errors before any commit
pnpm lint
```

## Project conventions

- `src/app/page.tsx` composes the sections in order. Each section is one file in `src/components/sections/`.
- Shared primitives (SectionHeading, Tag, Card, MonoLabel, Reveal, CountUp, Marquee) go in `src/components/ui/`.
- Motion helpers (variants, `useReducedMotion` wrapper) go in `src/lib/motion.ts`.
- Colours, spacing, radii come from CSS variables in `src/app/globals.css` (see design tokens in the requirements doc). No hex literals inside components.
- Server Components by default. Add `"use client"` only where hooks/animation require it, and keep those components small.
- Every interactive element is keyboard reachable with a visible focus ring.
- All motion must respect `prefers-reduced-motion` — animations collapse to a simple opacity fade, marquees stop, counters render final values immediately.
- Lighthouse targets on the Vercel preview: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- No images are required for launch. The identity card, project cards and stats are built from typography, CSS and SVG. Where an `<Image>` would normally go, use the CSS/SVG "browser frame" mock described in the requirements.

## Content rules

- Source of truth: `src/data/content.ts` (typed with the interfaces at the top of the file).
- If a value is `TODO_*`, render nothing for it (do not show placeholder text to visitors) and keep a `// TODO` comment.
- Do not invent metrics, employers, or projects. Everything on the page must trace back to `content.ts`.

## Workflow

Work phase by phase as laid out in `docs/03-BUILD-PLAN.md`. After each phase: run `pnpm build`, fix all errors, commit with a conventional-commit message (`feat: …`, `style: …`, `fix: …`), and summarise what changed and what is next.
