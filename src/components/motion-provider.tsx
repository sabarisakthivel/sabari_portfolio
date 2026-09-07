"use client";

import { MotionConfig } from "motion/react";

/**
 * `reducedMotion="user"` makes Framer drop transform and layout animations for
 * anyone who asks the OS for less motion, leaving opacity — exactly the
 * fallback Requirements §4 calls for. Children stay server-rendered.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
