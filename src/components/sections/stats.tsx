import { CountUp } from "@/components/ui/count-up";
import { MonoLabel } from "@/components/ui/mono-label";
import { Reveal, RevealItem, Stagger } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { stats } from "@/data/content";

/** Requirements §S-5 and M-10. */
export function Stats() {
  return (
    <Section id="stats" labelledBy="stats-heading">
      <Reveal className="border-t border-border pt-8">
        <MonoLabel>{stats.label}</MonoLabel>
        <div className="mt-5">
          <h2
            id="stats-heading"
            className="text-[clamp(1.625rem,3vw,2.25rem)] font-semibold tracking-[-0.03em]"
          >
            {stats.headline}
          </h2>
          <p className="mt-2 text-fg-muted">{stats.sub}</p>
        </div>
      </Reveal>

      {/* Open figures on hairlines — no filled cells. */}
      <Stagger
        as="dl"
        className="mt-14 grid border-t border-border sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.items.map((item) => (
          <RevealItem
            key={item.label}
            className="border-b border-border py-8 lg:border-b-0 lg:border-l lg:border-border lg:pr-6 lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
          >
            <dt className="sr-only">{item.label}</dt>
            <dd>
              <span className="block font-mono text-[clamp(2.75rem,5vw,3.75rem)] leading-none font-medium tracking-[-0.05em] text-accent tabular-nums">
                <CountUp value={item.value} />
                {item.suffix ? (
                  <span className="text-accent/55">{item.suffix}</span>
                ) : null}
              </span>
              <span className="mt-5 block max-w-[22ch] text-sm text-fg-muted">
                {item.label}
              </span>
            </dd>
          </RevealItem>
        ))}
      </Stagger>
    </Section>
  );
}
