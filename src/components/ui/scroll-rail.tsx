"use client";

import { useRef } from "react";
import { m, useScroll, useSpring } from "motion/react";
import { useReducedMotionSafe } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * A vertical rail down the left of its content (from md) that fills with the
 * contact gradient as the content scrolls through the viewport — a laser
 * drawing the timeline. Reduced motion shows it full.
 */
export function ScrollRail({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.6"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });

  return (
    <div ref={ref} className={cn("relative md:pl-12", className)}>
      <span aria-hidden className="absolute inset-y-0 left-0 hidden w-px bg-border md:block" />
      <m.span
        aria-hidden
        className="absolute inset-y-0 -left-px hidden w-[3px] origin-top rounded-full md:block"
        style={{
          scaleY: reduced ? 1 : scaleY,
          background: "linear-gradient(180deg, var(--cta-2), var(--cta-3), var(--cta-4))",
          boxShadow: "0 0 14px 2px var(--cta-glow)",
        }}
      />
      {children}
    </div>
  );
}
