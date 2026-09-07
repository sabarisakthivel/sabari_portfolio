"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { Check, Loader2 } from "lucide-react";
import { PanelChrome } from "@/components/ui/code-panel";
import { loader, site } from "@/data/content";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "sabari:intro-seen";
const STAGE_MS = 600;
const TOTAL_MS = STAGE_MS * loader.stages.length;

/**
 * Requirements §S-0 / M-3 — the deploy log that plays once per session.
 *
 * The overlay is server-rendered so it covers the page from the very first
 * paint. A blocking script in `layout.tsx` injects a stylesheet hiding it for
 * returning visitors and anyone who prefers reduced motion; this component then
 * unmounts it on mount. That ordering is what keeps returning visitors from
 * seeing a flash of terminal.
 */
export function BuildLog() {
  const [visible, setVisible] = useState(true);
  const [stage, setStage] = useState(0);

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* private mode — the intro simply plays again next time */
    }
  }, []);

  // Returning visitor or reduced motion: never run the sequence (AC-3, AC-4).
  // The flag is set by the blocking script in layout.tsx, which has already
  // hidden this overlay with an injected stylesheet.
  useEffect(() => {
    if ((window as { __introSkip?: number }).__introSkip === 1) {
      setVisible(false);
      return;
    }
    const id = window.setInterval(() => setStage((s) => s + 1), STAGE_MS);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (stage < loader.stages.length) return;
    const id = window.setTimeout(dismiss, 200);
    return () => window.clearTimeout(id);
  }, [stage, dismiss]);

  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter") dismiss();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [visible, dismiss]);

  return (
    <AnimatePresence>
      {visible ? (
        <m.div
          key="build-log"
          className="build-log dot-grid fixed inset-0 z-100 flex items-center justify-center bg-bg p-6"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.5, ease: [0.7, 0, 0.84, 0] }}
        >
          <div
            aria-hidden
            className="inset-top-highlight w-full max-w-lg overflow-hidden rounded-panel border border-border bg-bg-elev"
          >
            <PanelChrome>
              <span className="min-w-0 truncate font-mono text-xs text-fg-muted">
                {site.shortName.toLowerCase()} — deploy
              </span>
            </PanelChrome>

            <div className="p-4 font-mono text-xs">
              <p className="text-fg-muted">
                <span className="text-success">{loader.prompt}</span>
              </p>

              <ul className="mt-4 space-y-2">
                {loader.stages.map((item, index) => {
                  const done = index < stage;
                  const active = index === stage;
                  return (
                    <li
                      key={item.label}
                      className={cn(
                        "flex items-start gap-2.5 transition-opacity duration-300",
                        !done && !active && "opacity-30",
                      )}
                    >
                      <span className="mt-0.5 shrink-0">
                        {done ? (
                          <Check className="size-3.5 text-success" />
                        ) : (
                          <Loader2
                            className={cn(
                              "size-3.5 text-fg-faint",
                              active && "animate-spin text-accent",
                            )}
                          />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="text-fg">{item.label}</span>
                        {done || active ? (
                          <span className="mt-0.5 block break-words text-fg-faint">
                            {item.log}
                          </span>
                        ) : null}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-5 h-0.5 overflow-hidden rounded-full bg-bg-elev-2">
                <m.div
                  className="h-full origin-left bg-accent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: TOTAL_MS / 1000, ease: "linear" }}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={dismiss}
            className="fixed right-6 bottom-6 rounded-btn border border-border px-3 py-1.5 font-mono text-xs text-fg-muted transition-colors duration-200 hover:border-border-strong hover:text-fg"
          >
            {loader.skipLabel}
          </button>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
