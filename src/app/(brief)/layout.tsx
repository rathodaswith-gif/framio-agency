import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";
import type { ReactNode } from "react";

import { projectFormContent } from "@/content/project-form";
import { siteContent } from "@/content/site";
import "@/styles/project-form.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });

export const metadata: Metadata = {
  title: projectFormContent.metadata.title,
  description: projectFormContent.metadata.description,
  icons: { icon: siteContent.brand.logo.src }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: siteContent.metadata.themeColor
};

export default function BriefLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en" className={`${inter.variable} ${anton.variable}`}><body>{children}</body></html>;
}
