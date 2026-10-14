"use client";

import { useEffect, useRef } from "react";
import { m, useScroll, useTransform } from "motion/react";
import { useReducedMotionSafe } from "@/lib/motion";

/**
 * Fixed full-page backdrop: zig-zag steel ribbons with hot edges, laser
 * streaks running along those edges, and a few beams sweeping across.
 *
 * Built for smooth scrolling. Everything heavy is painted once and then only
 * moved by the compositor:
 * - each ribbon (blurred glow, edge colour, steel face) is a static SVG on
 *   its own layer; scrolling only rotates/scales that layer;
 * - the glow "breathes" through layer opacity, not by repainting the blur;
 * - the lasers are small glowing bars travelling the same path with CSS
 *   `offset-path`, so a frame only touches a few tiny elements.
 *
 * The scene is authored in a 1000×1000 box; a JS-measured scale (--cover)
 * makes it cover the viewport so the CSS paths and the SVG stay aligned.
 */
const NEAR = "M 1160 40 L 170 330 L 900 540 L 40 790 L 1160 1080";
const FAR = "M -160 120 L 760 250 L 120 520 L 980 700 L -140 960";
const NEAR_W = 72;
const FAR_W = 44;

function RibbonArt({ d, width }: { d: string; width: number }) {
  return (
    <>
      <svg
        viewBox="0 0 1000 1000"
        className="glow-breathe absolute inset-0 size-full"
        fill="none"
        strokeLinejoin="miter"
        strokeMiterlimit={12}
      >
        <path d={d} stroke="url(#lb-edge)" strokeWidth={width + 26} filter="url(#lb-blur)" />
      </svg>
      <svg
        viewBox="0 0 1000 1000"
        className="absolute inset-0 size-full"
        fill="none"
        strokeLinejoin="miter"
        strokeMiterlimit={12}
      >
        <path d={d} stroke="url(#lb-edge)" strokeWidth={width} />
        <path d={d} stroke="url(#lb-metal)" strokeWidth={width - 6} />
      </svg>
    </>
  );
}

/** Corner points of a polyline path written as "M x y L x y …". */
function pointsOf(d: string): [number, number][] {
  const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  const pts: [number, number][] = [];
  for (let i = 0; i + 1 < nums.length; i += 2) pts.push([nums[i], nums[i + 1]]);
  return pts;
}

/**
 * Keyframes that carry an element along the polyline at constant speed,
 * pointing along each segment and turning sharply at the corners. Only
 * `transform` is animated, so the compositor runs it off the main thread.
 */
function pathKeyframes(d: string): Keyframe[] {
  const pts = pointsOf(d);
  const lengths = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = lengths.reduce((a, b) => a + b, 0);
  const frames: Keyframe[] = [];
  let travelled = 0;
  lengths.forEach((length, i) => {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const angle = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
    const start = travelled / total;
    travelled += length;
    const end = travelled / total;
    frames.push({ offset: start, transform: `translate(${x0}px, ${y0}px) rotate(${angle}deg)` });
    frames.push({ offset: Math.max(start, end - 0.0001), transform: `translate(${x1}px, ${y1}px) rotate(${angle}deg)` });
  });
  return frames;
}

/** Two bars per streak, one on each edge, riding the centre line. */
function Lasers({ d, width, speed, count }: { d: string; width: number; speed: number; count: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const edge = width / 2 - 1.5;

  useEffect(() => {
    const riders = ref.current?.querySelectorAll<HTMLElement>("[data-rider]");
    if (!riders) return;
    const frames = pathKeyframes(d);
    const duration = speed * 1000;
    const animations = Array.from(riders).map((rider) => {
      const animation = rider.animate(frames, { duration, iterations: Infinity, easing: "linear" });
      animation.currentTime = Number(rider.dataset.phase) * duration;
      return animation;
    });
    return () => animations.forEach((animation) => animation.cancel());
  }, [d, speed]);

  return (
    <div ref={ref}>
      {Array.from({ length: count }).flatMap((_, i) =>
        [-edge, edge].map((offset) => (
          <span key={`${i}-${offset}`} data-rider data-phase={i / count} className="absolute top-0 left-0 will-change-transform">
            <span className="laser-dot" style={{ transform: `translate(-45px, ${offset - 1.5}px)` }} />
          </span>
        )),
      )}
    </div>
  );
}

export function LaserBackdrop() {
  const reduced = useReducedMotionSafe();
  const sceneRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [-6, 14]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.3, 1.15]);
  const farRotate = useTransform(scrollYProgress, [0, 1], [4, -10]);

  // Scale the 1000×1000 scene so it covers the viewport.
  useEffect(() => {
    const fit = () => {
      const cover = Math.max(window.innerWidth, window.innerHeight) / 1000;
      sceneRef.current?.style.setProperty("--cover", String(cover));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <div
      ref={sceneRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden [contain:strict]"
    >
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="lb-metal" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="1000">
            <stop offset="0" style={{ stopColor: "var(--metal-dark)" }} />
            <stop offset="0.18" style={{ stopColor: "var(--metal-light)" }} />
            <stop offset="0.32" style={{ stopColor: "var(--metal-dark)" }} />
            <stop offset="0.5" style={{ stopColor: "var(--metal-mid)" }} />
            <stop offset="0.62" style={{ stopColor: "var(--metal-light)" }} />
            <stop offset="0.78" style={{ stopColor: "var(--metal-dark)" }} />
            <stop offset="1" style={{ stopColor: "var(--metal-mid)" }} />
          </linearGradient>
          <linearGradient id="lb-edge" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="0">
            <stop offset="0" style={{ stopColor: "var(--cta-2)" }} />
            <stop offset="0.5" style={{ stopColor: "var(--cta-3)" }} />
            <stop offset="1" style={{ stopColor: "var(--cta-4)" }} />
          </linearGradient>
          <filter id="lb-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
        </defs>
      </svg>

      {/* far ribbon — thinner, dimmer, counter-rotating for depth */}
      <m.div
        className="absolute top-1/2 left-1/2 opacity-30 will-change-transform"
        style={reduced ? { scale: 1.2 } : { rotate: farRotate, scale: 1.2 }}
      >
        <div className="scene-box">
          <RibbonArt d={FAR} width={FAR_W} />
          {!reduced ? <Lasers d={FAR} width={FAR_W} speed={14} count={1} /> : null}
        </div>
      </m.div>

      {/* near ribbon */}
      <m.div
        className="absolute top-1/2 left-1/2 opacity-80 will-change-transform"
        style={reduced ? { scale: 1.08 } : { rotate, scale }}
      >
        <div className="scene-box">
          <RibbonArt d={NEAR} width={NEAR_W} />
          {!reduced ? <Lasers d={NEAR} width={NEAR_W} speed={10} count={2} /> : null}
        </div>
      </m.div>

      {/* beams */}
      <span className="beam top-[22%]" style={{ ["--speed" as string]: "12s", ["--delay" as string]: "-2s" }} />
      <span
        className="beam top-[58%]"
        style={{ ["--speed" as string]: "15s", ["--delay" as string]: "-9s", ["--angle" as string]: "18deg" }}
      />
      <span
        className="beam top-[84%] hidden sm:block"
        style={{ ["--speed" as string]: "18s", ["--delay" as string]: "-5s" }}
      />

      {/* vignette keeps text readable over the brightest folds */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 18%, var(--vignette) 95%)" }}
      />
    </div>
  );
}
