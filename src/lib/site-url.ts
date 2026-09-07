import { site } from "@/data/content";
import { isResolved } from "@/lib/utils";

/**
 * Canonical origin, no trailing slash.
 *
 * `site.url` wins once a custom domain is set. Until then Vercel's own
 * production URL stands in — it is injected by the platform, so this still
 * needs no configured environment variables (AC-10). Local builds fall back to
 * the dev origin so `metadataBase` always has something valid to resolve
 * against.
 */
function resolveSiteUrl(): string {
  if (isResolved(site.url)) return site.url.replace(/\/$/, "");

  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercelHost) return `https://${vercelHost}`;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();
