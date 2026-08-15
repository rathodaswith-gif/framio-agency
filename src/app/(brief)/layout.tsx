import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { projectFormContent } from "@/content/project-form";
import { siteContent } from "@/content/site";
import "@/styles/project-form.css";

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
  return <html lang="en"><body>{children}</body></html>;
}
