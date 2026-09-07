"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { Check, Copy } from "lucide-react";
import { contact, site, ui } from "@/data/content";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Requirements §S-8 / M-13 — the icon spins over into a check on success. */
export function CopyEmail({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <button
      type="button"
      aria-label={ui.contact.copyAria}
      onClick={() => {
        void navigator.clipboard
          .writeText(site.links.email)
          .then(() => setCopied(true))
          .catch(() => setCopied(false));
      }}
      className={cn(
        "group flex w-full items-center gap-3 rounded-panel border border-border bg-bg-elev px-4 py-3 text-left",
        "font-mono text-xs transition-colors duration-200 hover:border-border-strong",
        className,
      )}
    >
      <span className="relative min-w-0 flex-1 truncate">
        <AnimatePresence initial={false} mode="wait">
          <m.span
            key={copied ? "copied" : "idle"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: EASE }}
            className={cn(
              "block truncate",
              copied ? "text-success" : "text-fg-muted group-hover:text-fg",
            )}
          >
            {copied ? contact.copiedLabel : contact.copyCommand}
          </m.span>
        </AnimatePresence>
      </span>

      <span className="relative size-4 shrink-0">
        <AnimatePresence initial={false} mode="wait">
          {copied ? (
            <m.span
              key="check"
              initial={{ opacity: 0, scale: 0.4, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.4, rotate: 90 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="absolute inset-0"
            >
              <Check className="size-4 text-success" />
            </m.span>
          ) : (
            <m.span
              key="copy"
              initial={{ opacity: 0, scale: 0.4, rotate: 90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.4, rotate: -90 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="absolute inset-0"
            >
              <Copy className="size-4 text-fg-faint group-hover:text-accent" />
            </m.span>
          )}
        </AnimatePresence>
      </span>
    </button>
  );
}
