"use client";

import { useRef, useState } from "react";
import { useInView } from "motion/react";
import { Card } from "@/components/ui/card";
import { CodePanel } from "@/components/ui/code-panel";
import { VIEWPORT } from "@/lib/motion";
import type { CodeLine } from "@/lib/syntax";

export interface DomainCard {
  verb: string;
  title: string;
  text: string;
  groups: readonly string[];
}

/**
 * Requirements §S-6 / M-11 — the stack.json panel and the three domain cards
 * share one hover state, so pointing at a card lights its lines in the JSON.
 *
 * The cards are deliberately not focusable: they carry no action, and the same
 * grouping is already legible in the panel itself, so the highlight is pure
 * enhancement rather than a keyboard trap.
 *
 * It also releases the panel's per-character typing once it scrolls into view.
 */
export function StackExplorer({
  filename,
  lines,
  cards,
  charDelayMs,
}: {
  filename: string;
  lines: readonly CodeLine[];
  cards: readonly DomainCard[];
  charDelayMs: number;
}) {
  const [activeGroups, setActiveGroups] = useState<readonly string[] | null>(
    null,
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const panelInView = useInView(panelRef, VIEWPORT);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
      <div ref={panelRef} className={panelInView ? "typing-active" : undefined}>
        <CodePanel
          filename={filename}
          lines={lines}
          activeGroups={activeGroups}
          typing={{ charDelayMs }}
        />
      </div>

      <div className="grid gap-4 lg:sticky lg:top-24">
        {cards.map((card) => (
          <Card
            key={card.verb}
            interactive
            onMouseEnter={() => setActiveGroups(card.groups)}
            onMouseLeave={() => setActiveGroups(null)}
            className="p-6"
          >
            <p className="font-mono text-xs text-accent-2">{card.verb}</p>
            <h3 className="mt-2 text-lg font-medium">{card.title}</h3>
            <p className="mt-2 font-mono text-xs leading-relaxed text-fg-muted">
              {card.text}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
