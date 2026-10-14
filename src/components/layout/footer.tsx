import { footer, site } from "@/data/content";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto flex max-w-page flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10">
        <p className="text-sm tracking-wide text-fg-faint uppercase">
          <span className="font-medium text-fg">{site.name}</span> · {footer.line}
        </p>

        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm tracking-wider uppercase">
          {footer.links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : undefined)}
                className="text-fg-muted transition-colors duration-200 hover:text-fg"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#hero" className="text-fg-muted transition-colors duration-200 hover:text-fg">
              {footer.backToTop}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
