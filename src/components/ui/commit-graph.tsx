"use client";

import { m } from "motion/react";
import { EASE, useReducedMotionSafe, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

const ROW = 28;
/** Row centres: the SVG rails and the label rows share this geometry. */
const CENTRES = [14, 42, 70, 98, 126];
const HEIGHT = ROW * 5;

const TRUNK = "M8 14 L8 126";
const BRANCH = "M8 28 C8 36 24 34 24 42 L24 84 C24 92 8 90 8 98";

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
        width="32"
        height={HEIGHT}
        viewBox={`0 0 32 ${HEIGHT}`}
        fill="none"
        className="absolute top-0 left-0"
      >
        <m.path
          d={TRUNK}
          stroke="var(--border-strong)"
          strokeWidth="1.5"
          strokeLinecap="round"
          {...draw(0)}
        />
        <m.path
          d={BRANCH}
          stroke="var(--accent-2)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
          {...draw(0.25)}
        />

        {CENTRES.map((cy, index) => {
          const onBranch = index === 1 || index === 2;
          const isLast = index === CENTRES.length - 1;
          return (
            <m.circle
              key={cy}
              cx={onBranch ? 24 : 8}
              cy={cy}
              r="3.5"
              fill={isLast ? "var(--accent)" : "var(--bg)"}
              stroke={onBranch ? "var(--accent-2)" : "var(--accent)"}
              strokeWidth="1.5"
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
        className="ml-11"
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        variants={{ visible: { transition: { staggerChildren: 0.14, delayChildren: 0.3 } } }}
      >
        {labels.map((label, index) => (
          <m.li
            key={label}
            variants={{
              hidden: { opacity: 0, x: -6 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
            }}
            className={cn(
              "flex items-center font-mono text-[11px]",
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
