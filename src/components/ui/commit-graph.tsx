"use client";

import { useEffect, useState } from "react";
import { m } from "motion/react";
import type { Variants } from "motion/react";
import { INTRO_DONE_EVENT } from "@/components/layout/build-log";
import { EASE, useReducedMotionSafe } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* Rail geometry. The SVG keeps a fixed width so the node rings never distort;
   only the label columns beside it flex. The branch swings a long way out —
   that wide sweep is most of what gives the reference its shape. */
const ROW = 100;
const RAIL_W = 170;
const TRUNK_X = 20;
const BRANCH_X = 140;
const DOT_R = 8;

/** Lane per commit: the branch swings out for the two features, then merges. */
const ON_BRANCH = [false, true, true, false, false];

const centreOf = (index: number) => ROW * index + ROW / 2;

const RING: Variants = {
  hidden: { opacity: 0, scale: 0.4 },
  visible: { opacity: 1, scale: 1 },
};

const DRAW: Variants = {
  hidden: { pathLength: 0 },
  visible: { pathLength: 1 },
};

/**
 * Decorative `git log --graph` of the last year, sitting beside the hero copy.
 *
 * It waits for the loading intro before animating. Anything above the fold
 * plays out behind that overlay otherwise, so by the time the page is revealed
 * the draw has already finished and nobody sees it.
 */
export function CommitGraph({
  labels,
  className,
}: {
  labels: readonly string[];
  className?: string;
}) {
  const reduced = useReducedMotionSafe();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const w = window as { __introDone?: boolean; __introSkip?: number };
    if (w.__introDone || w.__introSkip === 1) {
      setReady(true);
      return;
    }
    const onDone = () => setReady(true);
    window.addEventListener(INTRO_DONE_EVENT, onDone);
    // Safety net: never leave the graph hidden if the intro fails to signal.
    const fallback = window.setTimeout(onDone, 4500);
    return () => {
      window.removeEventListener(INTRO_DONE_EVENT, onDone);
      window.clearTimeout(fallback);
    };
  }, []);

  const rows = labels.length;
  const height = ROW * rows;
  const c = centreOf;
  const lastIndex = rows - 1;

  // Long cubic sweeps out of and back into the trunk.
  const branch =
    `M${TRUNK_X} ${c(0)} ` +
    `C${TRUNK_X} ${c(0) + ROW * 0.62} ${BRANCH_X} ${c(1) - ROW * 0.62} ${BRANCH_X} ${c(1)} ` +
    `L${BRANCH_X} ${c(2)} ` +
    `C${BRANCH_X} ${c(2) + ROW * 0.62} ${TRUNK_X} ${c(3) - ROW * 0.62} ${TRUNK_X} ${c(3)}`;

  // Transitions stay mounted and only their duration changes: stripping motion
  // props once `reduced` resolves would strand elements at the server's
  // `initial` state, which for a pathLength is an invisible line.
  const at = (delay: number, duration: number) =>
    reduced ? { duration: 0 } : { duration, ease: EASE, delay };

  const animate = ready ? "visible" : "hidden";

  return (
    <div
      role="presentation"
      className={cn(
        "grid items-center",
        // Mobile keeps every label in one column beside the rails; from md the
        // trunk labels move into the left margin, as on the reference.
        "grid-cols-[170px_minmax(0,1fr)] md:grid-cols-[minmax(0,1fr)_170px_minmax(0,1fr)]",
        className,
      )}
      style={{ gridTemplateRows: `repeat(${rows}, ${ROW}px)` }}
    >
      <svg
        aria-hidden
        width={RAIL_W}
        height={height}
        viewBox={`0 0 ${RAIL_W} ${height}`}
        fill="none"
        className="col-start-1 self-start md:col-start-2"
        style={{ gridRow: `1 / span ${rows}` }}
      >
        {/* Trunk runs the full height, past the first and last commit. */}
        <path
          d={`M${TRUNK_X} 0 L${TRUNK_X} ${height}`}
          stroke="var(--border-strong)"
          strokeWidth="2"
        />
        <m.path
          d={branch}
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          variants={DRAW}
          initial="hidden"
          animate={animate}
          transition={at(0.1, 1.4)}
        />

        {labels.map((label, index) => (
          <m.circle
            key={label}
            cx={ON_BRANCH[index] ? BRANCH_X : TRUNK_X}
            cy={c(index)}
            r={DOT_R}
            fill="var(--bg)"
            stroke="var(--accent)"
            strokeWidth="2"
            variants={RING}
            initial="hidden"
            animate={animate}
            transition={at(0.3 + index * 0.16, 0.4)}
            style={{ originX: "50%", originY: "50%" }}
          />
        ))}
      </svg>

      {labels.map((label, index) => {
        // The release sits on the trunk but its badge reads on the right, as
        // on the reference.
        const onRight = ON_BRANCH[index] || index === lastIndex;
        const isRelease = index === lastIndex;

        return (
          <m.p
            key={label}
            data-reveal
            variants={{
              hidden: { opacity: 0, x: onRight ? 10 : -10 },
              visible: { opacity: 1, x: 0 },
            }}
            initial="hidden"
            animate={animate}
            transition={at(0.36 + index * 0.16, 0.45)}
            className={cn(
              // 11px on mobile: at 13px the longest branch name runs past the
              // gutter once the rail takes its 170px.
              "font-mono text-[11px] whitespace-nowrap md:text-[13px]",
              "col-start-2 pl-4 text-left",
              onRight
                ? "md:col-start-3 md:pl-5 md:text-left"
                : "md:col-start-1 md:pr-5 md:pl-0 md:text-right",
              // The release badge belongs beside its node on the trunk, not out
              // in the right-hand label column, so it spans across the rail.
              isRelease && "md:col-start-2 md:col-end-4 md:pl-10",
              !isRelease && "text-fg-muted",
            )}
            style={{ gridRow: index + 1 }}
          >
            {isRelease ? (
              <span className="inline-flex rounded-full bg-accent px-3 py-1.5 text-bg">
                {label}
              </span>
            ) : (
              label
            )}
          </m.p>
        );
      })}
    </div>
  );
}
