"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/lib/motion";

/**
 * Narrow glyphs on purpose: the scrambled string must never be wider than the
 * resolved one, or a long name could wrap mid-effect and shove the page down.
 */
const GLYPHS = "!<>-_\\/[]{}=+*^?#01";

/** Milliseconds before the next character locks into place. */
const LOCK_MS = 55;

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/**
 * Hover-to-decode: the text flips to random glyphs and resolves left to right.
 *
 * The real string is what renders at rest and what ships in the HTML, so
 * crawlers and no-JS visitors only ever see the name, and a screen-reader-only
 * copy keeps the accessible name stable while the visible layer scrambles.
 *
 * Does nothing under reduced motion.
 */
export function DecodeText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const reduced = useReducedMotionSafe();
  const [display, setDisplay] = useState(text);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    runningRef.current = false;
  }, []);

  useEffect(() => stop, [stop]);

  const run = useCallback(() => {
    // Swapping the text replaces the node under the cursor, which makes the
    // browser fire another pointerover — without this guard the effect
    // restarted every frame and looped for as long as the pointer stayed put.
    if (reduced || runningRef.current) return;
    runningRef.current = true;

    const chars = Array.from(text);
    const start = performance.now();

    const tick = () => {
      const locked = Math.floor((performance.now() - start) / LOCK_MS);

      if (locked >= chars.length) {
        setDisplay(text);
        rafRef.current = null;
        runningRef.current = false;
        return;
      }

      setDisplay(
        chars
          .map((char, index) => {
            if (char === " ") return " ";
            return index < locked ? char : randomGlyph();
          })
          .join(""),
      );
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [reduced, text]);

  return (
    <span className={className} onPointerEnter={run}>
      {/* The readable copy is a separate node so assistive tech never sees the
          scramble. `aria-label` is not an option here: ARIA prohibits it on a
          span with no role, which costs an accessibility audit. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden>{display}</span>
    </span>
  );
}
