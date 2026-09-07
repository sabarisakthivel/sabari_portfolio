"use client";

import { useRef } from "react";
import { m, useScroll, useSpring } from "motion/react";
import { EASE, useReducedMotionSafe } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Requirements M-9 — the career rail fills as the section scrolls past.
 * With reduced motion the fill is simply drawn in full and nothing tracks
 * the scroll position.
 */
export function Timeline({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    mass: 0.4,
  });

  return (
    <div ref={ref} className={cn("relative", className)}>
      <span
        aria-hidden
        className="absolute top-3 bottom-0 left-[7px] w-px bg-border"
      />
      <m.span
        aria-hidden
        style={reduced ? undefined : { scaleY }}
        className="absolute top-3 bottom-0 left-[7px] w-px origin-top bg-gradient-to-b from-accent via-accent-2/50 to-transparent"
      />
      {children}
    </div>
  );
}

/** A node marker that pulses once as it enters view (M-9). */
export function TimelineDot() {
  return (
    <m.span
      aria-hidden
      className="absolute top-1.5 left-0 size-3.5 rounded-full border-2 border-accent bg-bg shadow-[0_0_0_4px_var(--bg),0_0_14px_var(--accent-soft)]"
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: [0.5, 1.35, 1] }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.65, ease: EASE }}
    />
  );
}
