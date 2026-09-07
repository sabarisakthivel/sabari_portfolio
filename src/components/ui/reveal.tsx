"use client";

import { motion } from "motion/react";
import { drawRule, fadeUp, staggerParent, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Requirements M-1 — a single element fades and rises into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "header";
}) {
  const Component = motion[as];
  return (
    <Component
      data-reveal
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}

/** Parent that staggers its `RevealItem` children by 60ms (M-1). */
export function Stagger({
  children,
  className,
  delayChildren = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delayChildren?: number;
  as?: "div" | "ul" | "ol" | "dl";
}) {
  const Component = motion[as];
  return (
    <Component
      data-reveal
      className={className}
      variants={staggerParent(delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </Component>
  );
}

/** Child of `Stagger`; inherits the parent's timing. */
export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const Component = motion[as];
  return (
    <Component data-reveal className={className} variants={fadeUp}>
      {children}
    </Component>
  );
}

/** The 1px accent rule beneath a section heading, drawn left to right (M-14). */
export function AccentRule({ className }: { className?: string }) {
  return (
    <motion.span
      aria-hidden
      data-reveal
      className={cn("block h-px w-16 origin-left bg-accent", className)}
      variants={drawRule}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    />
  );
}
