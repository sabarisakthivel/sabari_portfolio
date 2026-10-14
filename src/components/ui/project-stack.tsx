"use client";

import { useRef } from "react";
import Image from "next/image";
import { m, useScroll, useTransform, type MotionValue } from "motion/react";
import { PillLink } from "@/components/ui/pill-link";
import { type FeaturedProject, ui } from "@/data/content";
import { useReducedMotionSafe } from "@/lib/motion";

/**
 * Sticky cards that pile up as you scroll: each one pins near the top and
 * shrinks a little as the next slides over it. Reduced motion keeps them
 * pinned but never scales them.
 */
export function ProjectStack({ projects }: { projects: readonly FeaturedProject[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <div ref={ref}>
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={index}
          total={projects.length}
          progress={scrollYProgress}
        />
      ))}
    </div>
  );
}

const IMAGE_RADIUS = "rounded-[24px] sm:rounded-[40px] md:rounded-[60px]";

function ProjectCard({
  project,
  index,
  total,
  progress,
}: {
  project: FeaturedProject;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const reduced = useReducedMotionSafe();
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  // each card after the first arrives tipped toward the viewer and settles flat
  const rotateX = useTransform(
    progress,
    [Math.max(0, (index - 0.7) / total), index / total],
    index === 0 ? [0, 0] : [14, 0],
  );

  return (
    <div className="sticky top-20 flex min-h-[85svh] items-start justify-center md:top-32">
      <m.article
        style={{
          scale: reduced ? 1 : scale,
          rotateX: reduced ? 0 : rotateX,
          transformPerspective: 1400,
          top: `${index * 28}px`,
        }}
        className="relative w-full max-w-6xl origin-top rounded-[32px] border-2 border-fg bg-bg p-4 sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8"
      >
        <div className="flex flex-col gap-3 px-2 pt-2 sm:flex-row sm:items-start sm:gap-8 md:px-4">
          <span className="hero-heading shrink-0 text-[clamp(2.25rem,10vw,140px)] leading-none font-black">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs tracking-widest text-fg-faint uppercase">{project.kicker}</p>
            <h3 className="mt-1 text-[clamp(1.4rem,3vw,2.6rem)] leading-tight font-medium uppercase">
              {project.name}
            </h3>
            <p className="mt-2 line-clamp-2 max-w-3xl sm:mt-3 text-sm leading-relaxed font-light text-fg-muted sm:line-clamp-none md:text-base">
              {project.description}
            </p>
            <ul className="mt-4 hidden flex-wrap gap-2 sm:flex">
              {project.tech.map((tech) => (
                <li key={tech} className="rounded-full border border-border px-3 py-1 text-xs text-fg-muted">
                  {tech}
                </li>
              ))}
            </ul>
          </div>
          <PillLink href={project.url} external className="self-start">
            {ui.liveProject}
          </PillLink>
        </div>

        <div className="mt-4 grid h-[calc(clamp(100px,16vw,230px)+clamp(120px,22vw,340px)+0.75rem)] grid-cols-[2fr_3fr] gap-3 md:mt-8">
          <div className="flex min-w-0 flex-col gap-3">
            <Image
              src={project.shots.top}
              alt={`${project.name}: home page`}
              width={960}
              height={617}
              sizes="(min-width: 1024px) 440px, 40vw"
              className={`h-[clamp(100px,16vw,230px)] w-full object-cover object-top ${IMAGE_RADIUS}`}
            />
            <Image
              src={project.shots.bottom}
              alt={`${project.name}: inner page`}
              width={960}
              height={617}
              sizes="(min-width: 1024px) 440px, 40vw"
              className={`h-[clamp(120px,22vw,340px)] w-full object-cover object-top ${IMAGE_RADIUS}`}
            />
          </div>
          {/* a phone frame suits the narrow column on phones; wide screens get
              a desktop frame instead of a blown-up phone */}
          <Image
            src={project.shots.tall}
            alt={`${project.name}: on a phone`}
            width={780}
            height={1688}
            sizes="60vw"
            className={`h-full min-h-0 w-full object-cover object-top md:hidden ${IMAGE_RADIUS}`}
          />
          <Image
            src={project.shots.wide}
            alt={`${project.name}: product page`}
            width={960}
            height={617}
            sizes="(min-width: 1024px) 660px, 60vw"
            className={`hidden h-full min-h-0 w-full object-cover object-top md:block ${IMAGE_RADIUS}`}
          />
        </div>
      </m.article>
    </div>
  );
}
