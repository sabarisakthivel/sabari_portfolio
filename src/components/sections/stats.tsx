import { CountUp } from "@/components/ui/count-up";
import { FadeIn } from "@/components/ui/fade-in";
import { stats } from "@/data/content";

/** Four big numbers that count up once in view. */
export function Stats() {
  return (
    <section
      id="stats"
      aria-labelledby="stats-heading"
      className="px-5 pt-6 pb-28 sm:px-8 sm:pb-32 md:px-10 md:pb-40"
    >
      <FadeIn className="text-center">
        <h2 id="stats-heading" className="text-[clamp(1.5rem,3.4vw,3rem)] leading-tight font-medium uppercase">
          {stats.headline}
        </h2>
        <p className="mt-2 font-light text-fg-muted">{stats.sub}</p>
      </FadeIn>

      <dl className="mx-auto mt-14 grid max-w-7xl grid-cols-2 gap-x-6 gap-y-12 md:mt-20 lg:grid-cols-4 lg:gap-x-10">
        {stats.items.map((item, index) => (
          <FadeIn key={item.label} delay={index * 0.12} rotateX={-60} y={50} className="flex flex-col-reverse items-center justify-end text-center">
            <dt className="mt-3 max-w-[16rem] text-sm leading-snug font-light text-fg-muted">{item.label}</dt>
            <dd className="hero-heading text-[clamp(3.25rem,12vw,6rem)] leading-none font-black tabular-nums lg:text-[clamp(3.5rem,5.6vw,5.5rem)]">
              <CountUp value={item.value} />
              {item.suffix ?? ""}
            </dd>
          </FadeIn>
        ))}
      </dl>
    </section>
  );
}
