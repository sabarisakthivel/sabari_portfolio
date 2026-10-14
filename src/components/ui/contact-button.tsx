import { ui } from "@/data/content";
import { cn } from "@/lib/utils";

/** The gradient "Contact Me" pill. A link: it jumps to #contact or opens mail. */
export function ContactButton({
  href,
  label = ui.contactButton,
  className,
}: {
  href: string;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "contact-gradient inline-flex items-center justify-center rounded-full whitespace-nowrap",
        "px-8 py-3 text-xs font-medium tracking-widest text-paper uppercase sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base",
        "transition-[filter,transform] duration-200 hover:brightness-115 active:scale-[0.98]",
        className,
      )}
    >
      {label}
    </a>
  );
}
