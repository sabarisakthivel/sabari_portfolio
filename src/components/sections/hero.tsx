import { Button } from "@/components/ui/button";
import { Clock } from "@/components/ui/clock";
import { CommitGraph } from "@/components/ui/commit-graph";
import { Container } from "@/components/ui/container";
import { DecodeText } from "@/components/ui/decode-text";
import { Marquee } from "@/components/ui/marquee";
import { Typewriter } from "@/components/ui/typewriter";
import { hero } from "@/data/content";
import { isResolved } from "@/lib/utils";

/** Two ticker rows travelling in opposite directions (M-6). */
const half = Math.ceil(hero.marquee.length / 2);
const marqueeRows = [hero.marquee.slice(0, half), hero.marquee.slice(half)];

/**
 * Requirements §S-2.
 *
 * Two columns from lg: all the copy on the left, the commit graph running the
 * full height on the right. The name previously spanned the full width, which
 * pushed the graph below the divider and left it sitting far lower than its
 * counterpart on the reference.
 *
 * Everything here is on screen at load, so it uses the CSS `enter-up`
 * entrance rather than the scroll-reveal wrappers — those hold content at
 * opacity 0 until hydration, which delays the hero heading's paint and with it
 * the page's LCP.
 */
export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative scroll-mt-24 pt-14 md:pt-20"
    >
      {/* M-15 — slow-drifting wash, purely decorative */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <span className="blob-a absolute -top-44 -left-40 size-[38rem] rounded-full" />
        <span className="blob-b absolute -top-24 right-0 size-[30rem] rounded-full" />
      </div>

      <Container className="grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
        <div className="min-w-0">
          <p className="enter-up font-mono text-xs tracking-[0.2em] text-accent uppercase">
            {hero.eyebrow}
          </p>

          <h1
            id="hero-heading"
            className="enter-up mt-6 text-[clamp(2.75rem,9vw,8rem)] leading-[0.9] font-extrabold tracking-[-0.05em] uppercase"
            style={{ animationDelay: "60ms" }}
          >
            <DecodeText text={hero.name} className="inline-block" />
          </h1>

          {/* M-5 — types in once the name has landed */}
          <Typewriter
            text={hero.tagline}
            startDelayMs={180}
            className="mt-8 max-w-read text-lg leading-relaxed text-fg-muted"
          />

          <div
            className="enter-up mt-8 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "220ms" }}
          >
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

          <dl
            className="enter-up mt-12 grid grid-cols-2 border-t border-l border-border"
            style={{ animationDelay: "300ms" }}
          >
            {hero.status.map((cell) => (
              <div
                key={cell.key}
                className="min-w-0 border-r border-b border-border px-4 py-3.5"
              >
                <dt className="font-mono text-[10px] tracking-[0.16em] text-fg-faint uppercase">
                  {cell.key}
                </dt>
                <dd className="mt-1.5 font-mono text-xs text-fg">
                  {cell.value === "__CLOCK__" ? <Clock /> : cell.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <CommitGraph
          labels={hero.commitGraph}
          className="min-w-0 lg:w-[30rem]"
        />
      </Container>

      <div className="mt-16 border-y border-border bg-bg-elev py-3 md:mt-20">
        {marqueeRows.map((row, index) => (
          <Marquee
            key={index}
            items={row}
            direction={index === 0 ? "left" : "right"}
            durationSeconds={index === 0 ? 40 : 46}
          />
        ))}
      </div>
    </section>
  );
}
