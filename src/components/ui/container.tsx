import { cn } from "@/lib/utils";

/** Page gutter and max width — Requirements §2.4. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-page px-6 md:px-12", className)}>
      {children}
    </div>
  );
}
