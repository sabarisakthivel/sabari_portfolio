import { Button } from "@/components/ui/button";
import { CopyEmail } from "@/components/ui/copy-email";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { contact, site, ui } from "@/data/content";

/** Requirements §S-8. */
export function Contact() {
  return (
    <Section id="contact" labelledBy="contact-heading">
      <SectionHeading
        id="contact-heading"
        label={contact.label}
        title={contact.headline}
        highlight={contact.highlight}
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <p className="max-w-read text-fg-muted">{contact.body}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={`mailto:${site.links.email}`} variant="primary">
              {ui.contact.emailLabel}
            </Button>
            <Button href={site.links.linkedin} external>
              {ui.contact.linkedinLabel}
            </Button>
            <Button href={site.links.github} external>
              {ui.contact.githubLabel}
            </Button>
          </div>
        </div>

        <div>
          <CopyEmail />

          <dl className="mt-6 divide-y divide-border overflow-hidden rounded-panel border border-border">
            {contact.meta.map((row) => (
              <div
                key={row.key}
                className="flex flex-wrap items-baseline gap-x-4 gap-y-1 bg-bg-elev px-4 py-3"
              >
                <dt className="w-24 shrink-0 font-mono text-[10px] tracking-[0.14em] text-fg-faint uppercase">
                  {row.key}
                </dt>
                <dd className="font-mono text-xs text-fg">
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
        </div>
      </div>
    </Section>
  );
}
