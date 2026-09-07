import { Card } from "@/components/ui/card";
import { CodePanel } from "@/components/ui/code-panel";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";
import { stack, ui } from "@/data/content";
import { jsonObjectLines } from "@/lib/syntax";

const stackLines = jsonObjectLines(
  stack.groups.map((group) => ({
    key: group.key,
    value: group.items,
    group: group.key,
  })),
  [stack.modeComment],
);

/** Every skill once, in group order. */
const allSkills = Array.from(
  new Set(stack.groups.flatMap((group) => group.items)),
);

/** Requirements §S-6. Typewriter and hover cross-linking (M-11) land in Phase 4. */
export function Stack() {
  return (
    <Section id="stack" labelledBy="stack-heading">
      <SectionHeading
        id="stack-heading"
        label={stack.label}
        title={stack.headline}
        kicker={stack.kicker}
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
        <CodePanel filename={stack.filename} lines={stackLines} />

        <div className="grid gap-4 lg:sticky lg:top-24">
          {stack.cards.map((card) => (
            <Card key={card.verb} interactive className="p-6">
              <p className="font-mono text-xs text-accent-2">{card.verb}</p>
              <h3 className="mt-2 text-lg font-medium">{card.title}</h3>
              <p className="mt-2 font-mono text-xs leading-relaxed text-fg-muted">
                {card.text}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <p className="font-mono text-[11px] tracking-[0.12em] text-fg-faint uppercase">
          {ui.stack.cloudLabel} · {allSkills.length}
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {allSkills.map((skill) => (
            <li key={skill}>
              <Tag>{skill}</Tag>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
