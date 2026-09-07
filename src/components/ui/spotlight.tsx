"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useReducedMotionSafe } from "@/lib/motion";

const SIZE = 600;

/**
 * Requirements M-2 — a soft accent glow trailing the pointer.
 *
 * Desktop only (`pointer: fine`) and never for reduced motion. It moves via a
 * transform on a spring, so it settles the moment the pointer stops rather
 * than holding the main thread.
 */
export function Spotlight() {
  const reduced = useReducedMotionSafe();
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(-SIZE);
  const y = useMotionValue(-SIZE);
  const springX = useSpring(x, { stiffness: 120, damping: 22, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 120, damping: 22, mass: 0.4 });

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX - SIZE / 2);
      y.set(event.clientY - SIZE / 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 -z-10 rounded-full"
      style={{
        width: SIZE,
        height: SIZE,
        x: springX,
        y: springY,
        background:
          "radial-gradient(closest-side, var(--accent-glow), transparent)",
      }}
    />
  );
}
