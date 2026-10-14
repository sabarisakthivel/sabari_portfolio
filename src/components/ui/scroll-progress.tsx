"use client";

import { m, useScroll, useSpring } from "motion/react";

/** A thin gradient bar across the top that fills as the page scrolls. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  return (
    <m.div
      aria-hidden
      className="contact-gradient pointer-events-none fixed inset-x-0 top-0 z-90 h-[3px] origin-left [outline:none] [box-shadow:none]"
      style={{ scaleX }}
    />
  );
}
