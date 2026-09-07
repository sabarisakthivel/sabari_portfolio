"use client";

import { useEffect, useState } from "react";
import { m } from "motion/react";
import { Menu, X } from "lucide-react";
import { Clock } from "@/components/ui/clock";
import { Container } from "@/components/ui/container";
import { MonogramMark } from "@/components/ui/monogram-mark";
import { nav, site, ui } from "@/data/content";
import { cn, isResolved } from "@/lib/utils";

/** Items whose href is still a TODO_ placeholder never render (§ content rules). */
const items = nav.filter((item) => isResolved(item.href));

/** Anchor targets the observer watches, in document order. */
const sectionIds = items
  .filter((item) => item.href.startsWith("#"))
  .map((item) => item.href.slice(1));

function StatusPill({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-btn border border-border bg-bg-elev px-3 py-1.5 font-mono text-xs text-fg-muted",
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
    // The mark is decorative, and the name beside it is hidden on small
    // screens, so the link carries a screen-reader-only name of its own.
    <a href="#hero" className="flex items-center gap-3 rounded-btn">
      <MonogramMark className="size-7 text-accent" />
      <span className="sr-only">{site.name}</span>
      <span className="hidden leading-tight sm:block">
        <span aria-hidden className="block text-sm font-medium">
          {site.name}
        </span>
        <span className="block font-mono text-[11px] text-fg-faint">
          {site.role}
        </span>
      </span>
    </a>
  );
}

/** Requirements §S-1 and M-8. */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");

  // The band across the middle of the viewport decides which link is lit.
  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting);
        if (hit) setActiveId(hit.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-colors duration-300",
          scrolled
            ? "border-b border-border bg-[var(--scrim)] backdrop-blur-xl"
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
              {items.map((item) => {
                const active = item.href === `#${activeId}`;
                return (
                  <li key={item.label} className="relative">
                    <a
                      href={item.href}
                      aria-current={active ? "true" : undefined}
                      {...(item.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : undefined)}
                      className={cn(
                        "block py-1 transition-colors duration-200 hover:text-fg",
                        active ? "text-fg" : "text-fg-muted",
                      )}
                    >
                      {item.label}
                    </a>
                    {active ? (
                      <m.span
                        layoutId="nav-underline"
                        aria-hidden
                        className="absolute inset-x-0 -bottom-0.5 h-px bg-accent"
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      />
                    ) : null}
                  </li>
                );
              })}
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
              {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </Container>
      </header>

      {/* Deliberately a sibling of the header, not a child. Once scrolled the
          header carries a backdrop-filter, which makes it the containing block
          for any fixed descendant; nested inside, this overlay resolved
          inset-0 / top-16 against a 64px-tall header and collapsed to zero
          height, so the menu drew over the page with no background behind it. */}
      {menuOpen ? (
        <div className="dot-grid fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-bg lg:hidden">
          <Container className="flex min-h-full flex-col gap-8 py-10">
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
    </>
  );
}
