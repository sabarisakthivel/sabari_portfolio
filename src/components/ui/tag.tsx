import { cn } from "@/lib/utils";

/** Requirements §2.3 — mono 12px chip. */
export function Tag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-tag border border-border bg-bg-elev-2 px-2.5 py-1",
        "font-mono text-xs leading-none text-fg-muted",
        "transition-colors duration-200 hover:border-border-strong hover:text-fg",
        className,
      )}
    >
      {children}
    </span>
  );
}
