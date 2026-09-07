"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import {
  Check,
  Database,
  FileCode2,
  Loader2,
  Package,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { loader } from "@/data/content";
import { cn } from "@/lib/utils";

const TOTAL_MS = 2200;
const TICK_MS = 60;

/** Pending-state glyph per stage; falls back if the stage list changes. */
const STAGE_ICON: Record<string, LucideIcon> = {
  "Type-check": FileCode2,
  Migrate: Database,
  Build: Package,
  Deploy: Rocket,
};

/**
 * Requirements §S-0 / M-3 — the deploy pipeline intro.
 *
 * A horizontal stepper: each stage is a node on a rail that fills as the run
 * progresses, with one status line and a percentage beneath it.
 *
 * It plays on every load, refresh included — a deliberate departure from
 * AC-3's once-per-session rule.
 *
 * The overlay is server-rendered so it covers the page from the very first
 * paint. A blocking script in `layout.tsx` injects a stylesheet hiding it for
 * anyone who prefers reduced motion; this component then unmounts it on mount.
 * That ordering is what keeps those users from seeing a flash of terminal.
 */
export function BuildLog() {
  const [visible, setVisible] = useState(true);
  const [elapsed, setElapsed] = useState(0);

  const dismiss = useCallback(() => setVisible(false), []);

  // Reduced motion: never run the sequence (AC-4). The flag is set by the
  // blocking script in layout.tsx, which has already hidden this overlay with
  // an injected stylesheet.
  useEffect(() => {
    if ((window as { __introSkip?: number }).__introSkip === 1) {
      setVisible(false);
      return;
    }
    const start = performance.now();
    const id = window.setInterval(() => {
      const next = Math.min(TOTAL_MS, performance.now() - start);
      setElapsed(next);
      if (next >= TOTAL_MS) window.clearInterval(id);
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (elapsed < TOTAL_MS) return;
    const id = window.setTimeout(dismiss, 260);
    return () => window.clearTimeout(id);
  }, [elapsed, dismiss]);

  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter") dismiss();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [visible, dismiss]);

  const ratio = elapsed / TOTAL_MS;
  const percent = Math.round(ratio * 100);
  const count = loader.stages.length;
  const activeIndex = Math.min(count - 1, Math.floor(ratio * count));

  // The rail spans node centres: the first sits at half a column in, the last
  // at half a column from the end.
  const half = 100 / count / 2;
  const span = 100 - half * 2;

  return (
    <AnimatePresence>
      {visible ? (
        <m.div
          key="build-log"
          className="build-log fixed inset-0 z-100 flex items-center justify-center overflow-hidden bg-bg px-6"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.7, 0, 0.84, 0] }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute size-[40rem] rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, var(--wash-a), transparent)",
            }}
          />

          <div aria-hidden className="relative w-full max-w-xl">
            <p className="font-mono text-[13px]">
              <span className="text-accent-2">{loader.host}</span>{" "}
              <span className="text-fg-muted">{loader.command}</span>
            </p>

            <div className="relative mt-10">
              <span
                aria-hidden
                className="absolute top-[13px] h-px bg-border"
                style={{ left: `${half}%`, right: `${half}%` }}
              />
              <span
                aria-hidden
                className="absolute top-[13px] h-px bg-accent transition-[width] duration-200 ease-linear"
                style={{ left: `${half}%`, width: `${span * ratio}%` }}
              />

              <ol
                className="relative grid"
                style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
              >
                {loader.stages.map((stage, index) => {
                  const done = index < activeIndex || ratio >= 1;
                  const active = index === activeIndex && ratio < 1;
                  const Icon = STAGE_ICON[stage.label] ?? Package;

                  return (
                    <li
                      key={stage.label}
                      className="flex flex-col items-center gap-3"
                    >
                      <span
                        className={cn(
                          "grid size-[27px] place-items-center rounded-full border transition-colors duration-300",
                          done && "border-accent bg-accent text-bg",
                          active && "border-accent bg-bg text-accent",
                          !done && !active && "border-border bg-bg text-fg-faint",
                        )}
                      >
                        {done ? (
                          <Check className="size-3.5" />
                        ) : active ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Icon className="size-3.5" />
                        )}
                      </span>
                      <span
                        className={cn(
                          "font-mono text-[10px] tracking-[0.14em] uppercase transition-colors duration-300",
                          done || active ? "text-fg" : "text-fg-faint",
                        )}
                      >
                        {stage.label}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="mt-10 flex items-baseline justify-between gap-6">
              <p className="min-w-0 truncate font-mono text-[13px] text-fg-muted">
                {loader.stages[activeIndex].log}
              </p>
              <p className="shrink-0 font-mono text-2xl font-semibold tabular-nums">
                {percent}
                <span className="text-base text-fg-faint">%</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={dismiss}
            className="fixed right-6 bottom-6 rounded-btn border border-border px-3 py-1.5 font-mono text-xs text-fg-muted transition-colors duration-200 hover:border-border-strong hover:text-fg"
          >
            {loader.skipLabel}
          </button>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
