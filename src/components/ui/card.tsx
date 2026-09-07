import { cn } from "@/lib/utils";

/**
 * A bounded surface, used only where content genuinely needs a frame — the
 * featured projects and the nested role projects. Repeated lists elsewhere use
 * hairline rules instead, so the page does not read as a grid of identical
 * boxes.
 */
export function Card({
  as: Tag = "div",
  interactive = false,
  className,
  children,
  ...rest
}: {
  as?: "div" | "li" | "article";
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      className={cn(
        "inset-top-highlight rounded-card border border-border bg-bg-elev",
        interactive &&
          "transition-[border-color,box-shadow] duration-200 hover:border-border-strong hover:shadow-[var(--lift-strong)]",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
