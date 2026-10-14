import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Outline pill — "Live Project", LinkedIn, GitHub. */
export function PillLink({
  href,
  children,
  external = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : undefined)}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-full border-2 border-fg whitespace-nowrap",
        "px-6 py-2.5 text-xs font-medium tracking-widest text-fg uppercase sm:px-8 sm:py-3 sm:text-sm",
        "transition-colors duration-200 hover:bg-fg/10",
        className,
      )}
    >
      {children}
      {external ? (
        <ArrowUpRight
          aria-hidden
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      ) : null}
    </a>
  );
}
