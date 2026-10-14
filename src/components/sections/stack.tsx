import { FadeIn } from "@/components/ui/fade-in";
import { SplitHeading } from "@/components/ui/split-heading";
import { stack } from "@/data/content";

/** The white band: each skill domain as a numbered row. */
export function Stack() {
  return (
    <section
      id="stack"
      aria-labelledby="stack-heading"
      className="scroll-mt-6 rounded-t-[40px] bg-paper px-5 pt-20 pb-36 text-ink sm:rounded-t-[50px] sm:px-8 sm:pt-24 sm:pb-40 md:rounded-t-[60px] md:px-10 md:pt-32 md:pb-48"
    >
      <SplitHeading
        id="stack-heading"
        lines={[stack.title]}
        letterClassName="text-ink"
        className="text-center text-[clamp(3rem,12vw,160px)] leading-none font-black tracking-tight uppercase"
      />
      <FadeIn>
        <p className="mx-auto mt-6 mb-16 max-w-xl text-center font-light text-ink-muted sm:mb-20 md:mb-28">
          {stack.kicker}
        </p>
      </FadeIn>

      <ol className="mx-auto max-w-5xl">
        {stack.groups.map((group, index) => (
          <FadeIn
            as="li"
            key={group.key}
            delay={index * 0.1}
            rotateX={-45}
            y={50}
            className="group flex items-start gap-5 border-t border-ink-line py-8 last:border-b sm:gap-10 sm:py-10 md:py-12"
          >
            <span className="w-[1.3em] shrink-0 text-[clamp(3rem,10vw,140px)] leading-none font-black tabular-nums transition-colors duration-300 group-hover:text-[var(--cta-2)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 pt-1 transition-transform duration-300 group-hover:translate-x-2 sm:pt-3">
              <h3 className="text-[clamp(1rem,2.2vw,2.1rem)] leading-tight font-medium uppercase">
                {group.label}
              </h3>
              <p className="mt-2 max-w-2xl text-[clamp(0.85rem,1.6vw,1.25rem)] leading-relaxed font-light text-ink-muted">
                {group.items.join(" · ")}
              </p>
            </div>
          </FadeIn>
        ))}
      </ol>
    </section>
  );
}
