import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { BuildLog } from "@/components/layout/build-log";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SkipLink } from "@/components/layout/skip-link";
import { MotionProvider } from "@/components/motion-provider";
import { built, site, work } from "@/data/content";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Decides before first paint whether the deploy log should play at all.
 *
 * It appends a <style> rather than setting an attribute on <html>: React
 * hydrates and diffs that element, so stamping it pre-hydration produced a
 * "server rendered HTML didn't match" error that `suppressHydrationWarning`
 * did not silence. A style node React never rendered is invisible to hydration
 * and still applies before the overlay is painted.
 */
const INTRO_SKIP_SCRIPT = `try{if(sessionStorage.getItem('sabari:intro-seen')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches){var s=document.createElement('style');s.textContent='.build-log{display:none!important}';document.head.appendChild(s);window.__introSkip=1}}catch(e){}`;

/**
 * Scroll reveals ship with an inline `opacity:0` that only JavaScript resolves.
 * `!important` in a stylesheet outranks a non-important inline style, so this
 * keeps the page readable with scripting turned off.
 */
const NOSCRIPT_REVEAL_CSS =
  "[data-reveal]{opacity:1!important;transform:none!important}.type-char{opacity:1!important}";

/** Requirements §5 — schema.org Person. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  description: site.description,
  url: siteUrl,
  email: `mailto:${site.links.email}`,
  sameAs: [site.links.linkedin, site.links.github],
  address: {
    "@type": "PostalAddress",
    addressLocality: site.location.city,
    addressRegion: site.location.region,
    addressCountry: site.location.country,
  },
  worksFor: {
    "@type": "Organization",
    name: work.roles[0].company,
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: built.education[0].institution,
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: site.title,
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: site.name, url: site.links.linkedin }],
  creator: site.name,
  applicationName: site.name,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "profile",
    url: siteUrl,
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: site.themeColor,
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${jetbrainsMono.variable} dot-grid`}
      >
        {/* Runs before the overlay is parsed, so the skip decision is made
            before the first paint rather than after hydration. */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_SKIP_SCRIPT }} />
        <noscript>
          <style>{NOSCRIPT_REVEAL_CSS}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />

        <MotionProvider>
          <SkipLink />
          <BuildLog />
          <Navbar />
          {children}
          <Footer />
        </MotionProvider>
        {/* The script only exists on Vercel; rendering it elsewhere just logs
            a 404. VERCEL is set automatically on their builds. */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
