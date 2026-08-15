import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { adminContent } from "@/content/admin";
import { siteContent } from "@/content/site";
import "@/styles/admin.css";

export const metadata: Metadata = {
  title: adminContent.metadata.title,
  description: adminContent.metadata.description,
  robots: { index: false, follow: false },
  icons: { icon: siteContent.brand.logo.src }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: siteContent.metadata.themeColor
};

export default function OpsLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
