"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useReducedMotionSafe } from "@/lib/motion";
import { cn } from "@/lib/utils";

const SPRING = { stiffness: 150, damping: 18, mass: 0.5 };

/**
 * Requirements M-4 — a gentle 3D tilt following the pointer, resetting on
 * leave. Renders its children untouched when motion is reduced.
 */
export function Tilt({
  children,
  max = 6,
  className,
}: {
  children: React.ReactNode;
  max?: number;
  className?: string;
}) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), SPRING);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), SPRING);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={cn("[perspective:1200px]", className)}>
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onPointerMove={(event) => {
          const box = ref.current?.getBoundingClientRect();
          if (!box) return;
          px.set((event.clientX - box.left) / box.width - 0.5);
          py.set((event.clientY - box.top) / box.height - 0.5);
        }}
        onPointerLeave={() => {
          px.set(0);
          py.set(0);
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
