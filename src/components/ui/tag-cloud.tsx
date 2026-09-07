import { Tag } from "@/components/ui/tag";

export interface SkillGroup {
  key: string;
  label: string;
  items: readonly string[];
}

/**
 * The full skill list, one ruled row per domain.
 *
 * Grouping replaces the old flat list and its "show all" toggle: a labelled
 * row is scannable at any length, so there was nothing left for the collapse
 * to solve, and dropping it takes the component back to the server.
 *
 * A skill can legitimately appear in two rows — Row Level Security belongs to
 * both the database and security groups — so these are not deduplicated.
 */
export function TagCloud({ groups }: { groups: readonly SkillGroup[] }) {
  return (
    <ul className="mt-5 border-t border-border">
      {groups.map((group) => (
        <li
          key={group.key}
          className="grid gap-3 border-b border-border py-5 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-8"
        >
          <p className="font-mono text-[11px] tracking-[0.14em] text-fg-faint uppercase md:pt-1.5">
            {group.label}
          </p>
          <ul className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <li key={item}>
                <Tag>{item}</Tag>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
