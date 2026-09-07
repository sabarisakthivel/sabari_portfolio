import { CountUp } from "@/components/ui/count-up";
import { MonoLabel } from "@/components/ui/mono-label";
import { Reveal, RevealItem, Stagger } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { stats } from "@/data/content";

/** Requirements §S-5 and M-10. */
export function Stats() {
  return (
    <Section id="stats" labelledBy="stats-heading">
      <Reveal>
        <MonoLabel>{stats.label}</MonoLabel>
        <h2
          id="stats-heading"
          className="mt-5 text-[clamp(1.75rem,3.2vw,2.5rem)] font-semibold tracking-[-0.03em]"
        >
          {stats.headline}
        </h2>
        <p className="mt-2 text-fg-muted">{stats.sub}</p>
      </Reveal>

      <Stagger
        as="dl"
        className="mt-10 grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.items.map((item) => (
          <RevealItem key={item.label} className="bg-bg-elev p-6">
            <dt className="sr-only">{item.label}</dt>
            <dd>
              <span className="block font-mono text-[clamp(2.5rem,5vw,3.5rem)] leading-none font-medium tracking-[-0.04em] text-accent tabular-nums">
                <CountUp value={item.value} />
                {item.suffix ? (
                  <span className="text-accent/60">{item.suffix}</span>
                ) : null}
              </span>
              <span className="mt-4 block text-sm text-fg-muted">
                {item.label}
              </span>
            </dd>
          </RevealItem>
        ))}
      </Stagger>
    </Section>
  );
}
