"use client";

import { useRef } from "react";
import { m, useSpring } from "motion/react";
import { useReducedMotionSafe } from "@/lib/motion";
import { cn } from "@/lib/utils";

const SPRING = { stiffness: 220, damping: 16, mass: 0.4 };

/**
 * Pulls its child a little toward the mouse while hovered — for buttons.
 * Mouse only; reduced motion keeps it put.
 */
export function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <m.div
      ref={ref}
      style={{ x, y }}
      className={cn("inline-block", className)}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const box = ref.current?.getBoundingClientRect();
        if (!box) return;
        x.set((event.clientX - (box.left + box.width / 2)) * strength);
        y.set((event.clientY - (box.top + box.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </m.div>
  );
}
