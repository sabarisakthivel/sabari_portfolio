"use client";

import { useRef } from "react";
import { m, useMotionTemplate, useSpring } from "motion/react";
import { useReducedMotionSafe } from "@/lib/motion";
import { cn } from "@/lib/utils";

const SPRING = { stiffness: 200, damping: 20, mass: 0.5 };

/**
 * A card that tilts toward the mouse with a soft glare. Mouse only: on touch
 * it is a plain card, so scrolling past it never wobbles it. Reduced motion
 * keeps it flat.
 */
export function TiltCard({
  children,
  className,
  max = 8,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, SPRING);
  const rotateY = useSpring(0, SPRING);
  const gx = useSpring(50, SPRING);
  const gy = useSpring(50, SPRING);
  const glareOpacity = useSpring(0, SPRING);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, var(--glare), transparent 55%)`;

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <m.div
      ref={ref}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={cn("relative will-change-transform", className)}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const box = ref.current?.getBoundingClientRect();
        if (!box) return;
        const nx = (event.clientX - box.left) / box.width - 0.5;
        const ny = (event.clientY - box.top) / box.height - 0.5;
        rotateY.set(nx * max * 2);
        rotateX.set(-ny * max * 2);
        gx.set((nx + 0.5) * 100);
        gy.set((ny + 0.5) * 100);
        glareOpacity.set(0.35);
      }}
      onPointerLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
        glareOpacity.set(0);
      }}
    >
      {children}
      <m.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ backgroundImage: glare, opacity: glareOpacity }}
      />
    </m.div>
  );
}
