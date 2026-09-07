# Portfolio Requirements — Sabari S

**Version:** 1.0 · **Date:** 2026-09-07 · **Owner:** Sabari S · **Builder:** Claude Code (VS Code)

---

## 1. Overview

| | |
|---|---|
| **Product** | Single-page personal portfolio for Sabari S, Full Stack Developer (Next.js / TypeScript / PostgreSQL · Java / Spring Boot) |
| **Goal** | Convince recruiters and engineering leads within 30 seconds that Sabari ships production platforms solo, and get them to email or open LinkedIn |
| **Reference** | https://aruneshj.me — replicate **section order, information density, one-page scroll rhythm, terminal-style section labels, timeline layout, YAML/code-style stack block, big-number stats, footer**. Do **not** copy its DevOps colour scheme, copy, icons or pipeline names |
| **Theme** | Dark, editor/IDE-inspired. The whole page feels like a well-organised codebase: syntax-coloured accents, monospace labels, code panels, a "build log" loading intro, git-log career timeline, `package.json`-style stack block |
| **Audience** | Recruiters, hiring managers, senior engineers, agency clients. Desktop and mobile equally |
| **Out of scope** | Blog, CMS, contact form backend, dark/light toggle (dark only), multi-page routing, analytics beyond Vercel Analytics, i18n |

### Assumptions
- No profile photo and no project screenshots exist. All visuals are code/CSS/SVG-generated.
- The site is hosted on Vercel at a custom domain (TBD — see `TODO_DOMAIN` in `content.ts`). Until then the `*.vercel.app` URL is the canonical URL.
- Resume PDF link is TBD (`TODO_RESUME_URL`). Resume buttons are hidden until it's set.

---

## 2. Design system

### 2.1 Colour tokens (CSS variables in `globals.css`)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0A0D12` | Page background (near-black, blue-tinted) |
| `--bg-elev` | `#10151C` | Cards, panels |
| `--bg-elev-2` | `#161C25` | Nested panels, code blocks |
| `--border` | `#1F2733` | Hairline borders |
| `--border-strong` | `#2B3544` | Hover borders |
| `--fg` | `#E6EAF0` | Primary text |
| `--fg-muted` | `#8B97A8` | Secondary text |
| `--fg-faint` | `#586374` | Labels, line numbers |
| `--accent` | `#F5B944` | Primary accent (amber — warm, distinct from the green reference site). Headline highlights, primary buttons, active states |
| `--accent-2` | `#5EEAD4` | Secondary accent (teal). Links, tags, "live" indicators |
| `--success` | `#4ADE80` | Status dots, test-pass indicators |
| `--syntax-key` | `#7DD3FC` | JSON keys / YAML keys in code panels |
| `--syntax-str` | `#FCA5A5` | Strings in code panels |
| `--syntax-num` | `#C4B5FD` | Numbers |
| `--syntax-comment` | `#586374` | Comments |

Backgrounds get a **subtle dot-grid** (`radial-gradient` 1px dots, 24px spacing, 6% opacity) plus a slow-moving **radial glow** in `--accent` at 8% opacity that follows the cursor on desktop (see Motion M-2).

### 2.2 Typography
- **Display / body:** Geist Sans via `next/font`. Hero name at `clamp(3rem, 10vw, 8rem)`, weight 800, tracking `-0.04em`, uppercase.
- **Mono:** JetBrains Mono for section labels, tags, code panels, stats numbers, clock, footer.
- Body 16–18px, line-height 1.65, max width 68ch for paragraphs.

### 2.3 Components
- **SectionHeading**: mono label line (e.g. `01 — // about`) in `--fg-faint`, then a large display heading with one phrase highlighted in `--accent`.
- **Tag**: mono, 12px, `--bg-elev-2` background, 1px border, radius 6px. Hover lifts border to `--border-strong`.
- **Card**: `--bg-elev`, 1px `--border`, radius 14px, 1px inset top highlight (`rgba(255,255,255,.04)`). Hover: border brightens, translateY(-2px), soft `--accent` glow.
- **CodePanel**: macOS-style window chrome (three dots + filename tab), line numbers, syntax-coloured content. Used for the identity card, stack block, and project "browser frames".
- **BrowserFrame**: same chrome but with a URL bar; body is a **CSS-built abstract UI mock** (skeleton bars, coloured blocks, a mini table, a status pill) that animates in. This replaces screenshots.
- **Buttons**: primary = `--accent` fill, dark text; secondary = 1px border, transparent; both radius 10px, mono label, arrow icon that nudges right on hover.

### 2.4 Layout
- Max content width 1200px, 24px gutters mobile, 48px desktop.
- Sections separated by 120px (desktop) / 80px (mobile) vertical space.
- Sticky top nav (blur + 1px bottom border once scrolled). Mobile: hamburger → full-screen overlay menu.

---

## 3. Sections (in order)

All copy comes from `content.ts`. Field names in **`code`** refer to keys in that file.

### S-0 Loading intro ("build log")
Full-screen overlay shown once per session (`sessionStorage` flag). Fake terminal in a CodePanel:

```
sabari@vercel ~/portfolio $ pnpm build && vercel --prod
```
Then four stages animate in sequence with a spinner → ✓: **Type-check** · **Migrate** · **Build** · **Deploy**, with log lines such as `› tsc --noEmit … 0 errors`, `› 65 migrations applied`, `› Route (app) / … 12.4 kB`, `› Aliased to <domain>`. Progress bar 0→100% over ~2.4s total. Then the overlay slides up and the hero animates in. **Skip** button (mono, bottom-right) and auto-skip if `prefers-reduced-motion`.

### S-1 Navbar
Left: monogram badge **`SS`** in a 32px rounded square (`--accent` border, mono) + name + role. Centre: anchors Home · About · Work · Stack · Built · Resume · Contact. Right: live status pill (`● online` green dot + live IST clock `HH:MM:SS`) and **Let's talk** primary button → `#contact`. Active section is underlined via IntersectionObserver.

### S-2 Hero
- Eyebrow (mono): `hero.eyebrow` → "Full Stack Developer"
- H1: `hero.name` → **SABARI S**
- Subline: `hero.tagline`
- Buttons: Let's connect (#contact) · View the work (#work) · Resume (hidden if TODO)
- **Status strip** (4 mono cells, like the reference): `status operational` · `region Coimbatore · IN` · `since Nov 2025 · 1y` · `local HH:MM:SS`
- **Right column — Identity CodePanel** (replaces the profile photo): filename tab `sabari.json`, content rendered from `identity` with syntax colours:
  ```json
  {
    "name": "Sabari S",
    "role": "full-stack developer",
    "stack": ["next.js", "typescript", "postgres", "spring-boot"],
    "base": "11.0168° N · 76.9558° E",
    "tz": "IST · UTC+05:30",
    "shipping_since": "2025-11",
    "status": "open_to_work"
  }
  ```
  A blinking block cursor sits after the closing brace. Panel has a slight 3D tilt following the mouse (M-4).
- **Mini commit graph** under the buttons (decorative SVG): dots and branch lines with labels `main` → `feat/zora-mcp` → `merge` → `v1.0 · deployed`, drawn with stroke animation.
- **Skills marquee** full-width at the bottom of the hero: two rows scrolling opposite directions, pause on hover, items from `hero.marquee`.
- "scroll ↓" indicator bouncing gently.

### S-3 About — label `01 — // about`
- Heading: `about.headline` (two lines; second phrase highlighted).
- Lead: `about.lead` (large, 20–22px).
- Two body paragraphs: `about.body[]`.
- Three **Principle** cards in a row (`about.principles[]`): number `01/02/03`, title, one line. Staggered reveal; hover raises card.

### S-4 Work — label `02 — git log --career`
- Heading: `work.headline`.
- Vertical timeline with a glowing rail on the left. Each `work.roles[]` entry is a node: mono badge `release/YYYY.MM` (first has `— HEAD`), company, dates + duration, title (badge `now` on current), description paragraph, tags.
- **Sub-projects inside a role**: when a role has `projects[]`, render them as two nested cards under the description (Zora, KNK) with a name, live link, one-line summary and 3 bullet outcomes. This is our only structural deviation from the reference and is required because both products sit under one employer.
- Nodes animate in as they scroll into view; the rail draws downward with scroll progress (`useScroll` + `scaleY`).

### S-5 Stats — label `02a — EXPLAIN ANALYZE`
- Sub-heading `stats.headline`, sub-line `stats.sub`.
- Four big numbers (`stats.items[]`): value counts up from 0 when in view (CountUp), suffix rendered separately (`+`), label beneath. Numbers in mono at ~56px, `--accent`.

### S-6 Stack — label `03 — cat package.json`
- Heading `stack.headline`. Kicker line `stack.kicker`.
- Left: **CodePanel** with filename tab `stack.json`, rendering `stack.groups` as syntax-coloured JSON with line numbers, ending in a comment line `// mode: ship_end_to_end`. Lines type in on first view (fast, 8ms/char, then instantly complete on reduced motion).
- Right: three **domain cards** (`stack.cards[]`): verb (`build` / `store` / `secure`), title, comma list. Hovering a card highlights the corresponding lines in the JSON panel (shared `hoveredGroup` state).
- Below: full tag cloud of every skill in `stack.groups` (collapsible "show all 60+" on mobile).

### S-7 Built — label `04 — SELECT * FROM projects WHERE status = 'live'`
- Heading `built.headline` ("Shipped, not claimed.").
- **Featured projects** (`built.featured[]`, two entries, side-by-side on desktop, stacked on mobile). Each is a large card: kicker (`live · production · solo`), name, one-paragraph description, three feature rows (title bold + one line), tech list, **BrowserFrame** with URL bar showing the live domain and an animated abstract UI mock, and buttons **Visit live ↗** (external) — no GitHub button (source is private).
- **Open source row** (`built.repos[]`): compact cards with repo name, one-line description, language dot, role badge (`author`), external link. Label above: `open source · github.com/sabarisakthivel`.
- **Publication** (`built.publication`): one slim card with title, dates, venue line, tech tags.
- **Education** (`built.education[]`): degree, field, institution + location, years, score.

### S-8 Contact — label `05 — curl -X POST /contact`
- Heading `contact.headline`. Body `contact.body`.
- Buttons: **Email me** (mailto), **LinkedIn**, **GitHub**.
- Copy-to-clipboard line styled as a terminal command: `$ echo sabaris.officialwork@gmail.com | pbcopy` → on click copies, shows `✓ copied to clipboard`.
- Meta row: `base: Coimbatore, Tamil Nadu, IN` · coordinates link to Google Maps · `tz: IST · UTC+05:30` · `availability: immediate joiner · any location`.

### S-9 Footer
Monogram + name, `© 2026 · built with Next.js · deployed on Vercel from Coimbatore · status: operational`. Links: LinkedIn · GitHub · Email · Back to top ↑.

---

## 4. Motion & graphics requirements

Motion is a first-class requirement ("more graphics and motion than the reference"). Every item below is required unless marked optional. All use Framer Motion; all degrade to a simple fade under `prefers-reduced-motion`.

| ID | Where | Behaviour |
|---|---|---|
| M-1 | Global | Scroll-reveal: sections and cards fade + rise 24px with 60ms stagger between siblings; `once: true`, `amount: 0.2` |
| M-2 | Global | Cursor spotlight: 600px radial `--accent` glow at 8% following the pointer (desktop only, `pointer: fine`), plus static dot-grid |
| M-3 | Loading | Build-log sequence and progress bar as specified in S-0 |
| M-4 | Hero | Identity CodePanel 3D tilt (±6°) following mouse position; resets on leave |
| M-5 | Hero | Tagline types in character by character after the name lands (~40ms/char), then a blinking caret remains |
| M-6 | Hero | Skills marquee, two rows, opposite directions, ~40s loop, pause on hover |
| M-7 | Hero | Commit-graph SVG path draw (`pathLength` 0→1) on load |
| M-8 | Navbar | Live IST clock ticking every second; active link underline slides between items (`layoutId`) |
| M-9 | Work | Timeline rail fills with scroll progress; each node's dot pulses once when it enters view |
| M-10 | Stats | CountUp from 0 to value over 1.6s with ease-out, triggered once in view |
| M-11 | Stack | JSON panel typewriter; hover-linking between cards and JSON lines |
| M-12 | Built | BrowserFrame mock content animates in (skeleton bars grow, blocks fade, status pill flips to `● live`) on first view; card hover applies subtle glow + lift |
| M-13 | Contact | Copy button success state with a check icon morph |
| M-14 | Global | Smooth scrolling for anchor links; section headings have a 1px accent underline that draws in on view |
| M-15 (optional) | Hero background | Slow-drifting, blurred gradient blobs (accent + teal) at 10% opacity |

Performance guard: no animation may run on the main thread continuously except the marquee (CSS transform) and the clock. Use `will-change: transform` sparingly; no layout-shifting animations.

---

## 5. SEO, metadata, accessibility

- `metadata` in `layout.tsx` from `site` object: title `Sabari S | Full Stack Developer — Next.js, TypeScript, PostgreSQL, Spring Boot`, description, keywords, OpenGraph + Twitter card, `robots: index, follow`, `themeColor: #0A0D12`, canonical.
- **Dynamic OG image** via `app/opengraph-image.tsx` (ImageResponse): dark background, name, role, three stack chips — no photo needed.
- JSON-LD `Person` schema (name, jobTitle, url, sameAs [LinkedIn, GitHub], address locality Coimbatore).
- `sitemap.ts` and `robots.ts` generated.
- Semantic landmarks (`header`, `main`, `section` with `aria-labelledby`, `footer`), skip-to-content link, all external links `rel="noopener noreferrer"`, colour contrast ≥ 4.5:1 for body text (muted text on `--bg-elev` must be verified).
- Vercel Analytics (`@vercel/analytics`) added; Speed Insights optional.

---

## 6. Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1 | `pnpm build` passes with zero TypeScript and ESLint errors |
| AC-2 | All nine sections render in the specified order with content sourced only from `content.ts`; no visible `TODO` strings |
| AC-3 | Loading intro completes in ≤ 3s, can be skipped, and does not replay within the same session |
| AC-4 | Every motion item M-1…M-14 is present; with OS reduced-motion enabled, the page shows no movement beyond fades and the intro is skipped |
| AC-5 | Lighthouse (mobile, Vercel preview): Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 |
| AC-6 | Layout is correct at 360px, 768px, 1024px, 1440px widths with no horizontal scroll |
| AC-7 | Keyboard-only navigation reaches every link/button with a visible focus ring; skip link works |
| AC-8 | All external links (LinkedIn, GitHub, live sites, mailto) open correctly; email copy button copies the exact address |
| AC-9 | OG image renders at `/opengraph-image` and previews correctly when the URL is pasted into LinkedIn/WhatsApp |
| AC-10 | Deployed to Vercel production; `vercel.json` not required; no runtime env vars |

---

## 7. Open questions (fill in `content.ts` when known)

1. `TODO_DOMAIN` — custom domain (e.g. `sabaris.dev`). Default to the Vercel URL.
2. `TODO_RESUME_URL` — public PDF or Google Drive link for the Resume buttons.
3. Whether to display the phone number in Contact (currently `showPhone: false`).
