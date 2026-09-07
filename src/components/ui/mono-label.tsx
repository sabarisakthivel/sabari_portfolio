import { cn } from "@/lib/utils";

/** Terminal-style label that opens every section, e.g. `01 — // about`. */
export function MonoLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-2.5 font-mono text-xs tracking-[0.12em] text-fg-faint",
        className,
      )}
    >
      <span aria-hidden className="h-px w-6 bg-border-strong" />
      {children}
    </p>
  );
}
