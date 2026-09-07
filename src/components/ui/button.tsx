import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";

/**
 * Requirements §2.3 — every call to action on the page is a link, so this is
 * an anchor. The arrow nudges right on hover.
 */
export function Button({
  href,
  children,
  variant = "secondary",
  external = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
}) {
  const Icon = external ? ArrowUpRight : ArrowRight;

  return (
    <a
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : undefined)}
      className={cn(
        "group inline-flex items-center gap-2 rounded-btn px-4 py-2.5",
        "font-mono text-sm leading-none whitespace-nowrap",
        "transition-[background-color,border-color,color,transform] duration-200",
        variant === "primary" &&
          "bg-accent font-medium text-bg hover:brightness-110",
        variant === "secondary" &&
          "border border-border text-fg hover:border-border-strong hover:bg-bg-elev",
        className,
      )}
    >
      {children}
      <Icon
        aria-hidden
        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
      />
    </a>
  );
}
