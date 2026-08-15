import type { ImageContent } from "@/types/content";

export const siteContent = {
  metadata: {
    title: "FRAMIO — Creative & Growth Agency",
    description: "FRAMIO — a premium creative and growth marketing agency.",
    themeColor: "#050505"
  },
  brand: {
    name: "FRAMIO",
    logo: {
      src: "/assets/images/global/framio-logo.png",
      alt: "FRAMIO",
      width: 165,
      height: 76
    } satisfies ImageContent
  },
  routes: {
    home: "/",
    startProject: "/start-project",
    admin: "/admin"
  }
} as const;
