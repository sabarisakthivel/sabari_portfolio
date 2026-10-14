/**
 * Raw token values for contexts that cannot read CSS custom properties —
 * currently only the generated OpenGraph image, which Satori renders outside
 * the document.
 *
 * Keep in sync with the `:root` block in src/app/globals.css; that file stays
 * the source of truth for everything rendered in the browser.
 */
export const tokens = {
  bg: "#0c0c0c",
  bgElev: "#141416",
  bgElev2: "#1c1c21",
  border: "#2a2d31",
  fg: "#d7e2ea",
  fgMuted: "#a3afb8",
  fgFaint: "#808b94",
  accent: "#e46ad9",
  accent2: "#b48cf0",
} as const;
