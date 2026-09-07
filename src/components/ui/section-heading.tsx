import { Fragment } from "react";
import { MonoLabel } from "@/components/ui/mono-label";
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

/** Requirements §2.3 — mono label, display heading, drawn accent rule. */
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
    <header className={cn("max-w-3xl", className)}>
      <MonoLabel>{label}</MonoLabel>
      <h2
        id={id}
        className="mt-5 text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.1] font-semibold tracking-[-0.03em] text-balance"
      >
        {lines.map((line) => (
          <span key={line} className="block">
            {withHighlight(line, highlight)}
          </span>
        ))}
      </h2>
      <span aria-hidden className="mt-6 block h-px w-16 bg-accent" />
      {kicker ? (
        <p className="mt-6 max-w-read text-fg-muted">{kicker}</p>
      ) : null}
    </header>
  );
}
