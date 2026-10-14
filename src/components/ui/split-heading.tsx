"use client";

import { m, type Variants } from "motion/react";
import { useIntroDone } from "@/lib/use-intro-done";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const container = (delay: number): Variants => ({
  hidden: {},
  shown: { transition: { staggerChildren: 0.035, delayChildren: delay } },
});

// Each letter stands up from its baseline, like a tile flipping over.
const letter: Variants = {
  hidden: { opacity: 0, rotateX: -95, y: "0.35em" },
  shown: { opacity: 1, rotateX: 0, y: 0, transition: { duration: 0.8, ease: EASE } },
};

/**
 * A big heading whose letters flip up in 3D one after another. The gradient
 * is applied per letter (`letterClassName`): transformed children are painted
 * on their own layers, so a text-clipped gradient on the parent would leave
 * them blank. Screen readers get the plain text.
 */
export function SplitHeading({
  lines,
  as = "h2",
  id,
  className,
  lineClassName,
  letterClassName = "hero-heading",
  waitForIntro = false,
  delay = 0,
}: {
  lines: string[];
  as?: "h1" | "h2";
  id?: string;
  className?: string;
  lineClassName?: string;
  letterClassName?: string;
  waitForIntro?: boolean;
  delay?: number;
}) {
  const introDone = useIntroDone();
  const Tag = as;

  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{lines.join(" ")}</span>
      <m.span
        aria-hidden
        className="block [perspective:900px]"
        variants={container(delay)}
        initial="hidden"
        {...(waitForIntro
          ? { animate: introDone ? "shown" : "hidden" }
          : { whileInView: "shown", viewport: { once: true, amount: 0.4 } })}
      >
        {lines.map((line, li) => (
          <span key={li} className={cn("inline-block", lineClassName)}>
            {Array.from(line).map((char, ci) => (
              <m.span
                key={ci}
                variants={letter}
                className={cn("inline-block origin-bottom", letterClassName)}
              >
                {char === " " ? " " : char}
              </m.span>
            ))}
            {li < lines.length - 1 ? " " : null}
          </span>
        ))}
      </m.span>
    </Tag>
  );
}
