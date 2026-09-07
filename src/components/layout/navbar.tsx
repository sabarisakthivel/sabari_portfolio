"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Clock } from "@/components/ui/clock";
import { Container } from "@/components/ui/container";
import { nav, site, ui } from "@/data/content";
import { cn, isResolved } from "@/lib/utils";

/** Items whose href is still a TODO_ placeholder never render (§ content rules). */
const items = nav.filter((item) => isResolved(item.href));

function StatusPill({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-bg-elev px-3 py-1.5 font-mono text-xs text-fg-muted",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-success" />
      {ui.statusOnline}
      <span aria-hidden className="h-3 w-px bg-border" />
      <Clock className="text-fg" />
    </span>
  );
}

function Monogram() {
  return (
    <a href="#hero" className="flex items-center gap-3 rounded-btn">
      <span
        aria-hidden
        className="grid size-8 shrink-0 place-items-center rounded-lg border border-accent font-mono text-xs text-accent"
      >
        {site.shortName}
      </span>
      <span className="hidden leading-tight sm:block">
        <span className="block text-sm font-medium">{site.name}</span>
        <span className="block font-mono text-[11px] text-fg-faint">
          {site.role}
        </span>
      </span>
    </a>
  );
}

/** Requirements §S-1. Active-link underline (M-8) arrives in Phase 4. */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-bg/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <Container className="flex h-16 items-center gap-4">
        <Monogram />

        <nav
          aria-label={ui.nav.ariaLabel}
          className="hidden flex-1 justify-center lg:flex"
        >
          <ul className="flex items-center gap-6 font-mono text-xs">
            {items.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  {...(item.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : undefined)}
                  className="text-fg-muted transition-colors duration-200 hover:text-fg"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <StatusPill className="hidden md:inline-flex" />
          <a
            href={ui.nav.cta.href}
            className="hidden rounded-btn bg-accent px-4 py-2 font-mono text-xs font-medium text-bg transition-[filter] duration-200 hover:brightness-110 sm:inline-block"
          >
            {ui.nav.cta.label}
          </a>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? ui.nav.closeMenu : ui.nav.openMenu}
            onClick={() => setMenuOpen((open) => !open)}
            className="grid size-9 place-items-center rounded-btn border border-border text-fg-muted transition-colors duration-200 hover:border-border-strong hover:text-fg lg:hidden"
          >
            {menuOpen ? (
              <X className="size-4" />
            ) : (
              <Menu className="size-4" />
            )}
          </button>
        </div>
      </Container>

      {menuOpen ? (
        <div className="dot-grid fixed inset-0 top-16 z-40 bg-bg lg:hidden">
          <Container className="flex h-full flex-col gap-8 py-10">
            <nav aria-label={ui.nav.ariaLabel}>
              <ul className="flex flex-col gap-1">
                {items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      {...(item.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : undefined)}
                      className="block border-b border-border py-4 text-2xl font-medium tracking-tight text-fg-muted transition-colors duration-200 hover:text-accent"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-auto flex flex-col gap-4">
              <StatusPill className="self-start" />
              <a
                href={ui.nav.cta.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-btn bg-accent px-4 py-3 text-center font-mono text-sm font-medium text-bg"
              >
                {ui.nav.cta.label}
              </a>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
