import { cn } from "@/lib/utils";

const ROW = 28;
/** Row centres: the SVG rails and the label rows share this geometry. */
const CENTRES = [14, 42, 70, 98, 126];
const HEIGHT = ROW * 5;

/**
 * Requirements §S-2 / M-7 — decorative `git log --graph` of the last year:
 * a trunk, two feature branches, the merge and the release. Rendered vertically
 * so the labels stay full size at every width. Phase 4 draws the strokes in.
 */
export function CommitGraph({
  labels,
  className,
}: {
  labels: readonly string[];
  className?: string;
}) {
  return (
    <div className={cn("relative max-w-sm", className)} role="presentation">
      <svg
        aria-hidden
        width="32"
        height={HEIGHT}
        viewBox={`0 0 32 ${HEIGHT}`}
        fill="none"
        className="absolute top-0 left-0"
      >
        {/* trunk */}
        <path
          d="M8 14 L8 126"
          stroke="var(--border-strong)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* branch out, feature lane, merge back */}
        <path
          d="M8 28 C8 36 24 34 24 42 L24 84 C24 92 8 90 8 98"
          stroke="var(--accent-2)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />

        {CENTRES.map((cy, index) => {
          const onBranch = index === 1 || index === 2;
          const isLast = index === CENTRES.length - 1;
          return (
            <circle
              key={cy}
              cx={onBranch ? 24 : 8}
              cy={cy}
              r="3.5"
              fill={isLast ? "var(--accent)" : "var(--bg)"}
              stroke={onBranch ? "var(--accent-2)" : "var(--accent)"}
              strokeWidth="1.5"
            />
          );
        })}
      </svg>

      <ol className="ml-11">
        {labels.map((label, index) => (
          <li
            key={label}
            className={cn(
              "flex items-center font-mono text-[11px]",
              index === labels.length - 1 ? "text-accent" : "text-fg-muted",
            )}
            style={{ height: `${ROW}px` }}
          >
            {label}
          </li>
        ))}
      </ol>
    </div>
  );
}
