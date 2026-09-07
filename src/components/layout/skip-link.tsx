import { ui } from "@/data/content";

/** Requirements §5 — first tab stop, visible only when focused. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-btn focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-bg"
    >
      {ui.skipLink}
    </a>
  );
}
