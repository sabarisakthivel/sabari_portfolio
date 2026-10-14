"use client";

import { useEffect, useRef } from "react";
import { m, useScroll, useTransform } from "motion/react";
import { useReducedMotionSafe } from "@/lib/motion";
import { useLiteMotion } from "@/lib/use-lite-motion";

/**
 * Moves its content vertically as it scrolls past, by up to `range` px, so
 * layers at different ranges read as different depths. `anchor="top"` is for
 * the first screen: no offset at the top of the page, full offset once it has
 * scrolled away. Optional `scaleTo` shrinks it over the same distance.
 *
 * Off on phones and for reduced motion. That switch is read inside the
 * transform on every update (via a ref) rather than by swapping styles:
 * lite mode is only known after mount, and swapping left the first frame's
 * offset stuck in place.
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
  const lite = useLiteMotion();
  const off = useRef(true);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: anchor === "top" ? ["start start", "end start"] : ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, (p) => {
    if (off.current) return 0;
    return anchor === "top" ? p * range : range / 2 - p * range;
  });
  const scale = useTransform(scrollYProgress, (p) =>
    off.current ? 1 : 1 + p * ((scaleTo ?? 1) - 1),
  );

  useEffect(() => {
    off.current = reduced || lite;
    // re-run the transforms now rather than waiting for the next scroll
    const current = scrollYProgress.get();
    scrollYProgress.set(current + 1e-6);
    scrollYProgress.set(current);
  }, [reduced, lite, scrollYProgress]);

  return (
    <m.div ref={ref} style={{ y, scale }} className={className}>
      {children}
    </m.div>
  );
}
