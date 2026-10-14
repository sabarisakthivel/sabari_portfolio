"use client";

import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** Pixels of scroll over which the cue fades out. */
const FADE_PX = 160;

/**
 * "scroll ↓" under the falling figure. It fades as soon as the visitor starts
 * scrolling, so it never sits on top of him as he drops. A real link, so it
 * also works as a keyboard jump to the hero.
 */
export function ScrollCue({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const opacity = Math.max(0, 1 - window.scrollY / FADE_PX);
      el.style.opacity = String(opacity);
      el.style.visibility = opacity === 0 ? "hidden" : "visible";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      ref={ref}
      href={href}
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-btn px-3 py-2 font-mono text-[11px] tracking-[0.2em] text-fg-faint uppercase transition-colors duration-200 hover:text-accent",
        className,
      )}
    >
      {label}
      <ArrowDown aria-hidden className="scroll-cue size-3.5" />
    </a>
  );
}
