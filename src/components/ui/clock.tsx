"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/content";
import { cn } from "@/lib/utils";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: site.location.ianaTz,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const PLACEHOLDER = "--:--:--";

/** Live IST clock (M-8). Renders a stable placeholder until mounted. */
export function Clock({ className }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={cn("font-mono tabular-nums", className)}>
      {time ?? PLACEHOLDER}
    </span>
  );
}
