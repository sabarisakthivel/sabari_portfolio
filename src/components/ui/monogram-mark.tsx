import { cn } from "@/lib/utils";

/**
 * The S mark: one continuous ribbon — top bar, left corner, diagonal, right
 * corner, bottom bar — drawn as a single stroked path.
 *
 * It was three separate paths before, which left visible breaks where they
 * met and fell apart at favicon size. Mitred joins and butt caps keep the
 * square terminals of the original.
 *
 * Decorative: every use already has a text label or an sr-only name beside it.
 */
export function MonogramMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={13}
      strokeLinecap="butt"
      strokeLinejoin="miter"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      <path d="M53 12 H29 a10 10 0 0 0 -10 10 L46 42 a10 10 0 0 1 -10 10 H11" />
    </svg>
  );
}
