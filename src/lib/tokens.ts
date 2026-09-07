/**
 * Raw token values for contexts that cannot read CSS custom properties —
 * currently only the generated OpenGraph image, which Satori renders outside
 * the document.
 *
 * Keep in sync with the `:root` block in src/app/globals.css; that file stays
 * the source of truth for everything rendered in the browser.
 */
export const tokens = {
  bg: "#faf8f3",
  bgElev: "#ffffff",
  bgElev2: "#f2efe7",
  border: "#e4e0d4",
  fg: "#17191c",
  fgMuted: "#55585e",
  fgFaint: "#666970",
  accent: "#b8420f",
  accent2: "#0f6e66",
} as const;
