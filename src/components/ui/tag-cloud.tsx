"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Tag } from "@/components/ui/tag";
import { ui } from "@/data/content";
import { cn } from "@/lib/utils";

/** Tags shown before the mobile fold (Requirements §S-6). */
const COLLAPSED_COUNT = 24;

/**
 * The full skill list. Desktop always shows everything; on small screens the
 * tail collapses behind a toggle so the section stays scannable.
 */
export function TagCloud({ items }: { items: readonly string[] }) {
  const [expanded, setExpanded] = useState(false);
  const collapsible = items.length > COLLAPSED_COUNT;

  return (
    <>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map((item, index) => (
          <li
            key={item}
            className={cn(
              collapsible &&
                !expanded &&
                index >= COLLAPSED_COUNT &&
                "hidden md:list-item",
            )}
          >
            <Tag>{item}</Tag>
          </li>
        ))}
      </ul>

      {collapsible ? (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((open) => !open)}
          className="mt-4 flex items-center gap-1.5 font-mono text-xs text-fg-muted transition-colors duration-200 hover:text-accent md:hidden"
        >
          {expanded
            ? ui.stack.showLess
            : `${ui.stack.showAll} ${items.length}`}
          <ChevronDown
            aria-hidden
            className={cn(
              "size-3.5 transition-transform duration-200",
              expanded && "rotate-180",
            )}
          />
        </button>
      ) : null}
    </>
  );
}
