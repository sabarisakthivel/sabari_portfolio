"use client";

import { useEffect, useState } from "react";
import { useReducedMotionSafe } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Requirements M-5 — types a line out character by character, leaving a
 * blinking caret.
 *
 * A full-size copy at `opacity-0` sits underneath and reserves the exact final
 * box: the animated copy is absolutely positioned on top, so nothing below the
 * tagline moves while it types (§4 forbids layout-shifting animation). That
 * hidden copy is the accessible one — screen readers and crawlers read the
 * whole sentence immediately, and the visible layer is `aria-hidden`.
 *
 * The spec asks for 40ms/char. At 172 characters that is a seven-second hero,
 * so the rate is capped to finish within MAX_MS.
 */
const CHAR_MS = 40;
const MAX_MS = 2400;

export function Typewriter({
  text,
  className,
  startDelayMs = 0,
}: {
  text: string;
  className?: string;
  startDelayMs?: number;
}) {
  const reduced = useReducedMotionSafe();
  // Starts complete, so the server HTML and the no-JS view show the full line.
  const [count, setCount] = useState(text.length);

  useEffect(() => {
    if (reduced) {
      setCount(text.length);
      return;
    }
    setCount(0);

    const step = Math.min(CHAR_MS, MAX_MS / text.length);
    let typed = 0;
    let interval: number | undefined;

    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        typed += 1;
        setCount(typed);
        if (typed >= text.length && interval) window.clearInterval(interval);
      }, step);
    }, startDelayMs);

    return () => {
      window.clearTimeout(start);
      if (interval) window.clearInterval(interval);
    };
  }, [text, reduced, startDelayMs]);

  return (
    <span className={cn("relative block", className)}>
      <span className="opacity-0 select-none">{text}</span>
      <span aria-hidden className="absolute inset-0">
        {text.slice(0, count)}
        <span className="caret-blink ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.12em] bg-accent" />
      </span>
    </span>
  );
}
