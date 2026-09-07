import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { BuildLog } from "@/components/layout/build-log";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SkipLink } from "@/components/layout/skip-link";
import { MotionProvider } from "@/components/motion-provider";
import { Spotlight } from "@/components/ui/spotlight";
import { site } from "@/data/content";
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

const INTRO_SKIP_SCRIPT = `try{if(sessionStorage.getItem('sabari:intro-seen')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.introSkip='1'}}catch(e){document.documentElement.dataset.introSkip='1'}`;

const NOSCRIPT_REVEAL_CSS =
  "[data-reveal]{opacity:1!important;transform:none!important}.type-char{opacity:1!important}";

// Full metadata (OpenGraph, JSON-LD, canonical) lands in Phase 5.
export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

export const viewport: Viewport = {
  themeColor: site.themeColor,
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
        <script
          dangerouslySetInnerHTML={{
            __html: INTRO_SKIP_SCRIPT,
          }}
        />
        {/* Scroll reveals ship with inline opacity:0; without JS they would
            never resolve, so force them visible. `!important` in a stylesheet
            does beat a non-important inline style. */}
        <noscript>
          <style>{NOSCRIPT_REVEAL_CSS}</style>
        </noscript>
        <MotionProvider>
          <SkipLink />
          <BuildLog />
          <Spotlight />
          <Navbar />
          {children}
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
