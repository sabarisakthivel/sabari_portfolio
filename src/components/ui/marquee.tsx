import { cn } from "@/lib/utils";

/**
 * Requirements M-6 — one row of an infinite skills ticker.
 *
 * The track renders the list twice and slides by exactly half its width, so the
 * loop is seamless. Spacing lives on the items (margin, not flex gap) to keep
 * the two halves identical. Under `prefers-reduced-motion` the global rule in
 * globals.css collapses the animation and the row simply sits still.
 *
 * Marked `aria-hidden`: the content is duplicated and every skill is announced
 * properly by the Stack section's tag cloud.
 */
export function Marquee({
  items,
  direction = "left",
  durationSeconds = 40,
  className,
}: {
  items: readonly string[];
  direction?: "left" | "right";
  durationSeconds?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("group edge-fade-x overflow-hidden py-2", className)}
    >
      <ul
        className={cn(
          "flex w-max group-hover:[animation-play-state:paused]",
          direction === "left" ? "marquee-left" : "marquee-right",
        )}
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {[0, 1].map((copy) =>
          items.map((item) => (
            <li
              key={`${copy}-${item}`}
              className="mr-3 shrink-0 rounded-tag border border-border bg-bg px-3 py-1.5 font-mono text-xs whitespace-nowrap text-fg-muted"
            >
              {item}
            </li>
          )),
        )}
      </ul>
    </div>
  );
}
