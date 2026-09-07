import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

/** Section landmark with the vertical rhythm from Requirements §2.4. */
export function Section({
  id,
  labelledBy,
  className,
  children,
}: {
  id: string;
  labelledBy: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("scroll-mt-24 py-12 md:py-18", className)}
    >
      <Container>{children}</Container>
    </section>
  );
}
