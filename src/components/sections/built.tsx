import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { ProjectStack } from "@/components/ui/project-stack";
import { SplitHeading } from "@/components/ui/split-heading";
import { TiltCard } from "@/components/ui/tilt-card";
import { built } from "@/data/content";

/**
 * Dark panel pulled up over the white Skills band: the two live products as
 * stacking cards, then open source, the publication and education.
 */
export function Built() {
  return (
    <section
      id="built"
      aria-labelledby="built-heading"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-bg px-4 pt-20 pb-24 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32"
    >
      <SplitHeading
        id="built-heading"
        lines={[built.title]}
        className="mb-12 text-center text-[clamp(3rem,12vw,160px)] leading-none font-black tracking-tight uppercase md:mb-16"
      />

      <ProjectStack projects={built.featured} />

      <div className="mx-auto mt-24 max-w-6xl md:mt-32">
        <FadeIn>
          <h3 className="text-center text-[clamp(1.5rem,3.4vw,3rem)] font-medium uppercase">
            {built.moreTitle}
          </h3>
          <p className="mt-2 text-center text-sm tracking-wide text-fg-faint">{built.reposLabel}</p>
        </FadeIn>

        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {built.repos.map((repo, index) => (
            <FadeIn as="li" key={repo.name} delay={index * 0.1} rotateX={-30} y={40}>
              <TiltCard max={6} className="h-full rounded-card">
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-card border border-border bg-bg-elev p-6 transition-colors duration-200 hover:border-border-strong"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="font-medium break-all">{repo.name}</span>
                  <ArrowUpRight
                    aria-hidden
                    className="size-5 shrink-0 text-fg-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                  />
                </span>
                <span className="mt-3 text-sm leading-relaxed font-light text-fg-muted">
                  {repo.description}
                </span>
                <span className="mt-auto flex gap-3 pt-5 text-xs tracking-wide text-fg-faint uppercase">
                  <span>{repo.language}</span>
                  <span aria-hidden>·</span>
                  <span>{repo.role}</span>
                </span>
              </a>
              </TiltCard>
            </FadeIn>
          ))}
        </ul>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <FadeIn className="rounded-card border border-border bg-bg-elev p-6">
            <p className="text-xs tracking-widest text-fg-faint uppercase">
              {built.publication.label} · {built.publication.period}
            </p>
            <p className="mt-2 font-medium">{built.publication.title}</p>
            <p className="mt-3 text-sm leading-relaxed font-light text-fg-muted">
              {built.publication.text}
            </p>
          </FadeIn>

          {built.education.map((edu) => (
            <FadeIn
              key={edu.degree}
              delay={0.1}
              className="rounded-card border border-border bg-bg-elev p-6"
            >
              <p className="text-xs tracking-widest text-fg-faint uppercase">{edu.period}</p>
              <p className="mt-2 font-medium">
                {edu.degree} · {edu.field}
              </p>
              <p className="mt-3 text-sm font-light text-fg-muted">
                {edu.institution}, {edu.location}
              </p>
              <p className="mt-1 text-sm font-light text-fg-muted">{edu.score}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
