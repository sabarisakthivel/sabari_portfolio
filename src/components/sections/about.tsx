import { Card } from "@/components/ui/card";
import { Reveal, RevealItem, Stagger } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { about } from "@/data/content";

/** Requirements §S-3. */
export function About() {
  return (
    <Section id="about" labelledBy="about-heading">
      <SectionHeading
        id="about-heading"
        label={about.label}
        title={about.headline}
        highlight={about.highlight}
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <Reveal>
          <p className="max-w-read text-xl leading-relaxed text-fg text-pretty">
            {about.lead}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="max-w-read space-y-5 text-fg-muted">
            {about.body.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
      </div>

      <Stagger as="ul" className="mt-12 grid gap-4 md:grid-cols-3">
        {about.principles.map((principle, index) => (
          <RevealItem as="li" key={principle.title}>
            <Card interactive className="h-full p-6">
              <span className="font-mono text-xs text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg font-medium">{principle.title}</h3>
              <p className="mt-2 text-sm text-fg-muted">{principle.text}</p>
            </Card>
          </RevealItem>
        ))}
      </Stagger>
    </Section>
  );
}
