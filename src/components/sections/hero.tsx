import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Clock } from "@/components/ui/clock";
import { CodePanel } from "@/components/ui/code-panel";
import { CommitGraph } from "@/components/ui/commit-graph";
import { Container } from "@/components/ui/container";
import { Marquee } from "@/components/ui/marquee";
import { Reveal, RevealItem, Stagger } from "@/components/ui/reveal";
import { Tilt } from "@/components/ui/tilt";
import { Typewriter } from "@/components/ui/typewriter";
import { hero } from "@/data/content";
import { entriesOf, jsonObjectLines, type JsonValue } from "@/lib/syntax";
import { isResolved } from "@/lib/utils";

const identityLines = jsonObjectLines(
  entriesOf(hero.identity.fields as Record<string, JsonValue>),
);

/** Two ticker rows travelling in opposite directions (M-6). */
const half = Math.ceil(hero.marquee.length / 2);
const marqueeRows = [hero.marquee.slice(0, half), hero.marquee.slice(half)];

/** Requirements §S-2. */
export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative scroll-mt-24 pt-12 md:pt-20"
    >
      {/* M-15 — slow-drifting wash, purely decorative */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <span className="blob-a absolute -top-40 -left-32 size-[36rem] rounded-full" />
        <span className="blob-b absolute -top-20 right-0 size-[30rem] rounded-full" />
      </div>

      <Container className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
        <div>
          <Reveal>
            <p className="font-mono text-xs tracking-[0.18em] text-accent uppercase">
              {hero.eyebrow}
            </p>

            <h1
              id="hero-heading"
              className="mt-5 text-[clamp(3rem,10vw,8rem)] leading-[0.92] font-extrabold tracking-[-0.04em] uppercase"
            >
              {hero.name}
            </h1>
          </Reveal>

          {/* M-5 — types in once the name has landed */}
          <Typewriter
            text={hero.tagline}
            startDelayMs={700}
            className="mt-6 max-w-read text-lg text-fg-muted"
          />

          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href={hero.ctas.primary.href} variant="primary">
                {hero.ctas.primary.label}
              </Button>
              <Button href={hero.ctas.secondary.href}>
                {hero.ctas.secondary.label}
              </Button>
              {/* TODO: resume button renders once site.links.resume is set */}
              {isResolved(hero.ctas.resume.href) ? (
                <Button href={hero.ctas.resume.href} external>
                  {hero.ctas.resume.label}
                </Button>
              ) : null}
            </div>
          </Reveal>

          <CommitGraph labels={hero.commitGraph} className="mt-10" />

          <Stagger
            as="dl"
            className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-panel border border-border bg-border sm:grid-cols-4"
          >
            {hero.status.map((cell) => (
              <RevealItem key={cell.key} className="bg-bg-elev px-4 py-3">
                <dt className="font-mono text-[10px] tracking-[0.14em] text-fg-faint uppercase">
                  {cell.key}
                </dt>
                <dd className="mt-1 font-mono text-xs text-fg">
                  {cell.value === "__CLOCK__" ? <Clock /> : cell.value}
                </dd>
              </RevealItem>
            ))}
          </Stagger>
        </div>

        {/* M-4 — panel tilts with the pointer */}
        <Tilt className="w-full lg:sticky lg:top-24">
          <CodePanel
            filename={hero.identity.filename}
            lines={identityLines}
            caret
          />
        </Tilt>
      </Container>

      <div className="mt-16 border-y border-border py-3 md:mt-24">
        {marqueeRows.map((row, index) => (
          <Marquee
            key={index}
            items={row}
            direction={index === 0 ? "left" : "right"}
            durationSeconds={index === 0 ? 40 : 46}
          />
        ))}
      </div>

      <Container className="flex justify-center py-8">
        <a
          href="#about"
          className="group flex flex-col items-center gap-1.5 font-mono text-[11px] tracking-[0.14em] text-fg-faint uppercase transition-colors duration-200 hover:text-accent"
        >
          {hero.scrollLabel}
          <ChevronDown aria-hidden className="scroll-nudge size-4" />
        </a>
      </Container>
    </section>
  );
}
