"use client";

import { m } from "motion/react";
import { EASE, useReducedMotionSafe, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* Geometry. The SVG rails and the HTML label rows share these numbers, so the
   whole graph scales by changing ROW and the two lane positions. */
const ROW = 38;
const ROWS = 5;
const HEIGHT = ROW * ROWS;
const TRUNK_X = 11;
const BRANCH_X = 31;
const WIDTH = 42;
const DOT_R = 4.5;

/** Vertical centre of each row. */
const CENTRES = Array.from({ length: ROWS }, (_, i) => ROW * i + ROW / 2);
const [first, second, , fourth, last] = CENTRES;

const TRUNK = `M${TRUNK_X} ${first} L${TRUNK_X} ${last}`;
const BRANCH =
  `M${TRUNK_X} ${first + ROW / 2} ` +
  `C${TRUNK_X} ${first + ROW} ${BRANCH_X} ${second - ROW / 3} ${BRANCH_X} ${second} ` +
  `L${BRANCH_X} ${fourth - ROW} ` +
  `C${BRANCH_X} ${fourth - ROW / 3} ${TRUNK_X} ${fourth - ROW / 2} ${TRUNK_X} ${fourth}`;

/**
 * Requirements §S-2 / M-7 — decorative `git log --graph` of the last year:
 * a trunk, two feature branches, the merge and the release.
 *
 * Laid out vertically so the labels keep full size at 360px; a horizontal
 * version needs ~550px of label text and shrinks to unreadable on a phone.
 * The strokes draw in on view; `pathLength` is neither a transform nor an
 * opacity, so MotionConfig will not neutralise it and reduced motion is
 * handled here explicitly.
 */
export function CommitGraph({
  labels,
  className,
}: {
  labels: readonly string[];
  className?: string;
}) {
  const reduced = useReducedMotionSafe();

  const draw = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { pathLength: 0 },
          whileInView: { pathLength: 1 },
          viewport: VIEWPORT,
          transition: { duration: 1.1, ease: EASE, delay },
        };

  return (
    <div className={cn("relative max-w-sm", className)} role="presentation">
      <svg
        aria-hidden
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        fill="none"
        className="absolute top-0 left-0"
      >
        <m.path
          d={TRUNK}
          stroke="var(--border-strong)"
          strokeWidth="2"
          strokeLinecap="round"
          {...draw(0)}
        />
        <m.path
          d={BRANCH}
          stroke="var(--accent-2)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.75"
          {...draw(0.25)}
        />

        {CENTRES.map((cy, index) => {
          const onBranch = index === 1 || index === 2;
          const isLast = index === CENTRES.length - 1;
          return (
            <m.circle
              key={cy}
              cx={onBranch ? BRANCH_X : TRUNK_X}
              cy={cy}
              r={DOT_R}
              fill={isLast ? "var(--accent)" : "var(--bg)"}
              stroke={onBranch ? "var(--accent-2)" : "var(--accent)"}
              strokeWidth="2"
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={VIEWPORT}
              transition={{
                duration: 0.4,
                ease: EASE,
                delay: 0.3 + index * 0.14,
              }}
              style={{ originX: "50%", originY: "50%" }}
            />
          );
        })}
      </svg>

      <m.ol
        className="ml-14"
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        variants={{
          visible: { transition: { staggerChildren: 0.14, delayChildren: 0.3 } },
        }}
      >
        {labels.map((label, index) => (
          <m.li
            key={label}
            variants={{
              hidden: { opacity: 0, x: -6 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.4, ease: EASE },
              },
            }}
            className={cn(
              "flex items-center font-mono text-[13px] whitespace-nowrap",
              index === labels.length - 1 ? "text-accent" : "text-fg-muted",
            )}
            style={{ height: `${ROW}px` }}
          >
            {label}
          </m.li>
        ))}
      </m.ol>
    </div>
  );
}
