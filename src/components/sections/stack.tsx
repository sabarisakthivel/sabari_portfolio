import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { StackExplorer } from "@/components/ui/stack-explorer";
import { TagCloud } from "@/components/ui/tag-cloud";
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

/** Requirements §S-6. The panel typewriter (M-11) lands in Phase 4. */
export function Stack() {
  return (
    <Section id="stack" labelledBy="stack-heading">
      <SectionHeading
        id="stack-heading"
        label={stack.label}
        title={stack.headline}
        kicker={stack.kicker}
      />

      <div className="mt-12">
        <StackExplorer
          filename={stack.filename}
          lines={stackLines}
          cards={stack.cards}
        />
      </div>

      <div className="mt-10">
        <p className="font-mono text-[11px] tracking-[0.12em] text-fg-faint uppercase">
          {ui.stack.cloudLabel} · {allSkills.length}
        </p>
        <TagCloud items={allSkills} />
      </div>
    </Section>
  );
}
