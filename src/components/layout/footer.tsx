import { Container } from "@/components/ui/container";
import { footer, site } from "@/data/content";

/** Requirements §S-9. */
export function Footer() {
  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="grid size-8 shrink-0 place-items-center rounded-lg border border-accent font-mono text-xs text-accent"
          >
            {site.shortName}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium">{site.name}</p>
            <p className="font-mono text-xs text-fg-faint">{footer.line}</p>
          </div>
        </div>

        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs">
          {footer.links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : undefined)}
                className="text-fg-muted transition-colors duration-200 hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#hero"
              className="text-fg-muted transition-colors duration-200 hover:text-accent"
            >
              {footer.backToTop}
            </a>
          </li>
        </ul>
      </Container>
    </footer>
  );
}
