"use client";

import { LazyMotion, MotionConfig } from "motion/react";

const loadFeatures = () =>
  import("@/lib/motion-features").then((mod) => mod.default);

/**
 * `reducedMotion="user"` makes Framer drop transform and layout animations for
 * anyone who asks the OS for less motion, leaving opacity — exactly the
 * fallback Requirements §4 calls for.
 *
 * LazyMotion keeps the animation features out of the initial bundle; every
 * component below uses `m.*` rather than `motion.*` so nothing pulls them back
 * in. Children stay server-rendered.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
