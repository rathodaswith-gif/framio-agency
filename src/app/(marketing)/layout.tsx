import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";
import type { ReactNode } from "react";

import { siteContent } from "@/content/site";
import "@/styles/home.css";
import "@/styles/hero.css";
import "@/styles/services.css";
import "@/styles/founders.css";
import "@/styles/process.css";
import "@/styles/showcase.css";

// Loaded once and exposed as CSS variables (used by the showcase sections).
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });

export const metadata: Metadata = {
  title: siteContent.metadata.title,
  description: siteContent.metadata.description,
  icons: { icon: siteContent.brand.logo.src }
};

export const viewport: Viewport = {
  themeColor: siteContent.metadata.themeColor,
  width: "device-width",
  initialScale: 1
};

export default function MarketingLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en" className={`${inter.variable} ${anton.variable}`}><body>{children}</body></html>;
}
