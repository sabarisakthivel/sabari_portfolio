"use client";

import { useEffect, useState } from "react";
import { INTRO_DONE_EVENT } from "@/components/layout/build-log";

/**
 * True once the deploy-log overlay has lifted (or was skipped). Anything on
 * the first screen waits for this — otherwise its entrance plays out behind
 * the overlay and is over before anyone sees it.
 */
export function useIntroDone(): boolean {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const w = window as { __introDone?: boolean; __introSkip?: number };
    if (w.__introDone || w.__introSkip === 1) {
      setDone(true);
      return;
    }
    const onDone = () => setDone(true);
    window.addEventListener(INTRO_DONE_EVENT, onDone);
    // Safety net: never leave the hero hidden if the intro fails to signal.
    const fallback = window.setTimeout(onDone, 4500);
    return () => {
      window.removeEventListener(INTRO_DONE_EVENT, onDone);
      window.clearTimeout(fallback);
    };
  }, []);

  return done;
}
