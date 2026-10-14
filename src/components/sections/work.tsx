import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { ScrollRail } from "@/components/ui/scroll-rail";
import { SplitHeading } from "@/components/ui/split-heading";
import { TiltCard } from "@/components/ui/tilt-card";
import { ui, work } from "@/data/content";

/** Career as numbered rows, newest first, in the same rhythm as Skills. */
export function Work() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="scroll-mt-6 overflow-x-clip px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-32"
    >
      <SplitHeading
        id="work-heading"
        lines={[work.title]}
        className="mb-14 text-center text-[clamp(3rem,12vw,160px)] leading-none font-black tracking-tight uppercase sm:mb-20 md:mb-24"
      />

      <ScrollRail className="mx-auto max-w-5xl">
      <ol>
        {work.roles.map((role, index) => (
          <FadeIn
            as="li"
            key={role.id}
            delay={index * 0.1}
            rotateX={-25}
            y={50}
            className="flex flex-col gap-4 border-t border-border py-10 last:border-b sm:flex-row sm:gap-10 md:py-12"
          >
            <p className="hero-heading w-[1.3em] shrink-0 text-[clamp(3rem,10vw,140px)] leading-none font-black tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </p>

            <div className="min-w-0 flex-1">
              <p className="text-xs tracking-widest text-fg-faint uppercase">
                {role.start} — {role.end} · {role.duration}
                {role.current ? (
                  <span className="ml-3 rounded-full border border-success/50 px-2 py-0.5 text-success">
                    {ui.work.current}
                  </span>
                ) : null}
              </p>
              <h3 className="mt-2 text-[clamp(1.1rem,2.2vw,2.1rem)] leading-tight font-medium uppercase">
                {role.title}
              </h3>
              <p className="mt-1 text-fg-muted">
                {role.company}
                {role.type ? ` · ${role.type}` : ""}
              </p>
              <p className="mt-4 max-w-2xl text-[clamp(0.9rem,1.5vw,1.15rem)] leading-relaxed font-light text-fg-muted">
                {role.description}
              </p>

              {role.projects ? (
                <ul className="mt-6 grid gap-3 md:grid-cols-2">
                  {role.projects.map((project) => (
                    <li key={project.name}>
                      <TiltCard max={6} className="h-full rounded-panel border border-border bg-bg-elev/85 p-5">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-start gap-1.5 font-medium hover:text-accent"
                      >
                        {project.name}
                        <ArrowUpRight aria-hidden className="mt-1 size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                      <p className="mt-2 text-sm leading-relaxed font-light text-fg-muted">{project.summary}</p>
                      </TiltCard>
                    </li>
                  ))}
                </ul>
              ) : null}

              <ul className="mt-6 flex flex-wrap gap-2">
                {role.tags.map((tag) => (
                  <li key={tag} className="rounded-full border border-border px-3 py-1 text-xs tracking-wide text-fg-muted">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        ))}
      </ol>
      </ScrollRail>
    </section>
  );
}
