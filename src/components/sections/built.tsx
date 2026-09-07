import { ArrowUpRight } from "lucide-react";
import { BrowserFrame } from "@/components/ui/browser-frame";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal, RevealItem, Stagger } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";
import { built, ui } from "@/data/content";
import type { FeaturedProject, Repo } from "@/data/content";

function FeaturedCard({ project }: { project: FeaturedProject }) {
  return (
    <RevealItem>
      <Card as="article" interactive className="flex h-full flex-col p-6 md:p-8">
        <p className="font-mono text-xs text-accent-2">{project.kicker}</p>

        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-pretty">
          {project.name}
        </h3>

        <p className="mt-4 text-fg-muted">{project.description}</p>

        <ul className="mt-7 border-t border-border">
          {project.features.map((feature) => (
            <li key={feature.title} className="border-b border-border py-4">
              <h4 className="text-sm font-medium">{feature.title}</h4>
              <p className="mt-1 text-sm text-fg-muted">{feature.text}</p>
            </li>
          ))}
        </ul>

        <ul className="mt-6 flex flex-wrap gap-2">
          {project.tech.map((item) => (
            <li key={item}>
              <Tag>{item}</Tag>
            </li>
          ))}
        </ul>

        <BrowserFrame
          domain={project.domainLabel}
          theme={project.mockTheme}
          className="mt-8"
        />

        <div className="mt-6">
          <Button href={project.url} external variant="primary">
            {ui.built.visitLive}
          </Button>
        </div>
      </Card>
    </RevealItem>
  );
}

/** A repository row — a file listing, not a card. */
function RepoRow({ repo }: { repo: Repo }) {
  return (
    <RevealItem as="li" className="border-b border-border">
      <a
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group grid grid-cols-1 items-baseline gap-x-8 gap-y-2 py-5 transition-colors duration-200 hover:bg-bg-elev md:grid-cols-[16rem_minmax(0,1fr)_9rem]"
      >
        <span className="flex items-center gap-2 font-mono text-sm break-all text-fg group-hover:text-accent">
          {repo.name}
          <ArrowUpRight className="size-3.5 shrink-0 text-fg-faint transition-colors duration-200 group-hover:text-accent" />
        </span>
        <span className="text-sm text-fg-muted">{repo.description}</span>
        <span className="flex items-center gap-3 font-mono text-[11px] text-fg-faint md:justify-end">
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="size-2 rounded-full bg-accent-2" />
            {repo.language}
          </span>
          <span aria-hidden className="h-3 w-px bg-border" />
          {repo.role}
        </span>
      </a>
    </RevealItem>
  );
}

/** Requirements §S-7. */
export function Built() {
  const { publication } = built;

  return (
    <Section id="built" labelledBy="built-heading">
      <SectionHeading
        id="built-heading"
        label={built.label}
        title={built.headline}
      />

      <Stagger className="mt-14 grid gap-6 lg:grid-cols-2">
        {built.featured.map((project) => (
          <FeaturedCard key={project.id} project={project} />
        ))}
      </Stagger>

      <div className="mt-20">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.14em] text-fg-faint uppercase">
            {built.reposLabel}
          </p>
        </Reveal>
        <Stagger as="ul" className="mt-5 border-t border-border">
          {built.repos.map((repo) => (
            <RepoRow key={repo.name} repo={repo} />
          ))}
        </Stagger>
      </div>

      <div className="mt-20 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.14em] text-fg-faint uppercase">
            {publication.label}
          </p>
          <div className="mt-5 border-l-2 border-accent pl-6">
            <h3 className="text-lg leading-snug font-medium text-pretty">
              {publication.title}
            </h3>
            <p className="mt-1 font-mono text-xs text-fg-faint">
              {publication.period}
            </p>
            <p className="mt-4 text-sm text-fg-muted">{publication.text}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {publication.tags.map((tag) => (
                <li key={tag}>
                  <Tag>{tag}</Tag>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="font-mono text-[11px] tracking-[0.14em] text-fg-faint uppercase">
            {ui.built.educationLabel}
          </p>
          <ul className="mt-5 border-t border-border">
            {built.education.map((entry) => (
              <li key={entry.institution} className="border-b border-border py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-medium">
                    {entry.degree}
                    <span className="text-fg-muted"> · {entry.field}</span>
                  </h3>
                  <span className="font-mono text-xs text-accent">
                    {entry.score}
                  </span>
                </div>
                <p className="mt-2 text-sm text-fg-muted">
                  {entry.institution} · {entry.location}
                </p>
                <p className="mt-1 font-mono text-xs text-fg-faint">
                  {entry.period}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
