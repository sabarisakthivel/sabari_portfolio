"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";
import { EASE, useReducedMotionSafe } from "@/lib/motion";

/**
 * Requirements M-10 — counts from zero over 1.6s, once, when scrolled into view.
 *
 * The value starts at its final number so the server HTML carries the real
 * figure; the reset to zero happens on mount, well before the stats reach the
 * viewport. Reduced motion keeps the final value and never animates.
 */
export function CountUp({
  value,
  durationMs = 1600,
  className,
}: {
  value: number;
  durationMs?: number;
  className?: string;
}) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reduced) return;
    setDisplay(0);
  }, [reduced]);

  useEffect(() => {
    if (reduced || !inView) return;
    const controls = animate(0, value, {
      duration: durationMs / 1000,
      ease: EASE,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, reduced, value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
