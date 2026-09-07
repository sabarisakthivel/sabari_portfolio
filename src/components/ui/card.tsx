import { cn } from "@/lib/utils";

/**
 * Requirements §2.3 — elevated surface, hairline border, 1px inset top
 * highlight. `interactive` adds the hover lift and accent glow.
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
          "transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_10px_36px_-16px_var(--accent-soft)]",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
