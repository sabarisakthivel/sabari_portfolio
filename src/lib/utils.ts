import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names, with later Tailwind utilities winning. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Values in content.ts that are still unknown are written as `TODO_*`.
 * Anything that fails this check must render nothing — never a placeholder.
 */
export function isResolved(value: string | undefined | null): value is string {
  return typeof value === "string" && value.length > 0 && !value.startsWith("TODO_");
}
