"use client";

import { m } from "motion/react";
import { EASE, useReducedMotionSafe, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* Rail geometry. The SVG keeps a fixed width so the node rings never distort;
   only the label columns beside it flex. */
const ROW = 62;
const RAIL_W = 110;
const TRUNK_X = 22;
const BRANCH_X = 88;
const DOT_R = 7;

/** Which lane each commit sits on — the branch swings out for the two feature
    commits and merges back. Labels follow the lane: trunk left, branch right. */
const ON_BRANCH = [false, true, true, false, false];

const centreOf = (index: number) => ROW * index + ROW / 2;

export function CommitGraph({
  labels,
  className,
}: {
  labels: readonly string[];
  className?: string;
}) {
  const reduced = useReducedMotionSafe();

  const rows = labels.length;
  const height = ROW * rows;
  const c = (i: number) => centreOf(i);

  // Smooth cubic S-curves out of and back into the trunk, mirroring the
  // reference's wide sweep rather than a tight corner.
  const branch =
    `M${TRUNK_X} ${c(0)} ` +
    `C${TRUNK_X} ${c(0) + ROW / 2} ${BRANCH_X} ${c(1) - ROW / 2} ${BRANCH_X} ${c(1)} ` +
    `L${BRANCH_X} ${c(2)} ` +
    `C${BRANCH_X} ${c(2) + ROW / 2} ${TRUNK_X} ${c(3) - ROW / 2} ${TRUNK_X} ${c(3)}`;

  // The animation props must stay mounted. Stripping them when `reduced` flips
  // true after hydration leaves the element frozen at whatever `initial` the
  // server committed — for a pathLength that is strokeDasharray "0px, 1px",
  // i.e. an invisible line. Vary the duration instead.
  const draw = (delay: number) => ({
    initial: { pathLength: 0 },
    whileInView: { pathLength: 1 } as const,
    viewport: VIEWPORT,
    transition: reduced
      ? { duration: 0 }
      : { duration: 1.2, ease: EASE, delay },
  });

  return (
    <div
      role="presentation"
      className={cn(
        "grid items-center",
        // Mobile keeps every label in one column beside the rails; from md the
        // trunk labels move into the left margin, as on the reference.
        "grid-cols-[110px_minmax(0,1fr)] md:grid-cols-[minmax(0,1fr)_110px_minmax(0,1fr)]",
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
        className="col-start-1 row-span-full self-start md:col-start-2"
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
          {...draw(0.15)}
        />

        {labels.map((label, index) => {
          const isLast = index === labels.length - 1;
          return (
            <m.circle
              key={label}
              cx={ON_BRANCH[index] ? BRANCH_X : TRUNK_X}
              cy={c(index)}
              r={DOT_R}
              fill={isLast ? "var(--accent)" : "var(--bg)"}
              stroke="var(--accent)"
              strokeWidth="2"
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={VIEWPORT}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 0.4, ease: EASE, delay: 0.35 + index * 0.13 }
              }
              style={{ originX: "50%", originY: "50%" }}
            />
          );
        })}
      </svg>

      {labels.map((label, index) => (
        <m.p
          key={label}
          initial={{ opacity: 0, x: ON_BRANCH[index] ? 8 : -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VIEWPORT}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.45, ease: EASE, delay: 0.4 + index * 0.13 }
          }
          className={cn(
            "font-mono text-[13px] whitespace-nowrap",
            index === labels.length - 1 ? "text-accent" : "text-fg-muted",
            "col-start-2 pl-4 text-left",
            ON_BRANCH[index]
              ? "md:col-start-3 md:pl-4 md:text-left"
              : "md:col-start-1 md:pr-4 md:pl-0 md:text-right",
          )}
          style={{ gridRow: index + 1 }}
        >
          {label}
        </m.p>
      ))}
    </div>
  );
}
