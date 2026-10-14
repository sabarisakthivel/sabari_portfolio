import { ContactButton } from "@/components/ui/contact-button";
import { CopyEmail } from "@/components/ui/copy-email";
import { FadeIn } from "@/components/ui/fade-in";
import { Magnetic } from "@/components/ui/magnetic";
import { SplitHeading } from "@/components/ui/split-heading";
import { PillLink } from "@/components/ui/pill-link";
import { contact, site, ui } from "@/data/content";

/** Closing call to action: big heading, email pill, socials and the details. */
export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-x-clip px-5 pt-16 pb-24 sm:px-8 md:px-10 md:pt-24 md:pb-32"
    >
      {/* turning gradient glow and three orbit rings lying back in 3D */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex h-[34rem] justify-center [perspective:1200px] md:h-[40rem]">
        <span className="glow-orb absolute top-10 size-[22rem] rounded-full md:size-[30rem]" />
        <span
          className="orbit top-16 size-[20rem] md:size-[32rem]"
          style={{ ["--tilt" as string]: "74deg", ["--speed" as string]: "26s" }}
        />
        <span
          className="orbit top-24 size-[16rem] md:size-[26rem]"
          style={{ ["--tilt" as string]: "66deg", ["--yaw" as string]: "18deg", ["--speed" as string]: "19s" }}
        />
        <span
          className="orbit top-6 size-[26rem] md:size-[40rem]"
          style={{ ["--tilt" as string]: "80deg", ["--yaw" as string]: "-14deg", ["--speed" as string]: "34s" }}
        />
      </div>

      <SplitHeading
        id="contact-heading"
        lines={[contact.title]}
        className="text-center text-[clamp(3rem,12vw,160px)] leading-none font-black tracking-tight uppercase"
      />

      <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center text-center md:mt-14">
        <FadeIn as="p" className="text-[clamp(1.25rem,2.6vw,2rem)] leading-tight font-medium uppercase">
          {contact.headline.join(" ")}
        </FadeIn>
        <FadeIn as="p" delay={0.1} className="mt-5 max-w-2xl leading-relaxed font-light text-fg-muted">
          {contact.body}
        </FadeIn>

        <FadeIn delay={0.2} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Magnetic>
            <ContactButton href={`mailto:${site.links.email}`} label={ui.contact.emailLabel} />
          </Magnetic>
          <Magnetic>
            <PillLink href={site.links.linkedin} external>
              {ui.contact.linkedinLabel}
            </PillLink>
          </Magnetic>
          <Magnetic>
            <PillLink href={site.links.github} external>
              {ui.contact.githubLabel}
            </PillLink>
          </Magnetic>
        </FadeIn>

        <FadeIn delay={0.3} className="mt-10 w-full max-w-xl">
          <CopyEmail />
        </FadeIn>

        <FadeIn as="div" delay={0.35} className="mt-8 w-full max-w-xl">
          <dl className="divide-y divide-border border-y border-border text-left">
            {contact.meta.map((row) => (
              <div key={row.key} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3.5">
                <dt className="w-28 shrink-0 text-xs tracking-widest text-fg-faint uppercase">{row.key}</dt>
                <dd className="text-sm text-fg">
                  {row.key === "base" ? (
                    <a
                      href={site.location.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-border underline-offset-4 transition-colors duration-200 hover:text-accent hover:decoration-accent"
                    >
                      {row.value}
                    </a>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </div>
    </section>
  );
}
