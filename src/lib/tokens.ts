/**
 * Raw token values for contexts that cannot read CSS custom properties —
 * currently only the generated OpenGraph image, which Satori renders outside
 * the document.
 *
 * Keep in sync with the `:root` block in src/app/globals.css; that file stays
 * the source of truth for everything rendered in the browser.
 */
export const tokens = {
  bg: "#f2f5f2",
  bgElev: "#ffffff",
  bgElev2: "#eaeeea",
  border: "#dbe1dc",
  fg: "#0d1210",
  fgMuted: "#3f4a44",
  fgFaint: "#5d6963",
  accent: "#0d7a4e",
  accent2: "#0a5a3a",
} as const;
