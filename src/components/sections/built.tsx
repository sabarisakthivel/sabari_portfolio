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

      <ul className="mt-6 space-y-4 border-t border-border pt-6">
        {project.features.map((feature) => (
          <li key={feature.title}>
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

function RepoCard({ repo }: { repo: Repo }) {
  return (
    <RevealItem as="li">
      <Card interactive className="h-full">
      <a
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-full p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-mono text-sm break-all text-fg">{repo.name}</h3>
          <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-fg-faint transition-colors duration-200 group-hover:text-accent" />
        </div>
        <p className="mt-3 text-sm text-fg-muted">{repo.description}</p>
        <div className="mt-4 flex items-center gap-3 font-mono text-[11px] text-fg-faint">
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="size-2 rounded-full bg-accent-2" />
            {repo.language}
          </span>
          <span aria-hidden className="h-3 w-px bg-border" />
          <span>{repo.role}</span>
        </div>
      </a>
      </Card>
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

      <Stagger className="mt-12 grid gap-6 lg:grid-cols-2">
        {built.featured.map((project) => (
          <FeaturedCard key={project.id} project={project} />
        ))}
      </Stagger>

      <div className="mt-16">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.12em] text-fg-faint uppercase">
            {built.reposLabel}
          </p>
        </Reveal>
        <Stagger as="ul" className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {built.repos.map((repo) => (
            <RepoCard key={repo.name} repo={repo} />
          ))}
        </Stagger>
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.12em] text-fg-faint uppercase">
            {publication.label}
          </p>
          <Card className="mt-4 p-6">
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
          </Card>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="font-mono text-[11px] tracking-[0.12em] text-fg-faint uppercase">
            {ui.built.educationLabel}
          </p>
          <ul className="mt-4 grid gap-4">
            {built.education.map((entry) => (
              <Card as="li" key={entry.institution} className="p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-lg font-medium">
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
              </Card>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
