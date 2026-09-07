import { Button } from "@/components/ui/button";
import { Clock } from "@/components/ui/clock";
import { CodePanel } from "@/components/ui/code-panel";
import { Container } from "@/components/ui/container";
import { hero } from "@/data/content";
import { entriesOf, jsonObjectLines, type JsonValue } from "@/lib/syntax";
import { isResolved } from "@/lib/utils";

const identityLines = jsonObjectLines(
  entriesOf(hero.identity.fields as Record<string, JsonValue>),
);

/** Requirements §S-2. Marquee, commit graph and motion arrive in Phases 2 and 4. */
export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="scroll-mt-24 pt-12 pb-10 md:pt-20 md:pb-15"
    >
      <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
        <div>
          <p className="font-mono text-xs tracking-[0.18em] text-accent uppercase">
            {hero.eyebrow}
          </p>

          <h1
            id="hero-heading"
            className="mt-5 text-[clamp(3rem,10vw,8rem)] leading-[0.92] font-extrabold tracking-[-0.04em] uppercase"
          >
            {hero.name}
          </h1>

          <p className="mt-6 max-w-read text-lg text-fg-muted">
            {hero.tagline}
          </p>

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

          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-panel border border-border bg-border sm:grid-cols-4">
            {hero.status.map((cell) => (
              <div key={cell.key} className="bg-bg-elev px-4 py-3">
                <dt className="font-mono text-[10px] tracking-[0.14em] text-fg-faint uppercase">
                  {cell.key}
                </dt>
                <dd className="mt-1 font-mono text-xs text-fg">
                  {cell.value === "__CLOCK__" ? <Clock /> : cell.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <CodePanel
          filename={hero.identity.filename}
          lines={identityLines}
          caret
          className="lg:justify-self-end lg:self-start"
        />
      </Container>
    </section>
  );
}
