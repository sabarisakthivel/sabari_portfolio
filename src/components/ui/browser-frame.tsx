"use client";

import { m } from "motion/react";
import type { Variants } from "motion/react";
import { Lock, ShieldCheck } from "lucide-react";
import { PanelChrome } from "@/components/ui/code-panel";
import { EASE, useReducedMotionSafe, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* Requirements M-12 — the mock paints itself in on first view. */
const parent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const barIn: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: EASE },
  },
};

const blockIn: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

const pillIn: Variants = {
  hidden: { opacity: 0, rotateX: -90 },
  visible: {
    opacity: 1,
    rotateX: 0,
    transition: { duration: 0.5, ease: EASE, delay: 0.35 },
  },
};

/**
 * Replaces project screenshots (Requirements §2.3 / §S-7): window chrome, a URL
 * bar with the live domain, and an abstract UI built from CSS and SVG only.
 */
export function BrowserFrame({
  domain,
  theme,
  className,
}: {
  domain: string;
  theme: "ops" | "matrimony";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inset-top-highlight overflow-hidden rounded-panel border border-border bg-bg-elev",
        className,
      )}
      aria-hidden
    >
      <PanelChrome className="gap-3">
        <span className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-border bg-bg px-3 py-1">
          <Lock className="size-3 shrink-0 text-success" />
          <span className="min-w-0 truncate font-mono text-[11px] text-fg-muted">
            {domain}
          </span>
        </span>
      </PanelChrome>

      <m.div
        className="dot-grid bg-bg p-4"
        variants={parent}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        {theme === "ops" ? <OpsMock /> : <MatrimonyMock />}
      </m.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Bar({ className }: { className?: string }) {
  return (
    <m.span
      variants={barIn}
      className={cn(
        "block h-1.5 origin-left rounded-full bg-border",
        className,
      )}
    />
  );
}

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "live" | "queued";
}) {
  return (
    <m.span
      variants={pillIn}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[9px] leading-none",
        tone === "live"
          ? "border-success/30 bg-success/10 text-success"
          : "border-border bg-bg-elev-2 text-fg-faint",
      )}
    >
      <span
        className={cn(
          "size-1 rounded-full",
          tone === "live" ? "bg-success" : "bg-fg-faint",
        )}
      />
      {label}
    </m.span>
  );
}

/** Zora: delivery board — table rows, status pills, a route map block. */
function OpsMock() {
  const reduced = useReducedMotionSafe();
  const rows = [
    { w: "w-2/3", tone: "live" as const, label: "live" },
    { w: "w-1/2", tone: "live" as const, label: "live" },
    { w: "w-4/5", tone: "queued" as const, label: "queued" },
    { w: "w-3/5", tone: "queued" as const, label: "queued" },
  ];

  return (
    <div className="grid grid-cols-5 gap-3">
      <m.div
        variants={blockIn}
        className="col-span-3 space-y-2 rounded-lg border border-border bg-bg-elev p-3"
      >
        <div className="flex items-center justify-between border-b border-border pb-2">
          <Bar className="w-16 bg-fg-faint" />
          <Bar className="w-8" />
        </div>
        {rows.map((row) => (
          <div key={row.w + row.label} className="flex items-center gap-2 py-1">
            <span className="size-4 shrink-0 rounded-sm bg-bg-elev-2" />
            <Bar className={row.w} />
            <span className="ml-auto shrink-0">
              <StatusPill label={row.label} tone={row.tone} />
            </span>
          </div>
        ))}
      </m.div>

      <div className="col-span-2 space-y-3">
        <m.div
          variants={blockIn}
          className="relative overflow-hidden rounded-lg border border-border bg-bg-elev-2"
        >
          <svg
            viewBox="0 0 120 90"
            className="h-full w-full"
            preserveAspectRatio="none"
          >
            <g stroke="var(--border)" strokeWidth="0.5">
              <path d="M0 22 H120 M0 45 H120 M0 68 H120 M30 0 V90 M60 0 V90 M90 0 V90" />
            </g>
            <m.path
              d="M14 74 C36 66 30 44 52 40 C74 36 78 24 104 18"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              // Props stay mounted; only the duration changes. Removing them
              // when `reduced` resolves after hydration left this path stuck
              // at the server's pathLength 0 — an invisible route line.
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={VIEWPORT}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 1.2, ease: EASE, delay: 0.3 }
              }
            />
            <circle cx="14" cy="74" r="3.5" fill="var(--accent)" />
            <circle cx="52" cy="40" r="2.5" fill="var(--accent-2)" />
            <circle cx="104" cy="18" r="3.5" fill="var(--accent-2)" />
          </svg>
        </m.div>
        <m.div
          variants={blockIn}
          className="space-y-2 rounded-lg border border-border bg-bg-elev p-3"
        >
          <Bar className="w-10 bg-accent/50" />
          <Bar className="w-full" />
          <Bar className="w-3/4" />
        </m.div>
      </div>
    </div>
  );
}

/** KNK: member grid — profile cards plus an encrypted-record badge. */
function MatrimonyMock() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <m.span
          variants={pillIn}
          className="inline-flex items-center gap-1.5 rounded-full border border-accent-2/30 bg-accent-2/10 px-2 py-0.5 font-mono text-[9px] leading-none text-accent-2"
        >
          <ShieldCheck className="size-2.5" />
          AES-256-GCM
        </m.span>
        <Bar className="w-16" />
        <Bar className="ml-auto w-8" />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
          <m.div
            key={index}
            variants={blockIn}
            className="space-y-1.5 rounded-lg border border-border bg-bg-elev p-2"
          >
            <span
              className={cn(
                "block size-6 rounded-full",
                index % 3 === 0 ? "bg-accent/25" : "bg-bg-elev-2",
              )}
            />
            <Bar className="w-full" />
            <Bar className="w-2/3" />
          </m.div>
        ))}
      </div>
    </div>
  );
}
