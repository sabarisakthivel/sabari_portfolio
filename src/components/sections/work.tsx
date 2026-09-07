import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Reveal, RevealItem, Stagger } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";
import { Timeline, TimelineDot } from "@/components/ui/timeline";
import { ui, work } from "@/data/content";
import type { Role, RoleProject } from "@/data/content";

function ProjectCard({ project }: { project: RoleProject }) {
  return (
    <RevealItem as="li">
      <Card interactive className="h-full p-5">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start justify-between gap-3"
        >
          <h4 className="text-base leading-snug font-medium text-pretty">
            {project.name}
          </h4>
          <ArrowUpRight className="mt-1 size-4 shrink-0 text-fg-faint transition-colors duration-200 group-hover:text-accent" />
        </a>
        <p className="mt-3 text-sm text-fg-muted">{project.summary}</p>
        <ul className="mt-4 space-y-2">
          {project.bullets.map((bullet) => (
            <li
              key={bullet.slice(0, 32)}
              className="flex gap-2.5 text-sm text-fg-muted"
            >
              <span
                aria-hidden
                className="mt-2 size-1 shrink-0 rounded-full bg-accent"
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </Card>
    </RevealItem>
  );
}

function TimelineNode({ role, isFirst }: { role: Role; isFirst: boolean }) {
  return (
    <li className="relative pl-8 md:pl-10">
      <TimelineDot />

      <Reveal>
        <p className="font-mono text-xs text-fg-faint">
          <span className="text-accent-2">{role.release}</span>
          {isFirst ? <span> — {ui.work.head}</span> : null}
        </p>

        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-pretty">
          {role.company}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-fg-muted">
          <span className="text-fg">{role.title}</span>
          {role.current ? (
            <span className="rounded-tag border border-success/40 bg-success/10 px-1.5 py-0.5 text-[10px] leading-none text-success">
              {ui.work.current}
            </span>
          ) : null}
          <span aria-hidden className="h-3 w-px bg-border" />
          <span>
            {role.start} → {role.end} · {role.duration}
          </span>
        </div>

        <p className="mt-1 font-mono text-xs text-fg-faint">
          {[role.type, role.location].filter(Boolean).join(" · ")}
        </p>

        <p className="mt-5 max-w-read text-fg-muted">{role.description}</p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {role.tags.map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>
      </Reveal>

      {role.projects?.length ? (
        <>
          <Reveal>
            <p className="mt-8 font-mono text-[11px] tracking-[0.12em] text-fg-faint uppercase">
              {ui.work.projectsLabel}
            </p>
          </Reveal>
          <Stagger as="ul" className="mt-3 grid gap-4 lg:grid-cols-2">
            {role.projects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </Stagger>
        </>
      ) : null}
    </li>
  );
}

/** Requirements §S-4. */
export function Work() {
  return (
    <Section id="work" labelledBy="work-heading">
      <SectionHeading
        id="work-heading"
        label={work.label}
        title={work.headline}
      />

      <Timeline className="mt-12">
        <ol className="space-y-16">
          {work.roles.map((role, index) => (
            <TimelineNode key={role.id} role={role} isFirst={index === 0} />
          ))}
        </ol>
      </Timeline>
    </Section>
  );
}
