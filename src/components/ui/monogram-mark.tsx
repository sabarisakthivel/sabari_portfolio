import { cn } from "@/lib/utils";

/**
 * The S mark, drawn as three strokes: the top hook, the diagonal, and the
 * bottom hook. Stroke-based rather than a filled outline so the weight can be
 * tuned in one place, and `currentColor` so it inherits whatever it sits in.
 *
 * Decorative by default — every place it is used already has a text label
 * beside it or a `sr-only` name on the link.
 */
export function MonogramMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={11}
      strokeLinecap="butt"
      strokeLinejoin="miter"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      <path d="M52 11 H27 a11 11 0 0 0 -11 11 v3" />
      <path d="M16 25 L48 46" />
      <path d="M12 53 H37 a11 11 0 0 0 11 -11 v-3" />
    </svg>
  );
}
