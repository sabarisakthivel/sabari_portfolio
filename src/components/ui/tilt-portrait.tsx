"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { m, useMotionTemplate, useSpring } from "motion/react";
import { useReducedMotionSafe } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** How far outside its box the cursor starts pulling the portrait (px). */
const PADDING = 150;
/** Pointer offset is divided by this before it becomes a translate. */
const STRENGTH = 3;
/** Maximum tilt either way, in degrees. */
const MAX_TILT = 14;

const SPRING = { stiffness: 160, damping: 18, mass: 0.6 };

/**
 * The hero portrait, alive to the pointer:
 * - mouse: a magnetic pull once the cursor is within PADDING of the image,
 *   plus a 3D tilt toward it and a glare that follows it;
 * - touch: pressing or dragging tilts it toward the finger and it springs
 *   back on release. `touch-action: pan-y` keeps vertical scrolling working.
 * Reduced motion renders it still.
 */
export function TiltPortrait({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useSpring(0, SPRING);
  const rotateY = useSpring(0, SPRING);
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);
  const scale = useSpring(1, SPRING);
  const glareX = useSpring(50, SPRING);
  const glareY = useSpring(30, SPRING);
  const glareOpacity = useSpring(0, SPRING);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, var(--glare), transparent 45%)`;

  // Shared by mouse and touch: aim the portrait at a point on screen.
  const aimAt = (clientX: number, clientY: number, pull: boolean) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    const cx = box.left + box.width / 2;
    const cy = box.top + box.height / 2;
    const nx = Math.max(-1, Math.min(1, (clientX - cx) / (box.width / 2)));
    const ny = Math.max(-1, Math.min(1, (clientY - cy) / (box.height / 2)));
    rotateY.set(nx * MAX_TILT);
    rotateX.set(-ny * MAX_TILT);
    if (pull) {
      x.set((clientX - cx) / STRENGTH);
      y.set((clientY - cy) / STRENGTH);
    }
    glareX.set(50 + nx * 40);
    glareY.set(50 + ny * 40);
    glareOpacity.set(1);
  };

  const rest = () => {
    rotateX.set(0);
    rotateY.set(0);
    x.set(0);
    y.set(0);
    scale.set(1);
    glareOpacity.set(0);
  };

  // Mouse: magnet within PADDING of the box, measured from the window so the
  // pull starts before the cursor is actually over the image.
  useEffect(() => {
    if (reduced) return;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const box = ref.current?.getBoundingClientRect();
      if (!box) return;
      const near =
        event.clientX > box.left - PADDING &&
        event.clientX < box.right + PADDING &&
        event.clientY > box.top - PADDING &&
        event.clientY < box.bottom + PADDING;
      if (near) aimAt(event.clientX, event.clientY, true);
      else rest();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
    // aimAt/rest only touch stable motion values
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  if (reduced) {
    return (
      <div className={className}>
        <Image src={src} alt={alt} width={width} height={height} priority className="h-auto w-full" />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn("touch-pan-y select-none", className)}
      onPointerDown={(event) => {
        if (event.pointerType === "mouse") return;
        scale.set(0.96);
        aimAt(event.clientX, event.clientY, false);
      }}
      onPointerMove={(event) => {
        if (event.pointerType === "mouse" || event.buttons === 0) return;
        aimAt(event.clientX, event.clientY, false);
      }}
      onPointerUp={(event) => {
        if (event.pointerType !== "mouse") rest();
      }}
      onPointerCancel={rest}
    >
      <m.div
        style={{ rotateX, rotateY, x, y, scale, transformPerspective: 900 }}
        className="relative will-change-transform"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority
          draggable={false}
          sizes="(min-width: 1280px) 660px, (min-width: 1024px) 600px, (min-width: 768px) 440px, (min-width: 640px) 360px, 280px"
          className="pointer-events-none h-auto w-full"
        />
        {/* glare, clipped to the figure's own silhouette */}
        <m.div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{
            backgroundImage: glare,
            opacity: glareOpacity,
            WebkitMaskImage: `url(${src})`,
            maskImage: `url(${src})`,
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
          }}
        />
      </m.div>
    </div>
  );
}
