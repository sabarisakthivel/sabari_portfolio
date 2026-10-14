"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotionSafe } from "@/lib/motion";

/**
 * Inertial smooth scrolling for wheel and trackpad (Lenis). Touch scrolling
 * stays native — phones already glide, and hijacking it feels worse. Anchor
 * links glide too. Off for reduced motion.
 */
export function SmoothScroll() {
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      anchors: true,
    });
    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [reduced]);

  return null;
}
