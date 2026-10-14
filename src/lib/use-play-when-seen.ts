import { useEffect, useState, type RefObject } from "react";
import { useInView } from "motion/react";
import { INTRO_DONE_EVENT } from "@/components/layout/build-log";

/**
 * True once the deploy intro has finished *and* the element has scrolled into
 * view. The hero now sits below the falling-figure screen, so playing on intro
 * end alone would run its entrance off screen.
 */
export function usePlayWhenSeen(
  ref: RefObject<Element | null>,
  amount = 0.4,
): boolean {
  const inView = useInView(ref, { once: true, amount });
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const w = window as { __introDone?: boolean; __introSkip?: number };
    if (w.__introDone || w.__introSkip === 1) {
      setIntroDone(true);
      return;
    }
    const onDone = () => setIntroDone(true);
    window.addEventListener(INTRO_DONE_EVENT, onDone);
    // Safety net: never leave content unplayed if the intro fails to signal.
    const fallback = window.setTimeout(onDone, 4500);
    return () => {
      window.removeEventListener(INTRO_DONE_EVENT, onDone);
      window.clearTimeout(fallback);
    };
  }, []);

  return inView && introDone;
}
