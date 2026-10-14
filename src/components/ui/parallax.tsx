"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "motion/react";
import { useReducedMotionSafe } from "@/lib/motion";

/**
 * Moves its content vertically as it scrolls past, by up to `range` px, so
 * layers at different ranges read as different depths. `anchor="top"` is for
 * the first screen: no offset at the top of the page, full offset once it has
 * scrolled away. Optional `scaleTo` shrinks it over the same distance.
 */
export function Parallax({
  children,
  range = 80,
  anchor = "through",
  scaleTo,
  className,
}: {
  children: React.ReactNode;
  range?: number;
  anchor?: "through" | "top";
  scaleTo?: number;
  className?: string;
}) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: anchor === "top" ? ["start start", "end start"] : ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    anchor === "top" ? [0, range] : [range / 2, -range / 2],
  );
  const scale = useTransform(scrollYProgress, [0, 1], [1, scaleTo ?? 1]);

  return (
    <m.div ref={ref} style={reduced ? undefined : { y, scale }} className={className}>
      {children}
    </m.div>
  );
}
