import { ScrollRows } from "@/components/ui/scroll-rows";
import { stack } from "@/data/content";
import { TECH_ICONS } from "@/lib/tech-icons";

/**
 * Two rows of tech-stack logos sliding with the scroll. Glyphs are filled with
 * the steel heading gradient and warm to the contact-button gradient on hover.
 */
export function Gallery() {
  const rows = stack.logos.map((row) =>
    row
      .filter((name) => TECH_ICONS[name])
      .map((name) => (
        <div
          key={name}
          className="group flex h-[118px] w-[150px] shrink-0 flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-bg-elev/85 transition-[transform,border-color,box-shadow] duration-300 [transform:perspective(600px)] hover:border-border-strong hover:[box-shadow:0_18px_40px_-12px_var(--cta-glow)] hover:[transform:perspective(600px)_rotateX(12deg)_translateY(-6px)_scale(1.04)] sm:h-[170px] sm:w-[220px] sm:gap-4"
        >
          <svg viewBox="0 0 24 24" className="size-10 sm:size-14">
            <path
              d={TECH_ICONS[name].path}
              className="transition-opacity duration-300 group-hover:opacity-0"
              fill="url(#tech-steel)"
            />
            <path
              d={TECH_ICONS[name].path}
              className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              fill="url(#tech-glow)"
            />
          </svg>
          <span className="text-[11px] tracking-widest text-fg-muted uppercase sm:text-sm">
            {name}
          </span>
        </div>
      )),
  );

  return (
    <section aria-label={stack.logosLabel} className="overflow-x-clip pt-24 pb-10 sm:pt-32 md:pt-40">
      {/* shared gradients for every glyph */}
      <svg aria-hidden width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="tech-steel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: "var(--heading-from)" }} />
            <stop offset="100%" style={{ stopColor: "var(--heading-to)" }} />
          </linearGradient>
          <linearGradient id="tech-glow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" style={{ stopColor: "var(--cta-2)" }} />
            <stop offset="55%" style={{ stopColor: "var(--cta-3)" }} />
            <stop offset="100%" style={{ stopColor: "var(--cta-4)" }} />
          </linearGradient>
        </defs>
      </svg>

      <ul className="sr-only">
        {stack.logos.flat().map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>

      <ScrollRows rows={rows} />
    </section>
  );
}
