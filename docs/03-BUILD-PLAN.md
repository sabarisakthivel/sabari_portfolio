# Build Plan & Claude Code Kickoff

## How to use these files

1. Create an empty folder, open it in VS Code, start Claude Code.
2. Copy the files in:
   - `CLAUDE.md` → project root
   - `01-REQUIREMENTS.md` → `docs/01-REQUIREMENTS.md`
   - `03-BUILD-PLAN.md` (this file) → `docs/03-BUILD-PLAN.md`
   - `02-content.ts` → keep in `docs/` for now; Claude Code moves it to `src/data/content.ts` in Phase 1
3. Paste the **Kickoff prompt** below as your first message.
4. After each phase, review `localhost:3000`, then say `continue to phase N`. Ask for changes freely — everything is data-driven.

---

## Kickoff prompt (paste into Claude Code)

```
Read CLAUDE.md, docs/01-REQUIREMENTS.md and docs/03-BUILD-PLAN.md fully before doing anything.
Also open https://aruneshj.me in your head as the structural reference described in the requirements.

Build my portfolio following the phased plan in docs/03-BUILD-PLAN.md. Start with Phase 0 and Phase 1 now.
Stop after Phase 1, run pnpm build, commit, and give me a short summary plus anything you need from me.
Do not invent content — everything comes from docs/02-content.ts. Do not add images.
```

---

## Phases

### Phase 0 — Scaffold
- `pnpm create next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*"`
- Add: `motion`, `lucide-react`, `clsx`, `tailwind-merge`, `@vercel/analytics`
- Configure `next/font` (Geist Sans, JetBrains Mono) in `layout.tsx`
- `globals.css`: design tokens from Requirements §2.1, dot-grid background utility, reduced-motion base rules
- Move `docs/02-content.ts` → `src/data/content.ts`; ensure it type-checks
- Commit: `chore: scaffold next 15 + tailwind v4 + tokens`

### Phase 1 — Skeleton & layout
- `src/components/ui/`: `SectionHeading`, `Tag`, `Card`, `Button`, `MonoLabel`, `CodePanel` (chrome + line numbers + syntax colouring helper), `BrowserFrame` (static version)
- `src/components/layout/`: `Navbar` (sticky, blur on scroll, mobile overlay, live clock), `Footer`, `SkipLink`
- All nine sections created as static Server Components rendering real content, no animation yet
- Responsive pass at 360 / 768 / 1024 / 1440
- Commit: `feat: static sections and layout`

### Phase 2 — Hero, identity card, marquee
- Hero grid: text column + Identity `CodePanel` (`sabari.json`)
- Status strip with live clock (`Asia/Kolkata`)
- Skills marquee (two rows, CSS transform loop, pause on hover)
- Commit graph SVG (static paths, animated in Phase 4)
- Commit: `feat: hero with identity panel and marquee`

### Phase 3 — Work timeline, stats, stack, built
- Timeline with rail, release badges, nested project cards for Zora/KNK
- Stats grid (static values, CountUp in Phase 4)
- Stack `CodePanel` (`stack.json`) + three domain cards + tag cloud; shared hover state
- Built: two featured project cards side-by-side with `BrowserFrame` mocks (`ops` theme: table rows + status pills + a mini map block; `matrimony` theme: profile-card grid + shield/lock badge), open-source row, publication card, education cards
- Commit: `feat: work, stats, stack, built sections`

### Phase 4 — Motion & graphics
Implement every item in Requirements §4 (M-1 → M-14, M-15 optional), in this order:
1. `src/lib/motion.ts` — shared variants (`fadeUp`, `stagger`), `useReducedMotionSafe`
2. `Reveal` wrapper → apply to all sections/cards (M-1, M-14)
3. Loading intro overlay (M-3) with `sessionStorage` guard and skip
4. Hero: typewriter tagline (M-5), tilt panel (M-4), commit-graph path draw (M-7), marquee polish (M-6)
5. Navbar active-link `layoutId` underline + clock (M-8)
6. Timeline scroll-progress rail + node pulse (M-9)
7. `CountUp` (M-10)
8. Stack typewriter + hover linking (M-11)
9. BrowserFrame in-view animation + card glow (M-12)
10. Contact copy button state (M-13)
11. Cursor spotlight, desktop only (M-2); optional gradient blobs (M-15)
- Verify reduced-motion behaviour by toggling the OS setting / DevTools emulation
- Commit: `feat: motion system and animated graphics`

### Phase 5 — SEO, a11y, polish
- `metadata` from `site`, `opengraph-image.tsx`, JSON-LD Person, `sitemap.ts`, `robots.ts`, `manifest`/favicon (SVG monogram `SS` on `--bg`)
- Vercel Analytics
- Keyboard pass, focus rings, contrast check on muted text
- Lighthouse on `pnpm build && pnpm start`; fix until AC-5 targets are met
- Remove any leftover TODO rendering; confirm Resume buttons are hidden while `TODO_RESUME_URL`
- Commit: `feat: seo, accessibility and performance polish`

### Phase 6 — Deploy to Vercel
- Ensure `.gitignore` is sane; push to a new GitHub repo `sabarisakthivel/portfolio`
- Import the repo at https://vercel.com/new (framework auto-detected as Next.js, no env vars)
- Deploy → verify preview against Acceptance Criteria AC-1…AC-10
- Optional custom domain: Vercel → Project → Settings → Domains → add domain → update DNS (A `76.76.21.21` or CNAME `cname.vercel-dns.com`) → then set `site.url` in `content.ts` and redeploy
- Commit: `chore: production deploy`

---

## Definition of done
All acceptance criteria in `docs/01-REQUIREMENTS.md` §6 pass on the Vercel production URL, and the two open questions (domain, resume URL) are either resolved or intentionally deferred.

## Things Sabari must supply later (not blocking)
- Resume PDF link → `site.links.resume`
- Custom domain → `site.url`
- Optional: whether to show the phone number → `site.links.showPhone`
