"use client";

import { useEffect, useState } from "react";

const QUERY = "(pointer: coarse), (max-width: 767px)";

/**
 * True on phones and tablets (touch-first or narrow screens). Those devices
 * get the same look with the expensive parts switched off: no scroll-driven
 * 3D transforms on big layers, no per-frame parallax, fewer composited
 * layers — phones run short of GPU memory long before they run short of CPU.
 * Starts false so the server render and first paint match; flips after mount.
 */
export function useLiteMotion(): boolean {
  const [lite, setLite] = useState(false);

  useEffect(() => {
    const media = matchMedia(QUERY);
    const update = () => setLite(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return lite;
}
