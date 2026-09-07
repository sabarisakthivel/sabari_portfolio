import { useReducedMotion } from "motion/react";
import type { Transition, Variants } from "motion/react";

/** Shared easing — a soft exponential settle. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** Requirements M-1: reveals fire once, at 20% visibility. */
export const VIEWPORT = { once: true, amount: 0.2 } as const;

/** 60ms between siblings (M-1). */
export const STAGGER_STEP = 0.06;

export const REVEAL_TRANSITION: Transition = {
  duration: 0.6,
  ease: EASE,
};

/** Fade and rise 24px (M-1). */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: REVEAL_TRANSITION },
};

/** Parent orchestrator for staggered children. */
export const staggerParent = (delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER_STEP, delayChildren },
  },
});

/** The accent rule under each section heading draws in (M-14). */
export const drawRule: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.7, ease: EASE, delay: 0.15 },
  },
};

/**
 * `useReducedMotion` returns `null` before it has read the media query.
 * Treat that as "motion is fine" so the first paint is not degraded.
 *
 * MotionConfig already strips transforms for these users; this hook is for the
 * cases where the behaviour has to differ structurally rather than just be
 * softened — skipping the intro, printing a final count, completing a
 * typewriter instantly.
 */
export function useReducedMotionSafe(): boolean {
  return useReducedMotion() ?? false;
}
