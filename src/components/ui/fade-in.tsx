"use client";

import { m } from "motion/react";
import { useIntroDone } from "@/lib/use-intro-done";
import { useLiteMotion } from "@/lib/use-lite-motion";
import { cn } from "@/lib/utils";

const EASE_FADE = [0.25, 0.1, 0.25, 1] as const;

type Tag = "div" | "section" | "nav" | "li" | "p" | "span" | "header";

/**
 * Fades an element in — optionally sliding (x/y) and swinging in 3D
 * (rotateX/rotateY) — the first time it nears the viewport. With
 * `waitForIntro` it plays when the deploy log lifts instead, for content on
 * the first screen. MotionConfig's reducedMotion="user" drops every
 * transform for anyone who asks for less motion, leaving the fade.
 */
export function FadeIn({
  children,
  as = "div",
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  rotateX = 0,
  rotateY = 0,
  waitForIntro = false,
  className,
}: {
  children: React.ReactNode;
  as?: Tag;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  rotateX?: number;
  rotateY?: number;
  waitForIntro?: boolean;
  className?: string;
}) {
  const introDone = useIntroDone();
  // Phones: no 3D swing, a shorter rise, quicker and earlier — so content is
  // already there by the time a fast thumb-scroll reaches it.
  const lite = useLiteMotion();
  const Component = m[as];
  const hidden = lite
    ? { opacity: 0, x: 0, y: Math.min(Math.abs(y), 16) * Math.sign(y), rotateX: 0, rotateY: 0 }
    : { opacity: 0, x, y, rotateX, rotateY };
  const shown = { opacity: 1, x: 0, y: 0, rotateX: 0, rotateY: 0 };

  return (
    <Component
      data-reveal
      className={cn("min-w-0", className)}
      style={!lite && (rotateX || rotateY) ? { transformPerspective: 1000 } : undefined}
      initial={hidden}
      {...(waitForIntro
        ? { animate: introDone ? shown : hidden }
        : { whileInView: shown, viewport: { once: true, margin: lite ? "0px 0px 25% 0px" : "50px", amount: 0 } })}
      transition={lite ? { duration: 0.4, delay: Math.min(delay, 0.15), ease: EASE_FADE } : { duration, delay, ease: EASE_FADE }}
    >
      {children}
    </Component>
  );
}
