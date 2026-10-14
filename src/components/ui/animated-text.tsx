"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, type MotionValue } from "motion/react";
import { useReducedMotionSafe } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * A paragraph that lights up word by word as it scrolls through the viewport
 * (opacity 0.2 → 1). Word-level rather than letter-level: the same effect at
 * a glance, with roughly a sixth of the animated elements — which matters on
 * phones. Screen readers get the plain text; reduced motion renders it lit.
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

  return (
    <p ref={ref} className={cn("relative", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, index) => (
          <Word
            key={index}
            word={word}
            progress={scrollYProgress}
            range={[index / words.length, (index + 1) / words.length]}
            last={index === words.length - 1}
          />
        ))}
      </span>
    </p>
  );
}

function Word({
  word,
  progress,
  range,
  last,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  last: boolean;
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <>
      <m.span style={{ opacity }}>{word}</m.span>
      {last ? null : " "}
    </>
  );
}
