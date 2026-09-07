"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { contact, site, ui } from "@/data/content";
import { cn } from "@/lib/utils";

/** Requirements §S-8. The check-icon morph (M-13) is polished in Phase 4. */
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
        "group flex w-full items-center gap-3 rounded-panel border border-border bg-bg-elev-2 px-4 py-3 text-left",
        "font-mono text-xs transition-colors duration-200 hover:border-border-strong",
        className,
      )}
    >
      <span className="min-w-0 flex-1 truncate text-fg-muted group-hover:text-fg">
        {copied ? contact.copiedLabel : contact.copyCommand}
      </span>
      {copied ? (
        <Check className="size-4 shrink-0 text-success" />
      ) : (
        <Copy className="size-4 shrink-0 text-fg-faint group-hover:text-accent" />
      )}
    </button>
  );
}
