import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
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
      <body className={`${geistSans.variable} ${jetbrainsMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
