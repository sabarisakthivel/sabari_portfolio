import { Fragment } from "react";
import { MonoLabel } from "@/components/ui/mono-label";
import { AccentRule, Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/** Wraps the highlighted phrase of a headline in the accent colour. */
function withHighlight(line: string, highlight?: string) {
  if (!highlight) return line;
  const at = line.indexOf(highlight);
  if (at === -1) return line;
  return (
    <Fragment>
      {line.slice(0, at)}
      <span className="text-accent">{highlight}</span>
      {line.slice(at + highlight.length)}
    </Fragment>
  );
}

/** Requirements §2.3 — mono label, display heading, drawn accent rule (M-14). */
export function SectionHeading({
  id,
  label,
  title,
  highlight,
  kicker,
  className,
}: {
  id: string;
  label: string;
  title: string | readonly string[];
  highlight?: string;
  kicker?: string;
  className?: string;
}) {
  const lines = typeof title === "string" ? [title] : title;

  return (
    <Reveal
      as="header"
      className={cn("border-t border-border pt-8", className)}
    >
      <MonoLabel>{label}</MonoLabel>

      {/* Wide enough that each headline line fits on one row on desktop, and no
          `text-balance` — balancing actively splits a line that would fit. */}
      <div className="mt-5 max-w-5xl">
        <h2
          id={id}
          className="text-[clamp(1.875rem,4vw,3rem)] leading-[1.08] font-semibold tracking-[-0.035em]"
        >
          {lines.map((line) => (
            <span key={line} className="block">
              {withHighlight(line, highlight)}
            </span>
          ))}
        </h2>
        <AccentRule className="mt-6" />
        {kicker ? (
          <p className="mt-6 max-w-read text-fg-muted">{kicker}</p>
        ) : null}
      </div>
    </Reveal>
  );
}
