"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CodePanel } from "@/components/ui/code-panel";
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
 */
export function StackExplorer({
  filename,
  lines,
  cards,
}: {
  filename: string;
  lines: readonly CodeLine[];
  cards: readonly DomainCard[];
}) {
  const [activeGroups, setActiveGroups] = useState<readonly string[] | null>(
    null,
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
      <CodePanel
        filename={filename}
        lines={lines}
        activeGroups={activeGroups}
      />

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
