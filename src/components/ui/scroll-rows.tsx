"use client";

import { useEffect, useRef } from "react";
import { useReducedMotionSafe } from "@/lib/motion";

/**
 * Rows that slide in opposite directions as the page scrolls, on a plane
 * that starts tipped back in 3D and lies flat as it reaches the middle of
 * the screen. Each row is rendered three times so it never runs out. Transforms are written straight
 * to the DOM from a passive listener, so scrolling never re-renders React.
 * Reduced motion leaves the rows still.
 */
export function ScrollRows({ rows }: { rows: React.ReactNode[] }) {
  const reduced = useReducedMotionSafe();
  const sectionRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;
      const box = section.getBoundingClientRect();
      const top = box.top + window.scrollY;
      const offset = (window.scrollY - top + window.innerHeight) * 0.3;
      // 0 as the plane enters at the bottom, 1 as it leaves at the top
      const progress = Math.min(1, Math.max(0, (window.innerHeight - box.top) / (window.innerHeight + box.height)));
      const tilt = 32 - Math.min(1, progress * 2) * 32 - Math.max(0, progress - 0.5) * 24;
      section.style.transform = `perspective(1100px) rotateX(${tilt.toFixed(2)}deg)`;
      rowRefs.current.forEach((row, index) => {
        if (!row) return;
        const x = index % 2 === 0 ? offset - 200 : -(offset - 200);
        row.style.transform = `translate3d(${x}px, 0, 0)`;
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  return (
    <div ref={sectionRef} aria-hidden className="flex origin-center flex-col gap-3 will-change-transform">
      {rows.map((row, index) => (
        <div
          key={index}
          ref={(el) => {
            rowRefs.current[index] = el;
          }}
          // start one copy to the left (CSS `translate`, which composes with
          // the scroll `transform`) so neither edge ever shows a gap
          className="flex w-max -translate-x-1/3 gap-3"
          style={{ willChange: "transform" }}
        >
          {[0, 1, 2].map((copy) => (
            <div key={copy} className="flex shrink-0 gap-3">
              {row}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
