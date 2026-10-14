"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, type MotionValue } from "motion/react";
import { useReducedMotionSafe } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * A paragraph that lights up character by character as it scrolls through the
 * viewport (opacity 0.2 → 1). Screen readers get the plain text; the per-
 * character layer is hidden from them. Reduced motion renders it fully lit.
 */
export function AnimatedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });

  if (reduced) return <p className={className}>{text}</p>;

  const words = text.split(" ");
  const total = text.length;
  let cursor = 0;

  return (
    <p ref={ref} className={cn("relative", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, wi) => {
          const start = cursor;
          cursor += word.length + 1;
          return (
            <span key={wi} className="inline-block whitespace-nowrap">
              {Array.from(word).map((char, ci) => (
                <Char
                  key={ci}
                  char={char}
                  progress={scrollYProgress}
                  range={[(start + ci) / total, (start + ci + 1) / total]}
                />
              ))}
              {wi < words.length - 1 ? " " : null}
            </span>
          );
        })}
      </span>
    </p>
  );
}

function Char({
  char,
  progress,
  range,
}: {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative">
      <span className="invisible">{char}</span>
      <m.span style={{ opacity }} className="absolute inset-0">
        {char}
      </m.span>
    </span>
  );
}
